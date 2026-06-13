import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/config/db"

export const authOptions : NextAuthOptions = {
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
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }

            return session;
        },
    },
};

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }