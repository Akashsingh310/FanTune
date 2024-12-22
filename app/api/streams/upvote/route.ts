import { prismaclient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";


const UpvoteSchema = z.object({
    streamId : z.string()
})


export async function POST(req:NextRequest) {
    const session  = await getServerSession();

    const user  = await prismaclient.user.findFirst({
        where:{
            email:session?.user?.email ?? ""
        }
    });

    if(!user)
    {
        return NextResponse.json(
            {
              message: "Unauthenticated",
            },
            {
              status: 403,
            },
          );
    }

    try{
        const data = UpvoteSchema.parse(await req.json());
        await prismaclient.upvote.create({
            data : {
                userId:user.id,
                streamId:data.streamId,
                isUpvote: true
            }
        });
        return NextResponse.json({
          message: "Done"
        })
    }
    catch(e)
    {
        return NextResponse.json(
            {
              message: "Error while Upvoting",
            },
            {
              status: 403,
            },
          );
    }

}

