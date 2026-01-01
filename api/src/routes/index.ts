import { Router } from 'express';
import authRoutes from './auth';
import postsRoutes from './posts';
import feesRoutes from './fees';
import settingsRoutes from './settings';
import contactRoutes from './contact';

const router = Router();

router.use('/auth', authRoutes);
router.use('/posts', postsRoutes);
router.use('/fees', feesRoutes);
router.use('/settings', settingsRoutes);
router.use('/contact', contactRoutes);

export default router;
