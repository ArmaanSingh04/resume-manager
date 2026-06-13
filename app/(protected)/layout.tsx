import React from "react"

import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export default async function ProtectedLayout({children} : {children: React.ReactNode}){
    const session = await getServerSession(authOptions)
    
    if(session?.user?.email){
        return(
            <div>{children}</div>
        )
    }
    else{
        redirect('/login')
    }
}