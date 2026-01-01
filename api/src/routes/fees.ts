import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createFeeSchema, updateFeeSchema, CreateFeeInput, UpdateFeeInput } from '../validators/fee';

const router = Router();

// GET /api/fees - List fees
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { audience } = req.query;

    const where: any = {};
    if (audience) {
      where.audience = audience as string;
    }

    const fees = await prisma.feeItem.findMany({
      where,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });

    res.json(fees);
  } catch (error) {
    console.error('Get fees error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/fees - Create fee (protected)
router.post(
  '/',
  authMiddleware,
  validate(createFeeSchema),
  async (req: Request<{}, {}, CreateFeeInput>, res: Response): Promise<void> => {
    try {
      const fee = await prisma.feeItem.create({
        data: req.body,
      });

      res.status(201).json(fee);
    } catch (error) {
      console.error('Create fee error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// PUT /api/fees/:id - Update fee (protected)
router.put(
  '/:id',
  authMiddleware,
  validate(updateFeeSchema),
  async (req: Request<{ id: string }, {}, UpdateFeeInput>, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const existingFee = await prisma.feeItem.findUnique({ where: { id } });
      if (!existingFee) {
        res.status(404).json({ message: 'Fee item not found' });
        return;
      }

      const fee = await prisma.feeItem.update({
        where: { id },
        data: req.body,
      });

      res.json(fee);
    } catch (error) {
      console.error('Update fee error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// DELETE /api/fees/:id - Delete fee (protected)
router.delete(
  '/:id',
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const existingFee = await prisma.feeItem.findUnique({ where: { id } });
      if (!existingFee) {
        res.status(404).json({ message: 'Fee item not found' });
        return;
      }

      await prisma.feeItem.delete({ where: { id } });

      res.status(204).send();
    } catch (error) {
      console.error('Delete fee error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

export default router;
