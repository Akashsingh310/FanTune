import { prismaclient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
const YT_REGEX =  new RegExp("(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})")


const CreateStreamSchema = z.object({
    creatorId : z.string(),
    url: z.string()
})

export async function POST(req:NextRequest) {
    try{
        const data = CreateStreamSchema.parse(await req.json());
        const isyt = YT_REGEX.test(data.url);
        if(!isyt)
        {
            return NextResponse.json({
                message:"Wrong URL"
            },{
                status: 411 
            })
        }

        const extractedId = data.url.split("?v=")[1];

        await prismaclient.stream.create({

            data: {
                userId: data.creatorId,
                url:data.url,
                extractedId,
                type:"Youtube"
            }
        });
    }catch(e)
    {
        return NextResponse.json({
            message:"Error While reading a stream"
        },{
            status: 411 
        })
    }

}