import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateSettingsSchema, UpdateSettingsInput } from '../validators/settings';

const router = Router();

// GET /api/settings - Get settings (public)
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const settings = await prisma.settings.findUnique({ where: { id: 'main' } });

    if (!settings) {
      res.status(404).json({ message: 'Settings not found' });
      return;
    }

    // Transform flat DB structure to nested format expected by frontend
    res.json({
      id: settings.id,
      firmName: settings.firmName,
      tagline: settings.tagline,
      bio: settings.bio,
      email: settings.email,
      phone: settings.phone,
      whatsapp: settings.whatsapp,
      address: {
        line: settings.addressLine,
        city: settings.addressCity,
        state: settings.addressState,
        postalCode: settings.postalCode,
      },
      socialLinks: {
        linkedin: settings.linkedin,
        twitter: settings.twitter,
        facebook: settings.facebook,
      },
      heroImage: settings.heroImage,
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/settings - Update settings (protected)
router.put(
  '/',
  authMiddleware,
  validate(updateSettingsSchema),
  async (req: Request<{}, {}, UpdateSettingsInput>, res: Response): Promise<void> => {
    try {
      const data = req.body;

      // Transform nested structure to flat DB structure
      const updateData: any = {};
      
      if (data.firmName !== undefined) updateData.firmName = data.firmName;
      if (data.tagline !== undefined) updateData.tagline = data.tagline;
      if (data.bio !== undefined) updateData.bio = data.bio;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.phone !== undefined) updateData.phone = data.phone;
      if (data.whatsapp !== undefined) updateData.whatsapp = data.whatsapp;
      if (data.heroImage !== undefined) updateData.heroImage = data.heroImage;

      if (data.address) {
        updateData.addressLine = data.address.line;
        updateData.addressCity = data.address.city;
        updateData.addressState = data.address.state;
        updateData.postalCode = data.address.postalCode;
      }

      if (data.socialLinks) {
        if (data.socialLinks.linkedin !== undefined) updateData.linkedin = data.socialLinks.linkedin || null;
        if (data.socialLinks.twitter !== undefined) updateData.twitter = data.socialLinks.twitter || null;
        if (data.socialLinks.facebook !== undefined) updateData.facebook = data.socialLinks.facebook || null;
      }

      const settings = await prisma.settings.update({
        where: { id: 'main' },
        data: updateData,
      });

      // Return in nested format
      res.json({
        id: settings.id,
        firmName: settings.firmName,
        tagline: settings.tagline,
        bio: settings.bio,
        email: settings.email,
        phone: settings.phone,
        whatsapp: settings.whatsapp,
        address: {
          line: settings.addressLine,
          city: settings.addressCity,
          state: settings.addressState,
          postalCode: settings.postalCode,
        },
        socialLinks: {
          linkedin: settings.linkedin,
          twitter: settings.twitter,
          facebook: settings.facebook,
        },
        heroImage: settings.heroImage,
      });
    } catch (error) {
      console.error('Update settings error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

export default router;
