
import dbConnect from '../../../lib/mongodb';
import Comment from '../../../models/Comment';
import Blog from '../../../models/Blog';
import { User } from '../../../models/userModel';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
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

  const { blogId, content } = req.body;
  if (!blogId || !content || typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ error: 'Blog ID and non-empty content are required' });
  }

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const comment = new Comment({
      content: content.trim(),
      author: user._id,
      blog: blog._id
    });

    const savedComment = await comment.save();

    // Update blog's comments array
    blog.comments.push(savedComment._id);
    await blog.save();

    // Update user's comments array
    user.comments.push(savedComment._id);
    await user.save();

    // Populate author username before sending response
    await savedComment.populate({ path: 'author', select: 'username' });

    res.status(201).json(savedComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
}
