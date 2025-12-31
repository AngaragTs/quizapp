import prisma from "./prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

/**
 * Get or create a user in the database based on Clerk authentication
 * Call this in any API route that needs user data
 */
export async function getOrCreateUser() {
  const { userId: clerkId } = await auth();

  console.log("🔍 getOrCreateUser called, clerkId:", clerkId);

  if (!clerkId) {
    console.log("❌ No clerkId found");
    return null;
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    console.log("❌ Could not get Clerk user");
    return null;
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null;

  if (!email) {
    console.log("❌ No email found");
    return null;
  }

  // Use upsert to handle both new users and existing emails
  // First try to find by clerkId, if not found, try by email and update clerkId
  let user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    // Check if user exists with this email (from manual entry)
    user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // Update existing user with new clerkId
      console.log("📝 Updating existing user with clerkId:", email);
      user = await prisma.user.update({
        where: { email },
        data: { clerkId, name },
      });
      console.log("✅ User updated with clerkId:", user.email);
    } else {
      // Create new user
      console.log("📝 Creating new user:", { clerkId, email, name });
      user = await prisma.user.create({
        data: {
          clerkId,
          email,
          name,
        },
      });
      console.log("✅ User created:", user.email);
    }
  } else {
    console.log("🔍 Found existing user by clerkId:", user.email);
  }

  return user;
}

/**
 * Sync user data from Clerk to database
 * Used by webhooks when user signs up or updates their profile
 */
export async function syncUserFromClerk(
  clerkId: string,
  email: string,
  name: string | null
) {
  const user = await prisma.user.upsert({
    where: { clerkId },
    update: {
      email,
      name,
    },
    create: {
      clerkId,
      email,
      name,
    },
  });

  return user;
}

/**
 * Delete user from database
 * Used by webhooks when user deletes their account
 */
export async function deleteUserByClerkId(clerkId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (user) {
    await prisma.user.delete({
      where: { clerkId },
    });
  }

  return user;
}
