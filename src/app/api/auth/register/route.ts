import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  role: z.enum(["customer", "seller"]).default("customer"),
  storeName: z.string().optional(),
  storeCategory: z.string().optional(),
  location: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { name, email, password, phone, role, storeName, location } = parsed.data;

  if (role === "seller" && !storeName?.trim()) {
    return NextResponse.json({ error: "Store name is required for seller accounts." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      passwordHash,
      role: role === "seller" ? "SELLER" : "CUSTOMER",
      ...(role === "seller"
        ? {
            sellerProfile: {
              create: {
                storeName: storeName!,
                storeSlug: `${storeName!.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`,
                storeDescription: "",
                location,
              },
            },
          }
        : {}),
    },
  });

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}
