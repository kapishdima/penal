import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { account } from "@/lib/auth-schema";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = getAuth();
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const githubAccount = await db
    .select()
    .from(account)
    .where(
      and(
        eq(account.userId, session.user.id),
        eq(account.providerId, "github"),
      ),
    )
    .limit(1);

  if (!githubAccount.length || !githubAccount[0].accessToken) {
    return NextResponse.json(
      { error: "GitHub not connected", connected: false },
      { status: 400 },
    );
  }

  const token = githubAccount[0].accessToken;
  const url = new URL(req.url);
  const participating = url.searchParams.get("participating") === "true";

  try {
    const res = await fetch(
      `https://api.github.com/notifications?all=true&participating=${participating}&per_page=30`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "GitHub API error" },
        { status: res.status },
      );
    }

    const data = await res.json();

    const notifications = data.map(
      (n: {
        id: string;
        unread: boolean;
        reason: string;
        updated_at: string;
        subject: { title: string; type: string; url: string | null };
        repository: { full_name: string; html_url: string };
      }) => ({
        id: n.id,
        unread: n.unread,
        reason: n.reason,
        updatedAt: n.updated_at,
        title: n.subject.title,
        type: n.subject.type,
        subjectUrl: n.subject.url,
        repo: n.repository.full_name,
        repoUrl: n.repository.html_url,
      }),
    );

    return NextResponse.json({ notifications, connected: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  const auth = getAuth();
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const githubAccount = await db
    .select()
    .from(account)
    .where(
      and(
        eq(account.userId, session.user.id),
        eq(account.providerId, "github"),
      ),
    )
    .limit(1);

  if (!githubAccount.length || !githubAccount[0].accessToken) {
    return NextResponse.json({ error: "GitHub not connected" }, { status: 400 });
  }

  const token = githubAccount[0].accessToken;
  const body = await req.json();
  const threadId = body.threadId as string;

  try {
    const res = await fetch(
      `https://api.github.com/notifications/threads/${threadId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
      },
    );

    if (!res.ok && res.status !== 205) {
      return NextResponse.json(
        { error: "Failed to mark as read" },
        { status: res.status },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to mark as read" },
      { status: 500 },
    );
  }
}
