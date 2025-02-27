import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { addDays, isBefore } from "date-fns";

const creditActionSchema = z.object({
  action: z.enum([
    "REWARD_VIDEO",
    "REWARD_SUBSCRIBE",
    "REWARD_LIKE",
    "REWARD_PARTNER",
  ]),
  details: z.string().optional(),
});

const creditAmounts = {
  REWARD_VIDEO: 2,
  REWARD_SUBSCRIBE: 5,
  REWARD_LIKE: 1,
  REWARD_PARTNER: 3,
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure we have a user ID from the session
    const userId = session.user.id as string;
    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 400 });
    }

    const body = await req.json();
    const { action, details } = creditActionSchema.parse(body);

    // Check if user has already performed this action today
    const existingAction = await db.creditAction.findUnique({
      where: {
        userId_actionType: {
          userId: userId,
          actionType: action,
        },
      },
    });

    const now = new Date();
    
    // If the action exists and was performed less than 24 hours ago
    if (existingAction && isBefore(now, addDays(existingAction.lastPerformed, 1))) {
      return NextResponse.json({ 
        error: "You can only perform this action once per day",
        nextAvailable: addDays(existingAction.lastPerformed, 1)
      }, { status: 429 });
    }

    const creditAmount = creditAmounts[action];

    // Begin transaction to ensure all operations succeed or fail together
    const result = await db.$transaction(async (tx: any) => {
      // Update or create the credit action record
      if (existingAction) {
        await tx.creditAction.update({
          where: {
            id: existingAction.id
          },
          data: {
            lastPerformed: now
          }
        });
      } else {
        await tx.creditAction.create({
          data: {
            userId: userId,
            actionType: action,
            lastPerformed: now
          }
        });
      }

      // Add credits to user
      const updatedUser = await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          credits: {
            increment: creditAmount,
          },
        },
        select: {
          id: true,
          credits: true,
        },
      });

      // Record credit transaction
      await tx.creditTransaction.create({
        data: {
          userId: userId,
          amount: creditAmount,
          type: action,
          details: details || action.replace("REWARD_", ""),
        },
      });

      return updatedUser;
    });

    return NextResponse.json({
      credits: result.credits,
      added: creditAmount,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("[CREDITS_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure we have a user ID from the session
    const userId = session.user.id as string;
    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        credits: true,
      },
    });

    const transactions = await db.creditTransaction.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    // Get all credit actions to check availability
    const creditActions = await db.creditAction.findMany({
      where: {
        userId: userId,
      },
    });

    // Calculate next available time for each action
    const now = new Date();
    const actionAvailability = Object.values(creditActionSchema.shape.action.enum).reduce((acc, action) => {
      const actionRecord = creditActions.find((record: any) => record.actionType === action);
      
      if (actionRecord) {
        const nextAvailable = addDays(actionRecord.lastPerformed, 1);
        acc[action] = {
          available: isBefore(nextAvailable, now),
          nextAvailable: isBefore(nextAvailable, now) ? null : nextAvailable
        };
      } else {
        acc[action] = { available: true, nextAvailable: null };
      }
      
      return acc;
    }, {} as Record<string, { available: boolean; nextAvailable: Date | null }>);

    return NextResponse.json({
      credits: user?.credits || 0,
      transactions,
      actionAvailability
    });
  } catch (error) {
    console.error("[CREDITS_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}