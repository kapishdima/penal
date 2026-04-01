import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { account } from "@/lib/auth-schema";

export const dynamic = "force-dynamic";

const CONTRIBUTIONS_QUERY = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              color
            }
          }
        }
      }
    }
  }
`;

export async function GET() {
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
  const username = githubAccount[0].accountId;

  // Fetch GitHub username from API if accountId is numeric
  let login = username;
  try {
    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (userRes.ok) {
      const userData = await userRes.json();
      login = userData.login;
    }
  } catch {}

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables: { username: login },
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "GitHub API error" },
        { status: res.status },
      );
    }

    const data = await res.json();
    const calendar =
      data.data?.user?.contributionsCollection?.contributionCalendar;

    if (!calendar) {
      return NextResponse.json(
        { error: "Could not fetch contributions" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks,
      connected: true,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch contributions" },
      { status: 500 },
    );
  }
}
