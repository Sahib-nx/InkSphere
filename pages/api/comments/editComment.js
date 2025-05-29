import dbConnect from '../../../lib/mongodb';
import Comment from '../../../models/Comment';
import Blog from '../../../models/Blog';
import { User } from '../../../models/userModel';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

    await dbConnect();

  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: 'Authentication token missing' });
  }

  const secretkey = process.env.JWT_SECRET_KEY;
  if (!secretkey) {
    return res.status(500).json({ error: 'JWT secret key not configured' });
  }

  let verified;
  try {
    verified = jwt.verify(token, secretkey);
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Invalid authentication token' });
  }

  const user = await User.findById(verified.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const { commentId, content } = req.body;
  if (!commentId || !content || typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ error: 'Comment ID and non-empty content are required' });
  }

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.author.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'You are not authorized to edit this comment' });
    }

    comment.content = content.trim();
    const updatedComment = await comment.save();

    await updatedComment.populate({ path: 'author', select: 'username' });

    res.status(200).json(updatedComment);
  } catch (error) {
    console.error('Error editing comment:', error);
    res.status(500).json({ error: 'Failed to edit comment' });
  }
}
