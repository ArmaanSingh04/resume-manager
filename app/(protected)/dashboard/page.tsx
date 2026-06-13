import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth"
import DashboardClient from "@/components/DashboardClient";
import { getUserFiles } from "@/actions/getUserFiles";

export default async function Dashboard(){
    const session = await getServerSession(authOptions);
    const rawFiles = await getUserFiles();
    
    const files = rawFiles?.map(file => ({
        id: file.id,
        fileName: file.fileName,
        key: file.key,
        userId: file.userId,
        createdAt: file.createdAt.toISOString()
    })) || [];

    return (
        <DashboardClient session={session} initialFiles={files} />
    )
}