import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth"
import DashboardClient from "@/components/DashboardClient";

export default async function Dashboard(){
    const session = await getServerSession(authOptions);
    return (
        <DashboardClient session={session} />
    )
}