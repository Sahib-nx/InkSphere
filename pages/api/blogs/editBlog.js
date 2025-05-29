import { messageHandler } from '@/utils/messageHandler';
import dbConnect from '../../../lib/mongodb';
import Blog from '../../../models/Blog';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return messageHandler(res, 405, 'Method not allowed');
  }

  const { id, title, slug, excerpt, content, author, tags, image } = req.body;

  if (!id) {
    return messageHandler(res, 400, 'Blog id is required')
  }

  try {
    await dbConnect();

    const updateData = {
      updatedAt: new Date(),
    };

    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content;
    if (author !== undefined) updateData.author = author;
    if (tags !== undefined) updateData.tags = tags;
    if (image !== undefined) updateData.image = image;

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedBlog) {
      return messageHandler(res, 404, 'Blog not found');
    }

    return res.status(200).json({ message: 'Blog updated successfully', blog: updatedBlog });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}
