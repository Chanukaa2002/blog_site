import redis from "redis";

let redisClient;

if (process.env.NODE_ENV === "development") {
  console.log("Using local Redis cache");
  redisClient = redis.createClient({
    host: "localhost",
    port: 6379,
  });
} else {
  console.log("Using Hosted redis cache");
  redisClient = redis.createClient({
    url: process.env.REDIS_URL,
  });
}
(async () => {
  redisClient.on("error", (err) => {
    console.log("Redis Client Error", err);
  });
  redisClient.on("connect", () => {
    console.log("Redis Connected!");
  });
  await redisClient.connect();
})();

export default redisClient;
