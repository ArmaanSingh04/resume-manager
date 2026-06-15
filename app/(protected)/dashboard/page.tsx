import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth"
import DashboardClient from "@/components/DashboardClient";
import { getUserFiles } from "@/actions/getUserFiles";
import { getUserLinks } from "@/actions/getUserLinks";

export default async function Dashboard(){
    const session = await getServerSession(authOptions);
    const rawFiles = await getUserFiles();
    const rawLinks = await getUserLinks();
    
    const files = rawFiles?.map(file => ({
        id: file.id,
        fileName: file.fileName,
        key: file.key,
        userId: file.userId,
        createdAt: file.createdAt.toISOString()
    })) || [];

    const links = rawLinks?.map(link => ({
        id: link.id,
        type: link.type,
        fileId: link.fileId,
        createdAt: link.createdAt.toISOString(),
        file: {
            fileName: link.file.fileName,
            key: link.file.key
        }
    })) || [];

    return (
        <DashboardClient session={session} initialFiles={files} initialLinks={links} />
    )
}