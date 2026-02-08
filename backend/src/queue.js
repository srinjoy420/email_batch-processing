import {redis} from "./redis.js"
import {config} from "./config.js"

const QUEUE_KEY=config.queuName

export async function addBatchtoQueu(batchId) {
    await redis.lpush(QUEUE_KEY,batchId)
    
}