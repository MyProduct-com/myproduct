import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { AUTH_DISABLED } from "@/lib/authFlags";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  name: z.string().min(1).max(80),
  // Present while AUTH_DISABLED and there's no real session — identifies
  // which seeded demo user to update instead. Ignored once real auth is on.
  demoEmail: z.string().email().optional(),
});

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { name, demoEmail } = parsed.data;

  let email = session?.user?.email;
  if (!email) {
    if (!AUTH_DISABLED) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
    email = demoEmail;
  }
  if (!email) return NextResponse.json({ error: "No account to update." }, { status: 400 });

  try {
    const user = await prisma.user.update({ where: { email }, data: { name } });
    return NextResponse.json({ name: user.name });
  } catch {
    return NextResponse.json({ error: "Could not reach the database. Your name will update once it's connected." }, { status: 503 });
  }
}
