import { Redis } from '@upstash/redis';

// Initialize Redis
const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(request, response) {
  if (request.method === 'POST') {
    try {
      // Increment the download counter
      const count = await redis.incr("download_count");
      
      // Return the updated count
      response.status(200).json({ count });
    } catch (error) {
      console.error("Error updating download counter:", error);
      response.status(500).json({ error: "Failed to update download counter" });
    }
  } else if (request.method === 'GET') {
    try {
      // Get the current download count
      const count = await redis.get("download_count") || 0;
      
      // Return the current count
      response.status(200).json({ count });
    } catch (error) {
      console.error("Error fetching download counter:", error);
      response.status(500).json({ error: "Failed to fetch download counter" });
    }
  } else {
    response.status(405).json({ error: "Method not allowed" });
  }
}