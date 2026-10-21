
import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();

export const client = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const redisConnect = async () => {
  try {
    const response = await client.ping();

    console.log("Upstash Redis connected Successfully", response);
  } catch (error) {
    console.log("Upstash Redis connection Error", error.message);
  }
};

// import {createClient} from "redis";

// export const client = createClient({
//     url:"redis://localhost:6379"
// })

// client.on("error",(error)=>{
//     console.log("Redis Error")

// })

// export async function redisConnect(){
//     await client.connect()
//     console.log("Redis Connected")
// }
