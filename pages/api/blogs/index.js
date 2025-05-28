import dbConnect from '../../../lib/mongodb';
import Blog from '../../../models/Blog';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../../../models/userModel';

// Helper function to validate blog data
function validateBlogData(data) {
  const errors = [];

  if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
    errors.push('Title is required and must be a non-empty string.');
  }
  if (!data.slug || typeof data.slug !== 'string' || !data.slug.trim()) {
    errors.push('Slug is required and must be a non-empty string.');
  }
  if (!data.excerpt || typeof data.excerpt !== 'string' || !data.excerpt.trim()) {
    errors.push('Excerpt is required and must be a non-empty string.');
  }
  if (!data.content || typeof data.content !== 'string' || !data.content.trim()) {
    errors.push('Content is required and must be a non-empty string.');
  }
  // Removed author validation from request body
  if (data.tags && !Array.isArray(data.tags)) {
    errors.push('Tags must be an array of strings.');
  } else if (data.tags) {
    for (const tag of data.tags) {
      if (typeof tag !== 'string') {
        errors.push('Each tag must be a string.');
        break;
      }
    }
  }

  return errors;
}

export default async function handler(req, res) {
  try {
    await dbConnect();
  } catch (dbError) {
    console.error('Database connection error:', dbError);
    return res.status(500).json({ error: 'Database connection failed' });
  }

  if (req.method === 'GET') {
    try {
      const { id, author, slug } = req.query;
      if (id) {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
          return res.status(400).json({ error: 'Invalid blog id format' });
        }
        const blog = await Blog.findById(id);
        if (!blog) {
          return res.status(404).json({ error: 'Blog not found' });
        }
        return res.status(200).json([blog]);
      }
      let filter = {};
      if (author) {
        filter.author = author;
      }
      if (slug) {
        filter.slug = slug;
      }
      const blogs = await Blog.find(filter);
      return res.status(200).json(blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return res.status(500).json({ error: 'Failed to fetch blogs' });
    }
  } else if (req.method === 'POST') {
    // Verify token from cookies
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
      console.log('Verified token payload:', verified);
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ error: 'Invalid authentication token' });
    }

    // Fetch user by userId from token
    const user = await User.findById(verified.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const errors = validateBlogData(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Sanitize and trim string fields, assign author from user.username
    const sanitizedData = {
      title: req.body.title.trim(),
      slug: req.body.slug.trim(),
      excerpt: req.body.excerpt.trim(),
      content: req.body.content.trim(),
      author: user.username,
      tags: req.body.tags ? req.body.tags.map(tag => tag.trim()) : [],
      image: req.body.image ? req.body.image.trim() : undefined,
    };

    try {
      const blog = new Blog(sanitizedData);
      const result = await blog.save();

      // Update user's blogs array
      user.blogs.push(result._id);
      await user.save();

      res.status(201).json(result);
    } catch (error) {
      console.error('Error creating blog:', error);
      res.status(500).json({ error: 'Failed to create blog' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
