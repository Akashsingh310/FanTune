import { prismaclient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";


const UpvoteSchema = z.object({
    streamId : z.string()
})


export async function POST(req: NextRequest) {
  const session = await getServerSession();

  const user = await prismaclient.user.findFirst({
    where: {
      email: session?.user?.email ?? "",
    },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Unauthenticated" },
      { status: 403 }
    );
  }

  try {
    const data = UpvoteSchema.parse(await req.json());

    // Check if the user has already upvoted
    const existingVote = await prismaclient.upvote.findUnique({
      where: {
        userId_streamId: {
          userId: user.id,
          streamId: data.streamId,
        },
      },
    });

    if (existingVote) {
      // Remove the upvote
      await prismaclient.upvote.delete({
        where: {
          userId_streamId: {
            userId: user.id,
            streamId: data.streamId,
          },
        },
      });

      // Decrement the votes count
      await prismaclient.stream.update({
        where: { id: data.streamId },
        data: { votes: { decrement: 1 } },
      });
    }

    return NextResponse.json({ message: "Done" });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Error while downvoting" },
      { status: 403 }
    );
  }
}


