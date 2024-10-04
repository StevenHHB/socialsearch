"server only";

import prisma from "@/lib/prisma";

export const isAuthorized = async (
  userId: string
): Promise<{ authorized: boolean; message: string }> => {
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      return {
        authorized: false,
        message: "User not found",
      };
    }

    return {
      authorized: true,
      message: "User exists in the database",
    };
  } catch (error) {
    console.error("Error in isAuthorized:", error);
    return {
      authorized: false,
      message: "Error checking authorization",
    };
  }
};