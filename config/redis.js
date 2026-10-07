import {createClient} from "redis";

export const client = createClient({
    url:"redis://localhost:6379"
})

client.on("error",(error)=>{
    console.log("Redis Error")

})

export async function redisConnect(){
    await client.connect()
    console.log("Redis Connected")
}
