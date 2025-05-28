import { messageHandler } from "@/utils/messageHandler";

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  // Clear the authentication token cookie
  res.setHeader('Set-Cookie', 'token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax; Secure');

  return messageHandler(res, 200, 'Logged out successfully');
}
