import dbConnect from '../../../lib/mongodb';
import Blog from '../../../models/Blog';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id, title, slug, excerpt, content, author, tags, image } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Blog id is required' });
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
      return res.status(404).json({ message: 'Blog not found' });
    }

    return res.status(200).json({ message: 'Blog updated successfully', blog: updatedBlog });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}
