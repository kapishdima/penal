import { toNextJsHandler } from "better-auth/next-js";
import type { NextRequest } from "next/server";
import { getAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

let _handler: ReturnType<typeof toNextJsHandler> | null = null;

function getHandler() {
  if (!_handler) {
    _handler = toNextJsHandler(getAuth().handler);
  }
  return _handler;
}

export async function GET(req: NextRequest) {
  return getHandler().GET(req);
}

export async function POST(req: NextRequest) {
  return getHandler().POST(req);
}
