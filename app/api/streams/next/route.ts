import { prismaclient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function GET()
{
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


    const mostUpvoted = await prismaclient.stream.findFirst({
        where:{
            userId:user.id,
            played:false
        },
        orderBy:{
            upvotes:{
                _count:'desc'
            }
        }
    });

    await Promise.all([prismaclient.currentStream.upsert({
        where:{
            userId:user.id
        },
        update:{
            streamId:mostUpvoted?.id
        },
        create:{
            userId:user.id,
            streamId:mostUpvoted?.id
        }
    }),prismaclient.stream.update({
        where:{
            id:mostUpvoted?.id
        },
        data:{
            played:true,
            playedTs:new Date()
        }
    })])

    return NextResponse.json({
        stream:mostUpvoted
    })
}
