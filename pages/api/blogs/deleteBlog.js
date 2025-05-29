import { messageHandler } from '@/utils/messageHandler';
import dbConnect from '../../../lib/mongodb';
import Blog from '../../../models/Blog';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return messageHandler(res, 405, 'Method Not Allowed');
  }

  const { id } = req.body;

  if (!id) {
    return messageHandler(res, 400, 'Blog id is required');
  }

  try {
    await dbConnect();
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return messageHandler(res, 404, 'Blog not found');
    }

    return res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}
