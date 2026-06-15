import { getUserFiles } from "@/actions/getUserFiles";
import ManageResumesClient from "@/components/ManageResumesClient";

export default async function Dashboard(){
    const rawFiles = await getUserFiles();
    
    const files = rawFiles?.map(file => ({
        id: file.id,
        fileName: file.fileName,
        key: file.key,
        userId: file.userId,
        createdAt: file.createdAt.toISOString()
    })) || [];

    return (
        <ManageResumesClient initialFiles={files} />
    )
}