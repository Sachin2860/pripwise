import { generateObject } from "ai";
import { z } from "zod";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { db } from "@/Firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { NextResponse } from "next/server";

// Define the schema for the AI's response
const interviewSchema = z.object({
  questions: z
    .array(z.string())
    .describe("The list of interview questions"),
});

export async function GET() {
  return Response.json({ success: true, data: "Thank You!" }, { status: 200 });
}

export async function POST(request: Request) {
  const { type, role, level, techstack, userid, amount } =
    await request.json();

  try {
    // Manually read the environment variable
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      console.error("GOOGLE_GENERATIVE_AI_API_KEY is not defined!");
      throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not defined in .env.local");
    }

    // 2. Create a new provider instance with the API key
    const google = createGoogleGenerativeAI({
      apiKey: apiKey,
    });

    // 3. Use your new provider to get the model
    const googleModel = google("gemini-2.0-flash-001");

    const { object } = await generateObject({
      model: googleModel, // Use the model from your provider
      schema: interviewSchema,
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        The questions are going to be read by a voice assistant so do not use slashes, asterisks, or any other special characters which might break the voice assistant.
      `,
    });

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(","),
      questions: object.questions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in POST route:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}