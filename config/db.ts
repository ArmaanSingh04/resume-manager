import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
})

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}
const prismaClientSingleton = () => {
    return new PrismaClient({ adapter: adapter });
};

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = prisma;
}