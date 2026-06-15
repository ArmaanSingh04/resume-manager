import { getUserFiles } from "@/actions/getUserFiles";
import { getUserLinks } from "@/actions/getUserLinks";
import CreateLinkClient from "@/components/CreateLinkClient";

export default async function CreateLinkPage() {
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
        file: link.file ? {
            fileName: link.file.fileName,
            key: link.file.key
        } : null
    })) || [];

    return (
        <CreateLinkClient initialLinks={links} initialFiles={files} />
    );
}
