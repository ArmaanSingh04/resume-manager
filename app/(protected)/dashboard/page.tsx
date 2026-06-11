import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth"

export default async function Dashboard(){
    const session = await getServerSession(authOptions);
    return (
        <div>{session?.user?.email}</div>
    )
}