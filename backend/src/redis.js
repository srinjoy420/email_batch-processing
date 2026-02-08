import Redis from "ioredis"
import {config} from "./config.js"



export const redis=new Redis(config.redisUrl)
export const subscriber=new Redis(config.redisUrl)

const BATCH_EMAIS_PREFIX="batch:emails";

export function publishBatchStatus(batchId,payload){
    
}


export function setBatchemails(batchId,emails){
    const key=BATCH_EMAIS_PREFIX+batchId;
    return redis.set(key,JSON.stringify(emails),"EX",config.batchEmailTssecoends)
}
