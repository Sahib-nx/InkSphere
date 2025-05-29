import dbConnect from '../../../lib/mongodb';
import Comment from '../../../models/Comment';
import Blog from '../../../models/Blog';
import { User } from '../../../models/userModel';
import jwt from 'jsonwebtoken';
import { messageHandler } from '@/utils/messageHandler';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    await dbConnect();
  } catch (dbError) {
    console.error('Database connection error:', dbError);
    return res.status(500).json({ error: 'Database connection failed' });
  }

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

  const { commentId } = req.body;
  if (!commentId) {
    return res.status(400).json({ error: 'Comment ID is required' });
  }

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.author.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'You are not authorized to delete this comment' });
    }

    // Remove comment reference from Blog's comments array
    await Blog.findByIdAndUpdate(comment.blog, { $pull: { comments: comment._id } });

    // Remove comment reference from User's comments array
    await User.findByIdAndUpdate(user._id, { $pull: { comments: comment._id } });

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);
    return messageHandler(res, 200, 'Comment deleted successfully');
    // return res.status(200).json({ message: 'Comment deleted successfully' });

  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
}
