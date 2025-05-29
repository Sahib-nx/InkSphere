import dbConnect from '../../../lib/mongodb';
import Blog from '../../../models/Blog';
import Comment from '../../../models/Comment';
import jwt from 'jsonwebtoken';
import { User } from '../../../models/userModel';


const validateBlogData = (data) => {
  const requiredFields = ['title', 'slug', 'excerpt', 'content'];
  const errors = [];

  requiredFields.forEach(field => {
    if (!data[field] || typeof data[field] !== 'string' || !data[field].trim()) {
      errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required and must be a non-empty string.`);
    }
  });

  if (data.tags) {
    if (!Array.isArray(data.tags)) {
      errors.push('Tags must be an array of strings.');
    } else if (data.tags.some(tag => typeof tag !== 'string')) {
      errors.push('Each tag must be a string.');
    }
  }

  return errors;
};

const authenticateUser = async (token) => {
  if (!token) throw new Error('Authentication token missing');
  
  const secretkey = process.env.JWT_SECRET_KEY;
  if (!secretkey) throw new Error('JWT secret key not configured');
  
  const verified = jwt.verify(token, secretkey);
  const user = await User.findById(verified.userId);
  if (!user) throw new Error('User not found');
  
  return user;
};

const handleGet = async (req, res) => {
  const { id, author, slug } = req.query;
  
  if (id) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid blog id format' });
    }
    const blog = await Blog.findById(id).populate({
      path: 'comments',
      populate: { path: 'author', select: 'username' }
    });
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    return res.status(200).json([blog]);
  }

  const filter = {};
  if (author) filter.author = author;
  if (slug) filter.slug = slug;

  const blogs = await Blog.find(filter).populate({
    path: 'comments',
    populate: { path: 'author', select: 'username' }
  }).lean();

  return res.status(200).json(Array.isArray(blogs) ? blogs : blogs ? [blogs] : []);
};

const handlePost = async (req, res) => {
  const user = await authenticateUser(req.cookies.token);
  
  const errors = validateBlogData(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const sanitizedData = {
    title: req.body.title.trim(),
    slug: req.body.slug.trim(),
    excerpt: req.body.excerpt.trim(),
    content: req.body.content.trim(),
    author: user.username,
    tags: req.body.tags?.map(tag => tag.trim()) || [],
    ...(req.body.image && { image: req.body.image.trim() })
  };

  const blog = new Blog(sanitizedData);
  const result = await blog.save();
  
  user.blogs.push(result._id);
  await user.save();

  return res.status(201).json(result);
};

export default async function handler(req, res) {
  await dbConnect();

  try {
    switch (req.method) {
      case 'GET':
        return await handleGet(req, res);
      case 'POST':
        return await handlePost(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error(`Error in ${req.method} request:`, error);
    
    if (error.name === 'JsonWebTokenError' || error.message.includes('token')) {
      return res.status(401).json({ error: error.message });
    }
    
    return res.status(500).json({ 
      error: req.method === 'GET' ? 'Failed to fetch blogs' : 'Failed to create blog' 
    });
  }
}
