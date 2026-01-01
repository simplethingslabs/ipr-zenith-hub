import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { validate } from '../middleware/validate';
import { contactSchema, ContactInput } from '../validators/contact';

const router = Router();

// POST /api/contact - Submit contact form
router.post(
  '/',
  validate(contactSchema),
  async (req: Request<{}, {}, ContactInput>, res: Response): Promise<void> => {
    try {
      const { name, email, phone, subject, message } = req.body;

      // Save to database
      await prisma.contactSubmission.create({
        data: {
          name,
          email,
          phone,
          subject,
          message,
        },
      });

      // TODO: Add email notification here
      // await sendEmail({ to: settings.email, subject, ... })

      res.json({
        success: true,
        message: 'Thank you for your message. We will get back to you soon.',
      });
    } catch (error) {
      console.error('Contact submission error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

export default router;
