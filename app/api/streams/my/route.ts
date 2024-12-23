import { prismaclient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function GET() {
        
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
    
    const streams = await prismaclient.stream.findMany({
        where: {
            userId: user.id,
        },
        include: {
            _count: {
                select: {
                    upvotes: true,
                },
            },
            upvotes:{
                where:{
                    userId:user.id,
                }
            }
        },
    });

    const formattedStreams = streams.map(({ _count, ...rest }) => ({
        ...rest,
        upvotesCount: _count.upvotes, 
        haveUpvoted: rest.upvotes.length ? true:false
    }));

    return NextResponse.json({
        streams: formattedStreams,
    })
}