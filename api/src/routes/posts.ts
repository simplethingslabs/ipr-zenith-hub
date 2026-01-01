import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createPostSchema, updatePostSchema, CreatePostInput, UpdatePostInput } from '../validators/post';

const router = Router();

// Helper to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

// GET /api/posts - List posts (public: only published, admin: all)
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, category, search } = req.query;

    const where: any = {};

    // If no auth header, only show published posts
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      where.status = 'published';
    } else if (status) {
      where.status = status as string;
    }

    if (category) {
      where.category = category as string;
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { excerpt: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/posts/:slug - Get single post by slug
router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const post = await prisma.post.findUnique({ where: { slug } });
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    // Check if post is published or user is authenticated
    const authHeader = req.headers.authorization;
    if (post.status !== 'published' && (!authHeader || !authHeader.startsWith('Bearer '))) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/posts - Create post (protected)
router.post(
  '/',
  authMiddleware,
  validate(createPostSchema),
  async (req: Request<{}, {}, CreatePostInput>, res: Response): Promise<void> => {
    try {
      const { title, content, excerpt, coverImage, category, tags, status } = req.body;

      // Generate unique slug
      let slug = generateSlug(title);
      const existingPost = await prisma.post.findUnique({ where: { slug } });
      if (existingPost) {
        slug = `${slug}-${Date.now()}`;
      }

      const post = await prisma.post.create({
        data: {
          title,
          slug,
          content,
          excerpt,
          coverImage: coverImage || null,
          category,
          tags,
          status,
          publishedAt: status === 'published' ? new Date() : null,
        },
      });

      res.status(201).json(post);
    } catch (error) {
      console.error('Create post error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// PUT /api/posts/:id - Update post (protected)
router.put(
  '/:id',
  authMiddleware,
  validate(updatePostSchema),
  async (req: Request<{ id: string }, {}, UpdatePostInput>, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const data = req.body;

      const existingPost = await prisma.post.findUnique({ where: { id } });
      if (!existingPost) {
        res.status(404).json({ message: 'Post not found' });
        return;
      }

      // Update slug if title changed
      let updateData: any = { ...data };
      if (data.title && data.title !== existingPost.title) {
        updateData.slug = generateSlug(data.title);
      }

      // Set publishedAt if status changed to published
      if (data.status === 'published' && existingPost.status !== 'published') {
        updateData.publishedAt = new Date();
      }

      const post = await prisma.post.update({
        where: { id },
        data: updateData,
      });

      res.json(post);
    } catch (error) {
      console.error('Update post error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// DELETE /api/posts/:id - Delete post (protected)
router.delete(
  '/:id',
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const existingPost = await prisma.post.findUnique({ where: { id } });
      if (!existingPost) {
        res.status(404).json({ message: 'Post not found' });
        return;
      }

      await prisma.post.delete({ where: { id } });

      res.status(204).send();
    } catch (error) {
      console.error('Delete post error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

export default router;
