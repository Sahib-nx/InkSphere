import dbConnect from '../../../lib/mongodb';
import Comment from '../../../models/Comment';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

    await dbConnect();

  const { blogId } = req.query;
  if (!blogId) {
    return res.status(400).json({ error: 'Blog ID is required' });
  }

  try {
    const comments = await Comment.find({ blog: blogId })
      .populate({ path: 'author', select: 'username' })
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
}
