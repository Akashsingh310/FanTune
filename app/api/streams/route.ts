import { prismaclient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
// @ts-expect-error: No TypeScript type definition for youtube-search-api module
import youtubesearchapi from "youtube-search-api";
import { YT_REGEX } from "@/app/lib/utils";
import { getServerSession } from "next-auth";


const CreateStreamSchema = z.object({
    creatorId : z.string(),
    url: z.string()
})

export async function POST(req:NextRequest) {
    try{
        const data = CreateStreamSchema.parse(await req.json());
        const isyt = data.url.match(YT_REGEX);
        if(!isyt)
        {
            return NextResponse.json({
                message:"Wrong URL"
            },{
                status: 411 
            })
        }

        const extractedId = data.url.split("?v=")[1];

        const res = await youtubesearchapi.GetVideoDetails(extractedId)
        
        const thumbnails = res.thumbnail.thumbnails;
        thumbnails.sort((a: { width: number }, b: { width: number }) =>
            a.width < b.width ? -1 : 1,
        );

        
        // console.log(JSON.stringify(res.thumbnail.thumbnails));
        const stream = await prismaclient.stream.create({

            data: {
                userId: data.creatorId,
                url:data.url,
                extractedId,
                type:"Youtube",
                title:res.title ?? "Can't find Video",
                smallImg:(thumbnails.length > 1 ? thumbnails[thumbnails.length - 2].url : thumbnails[thumbnails.length - 1].url) ?? "https://unsplash.com/photos/desk-with-stationary-studio-shot-on-wooden-background-ieIWTOQIc0w",
                bigImg: thumbnails[thumbnails.length-1].url ?? "https://unsplash.com/photos/desk-with-stationary-studio-shot-on-wooden-background-ieIWTOQIc0w"
            }
        });

        return NextResponse.json({
           ...stream,
           haveUpvoted : false,
           votes:0
        })
    }catch(e)
    {
        console.log(e);
        return NextResponse.json({
            message:"Error While reading a stream"
        },{
            status: 411 
        })
    }

}

export async function GET(req:NextRequest) {
    const creatorId = req.nextUrl.searchParams.get("creatorId");
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
    if(!creatorId){
        return NextResponse.json({
            message:"Error"
        },{
            status: 411
        })
    }
    const [streams,activeStream] = await Promise.all([await prismaclient.stream.findMany({
        where: {
            userId: creatorId,
            played: false
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
    }),await prismaclient.currentStream.findFirst({
        where: {
            userId: creatorId,
        },
        include: {
            stream:true
        }
    })]);

    const formattedStreams = streams.map(({ _count, ...rest }) => ({
        ...rest,
        upvotesCount: _count.upvotes, 
        haveUpvoted: rest.upvotes.length ? true:false
    }));

    return NextResponse.json({
        streams: formattedStreams,
        activeStream
    })
}