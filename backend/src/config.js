import 'dotenv/config';

export const config={
    port:Number(process.env.PORT)||4000,
    redisUrl:process.env.REDIS_URl || "",
    queuName:"email-queue",
    batchEmailTssecoends:3600
}