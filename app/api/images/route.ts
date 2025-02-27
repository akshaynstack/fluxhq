import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const generateSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  size: z.string().default("1024x1024"),
  model: z.string().default("stable-diffusion-v1-5"),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { prompt, size, model } = generateSchema.parse(body);

    // Get user with current credit balance
    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        credits: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has enough credits
    if (user.credits < 1) {
      return NextResponse.json(
        { error: "Not enough credits" },
        { status: 402 }
      );
    }

    // Call the AI image generation API
    const response = await fetch("https://beta.vasarai.net/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        prompt: prompt.trim(),
        n: 1,
        size,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error?.message || "API error" },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Deduct credit from user
    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        credits: {
          decrement: 1,
        },
      },
    });

    // Record credit transaction
    await db.creditTransaction.create({
      data: {
        userId: user.id,
        amount: -1,
        type: "GENERATION",
        details: `Image generation: ${prompt.substring(0, 30)}...`,
      },
    });

    // Save generated image
    const image = await db.image.create({
      data: {
        url: data.data[0].url,
        prompt: prompt.trim(),
        size,
        userId: user.id,
      },
    });

    return NextResponse.json({
      image: {
        id: image.id,
        url: image.url,
        prompt: image.prompt,
        size: image.size,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("[IMAGE_GENERATION_ERROR]", error);
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

    const images = await db.image.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ images });
  } catch (error) {
    console.error("[IMAGES_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}