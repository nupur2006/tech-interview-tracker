"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function deleteAccount() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Delete user from DB. Prisma Cascade handles relations (Accounts, Sessions, Applications, etc)
  await prisma.user.delete({
    where: { id: session.user.id },
  });

  // Client side router handles redirect, but we can also just return success.
  return { success: true };
}
