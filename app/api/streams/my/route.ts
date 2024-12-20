import { prismaclient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
        
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
            userId: user.id
        }
    })

    return NextResponse.json({
        streams
    })
}