import { prismaclient } from "@/app/lib/db";
import { PrismaClientRustPanicError } from "@prisma/client/runtime/library";
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";


const handler = NextAuth({
    providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID ?? "",
          clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
      ],
      //testing
      // callbacks:{
      //   async signIn(params){
      //     console.log(params);
      //     if(!params.user.email)
      //     {
      //       return false;
      //     }
      //     try{
      //       await prismaclient.user.create({
      //         data:{
      //           email: params.user.email,
      //           provider:"Google"
      //         }
      //     });
      //   }
      //   catch(e)
      //   {

      //   }
      //   return true;
      // }
    // }
})

export { handler as GET, handler as POST }