import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/config/db"

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "email", type: "email", placeholder: "jsmith@gmail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {

                const credEmail = credentials?.email as string;
                const credPassword = credentials?.password as string;
                
                const user = await prisma.user.findFirst({
                
                    where:{
                        email: credEmail
                    }
                })

                if(user){
                    // check for password
                    if(user.password == credPassword){
                        console.log(user);
                        return {
                            id: user.id.toString(),
                            email: user.email
                        };
                    }
                }

                return null;
            }
        })
    ]
};

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }