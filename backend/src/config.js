import 'dotenv/config';

export const config={
    port:Number(process.env.PORT)||4000,
    redisUrl:process.env.REDIS_URl || "rediss://default:AeCeAAIncDE4OGU3OGU1NGIzOTI0MGNkODEwYjJmMjQ4NjdhYTJjNHAxNTc1MDI@many-dinosaur-57502.upstash.io:6379"
}