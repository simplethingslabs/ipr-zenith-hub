import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Admin credentials come from the environment, never from source.
 *
 * A previous version of this file hard-coded a real admin email and plaintext
 * password. Anyone with repository access — and anyone who ever forked or cloned
 * it — had the credentials, and they remain in git history, so that password must
 * be treated as compromised and rotated rather than reused here.
 */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. ` +
        `Set it in api/.env (which is gitignored) before running the seed.`,
    );
  }
  return value;
}

async function main() {
  console.log('🌱 Seeding database...');

  const adminEmail = requireEnv('SEED_ADMIN_EMAIL');
  const adminPassword = requireEnv('SEED_ADMIN_PASSWORD');
  const adminName = process.env.SEED_ADMIN_NAME || 'Administrator';

  if (adminPassword.length < 12) {
    throw new Error('SEED_ADMIN_PASSWORD must be at least 12 characters.');
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword, // Re-seeding rotates the password.
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: 'admin',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create initial settings
  const settings = await prisma.settings.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      firmName: 'IPR Central',
      tagline: 'Protecting Your Intellectual Property Rights',
      bio: 'IPR Central is a leading intellectual property law firm specializing in trademark registration, patent prosecution, copyright protection, and IP enforcement. With decades of combined experience, our team of dedicated IP attorneys is committed to protecting your creative assets and innovations.',
      email: 'contact@iprcentral.com',
      phone: '+91 11 2345 6789',
      whatsapp: '+919876543210',
      addressLine: '123 Legal Tower, Connaught Place',
      addressCity: 'New Delhi',
      addressState: 'Delhi',
      postalCode: '110001',
      linkedin: 'https://linkedin.com/company/iprcentral',
      twitter: 'https://twitter.com/iprcentral',
      facebook: 'https://facebook.com/iprcentral',
      heroImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920',
    },
  });
  console.log('✅ Settings created');

  // Create sample posts
  const posts = [
    {
      title: 'Understanding Trademark Registration in India',
      slug: 'understanding-trademark-registration-india',
      content: '# Understanding Trademark Registration\n\nTrademark registration is a crucial step in protecting your brand identity...',
      excerpt: 'A comprehensive guide to registering your trademark in India, covering the process, requirements, and benefits.',
      category: 'Commentary' as const,
      tags: ['trademark', 'registration', 'india', 'brand protection'],
      status: 'published' as const,
      publishedAt: new Date(),
    },
    {
      title: 'Landmark Judgment: Delhi High Court on Patent Infringement',
      slug: 'delhi-hc-patent-infringement-judgment',
      content: '# Delhi High Court Ruling\n\nIn a significant ruling, the Delhi High Court has clarified the scope of patent protection...',
      excerpt: 'Analysis of the recent Delhi High Court judgment on patent infringement and its implications for innovators.',
      category: 'Judgment' as const,
      tags: ['patent', 'judgment', 'delhi high court', 'infringement'],
      status: 'published' as const,
      publishedAt: new Date(),
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }
  console.log('✅ Sample posts created');

  // Create sample fees
  const fees = [
    { name: 'Trademark Search', audience: 'Individuals' as const, type: 'fixed' as const, priceMin: 5000, category: 'Trademarks' },
    { name: 'Trademark Registration', audience: 'Individuals' as const, type: 'fixed' as const, priceMin: 15000, category: 'Trademarks' },
    { name: 'Patent Drafting', audience: 'Businesses' as const, type: 'variable' as const, priceMin: 50000, priceMax: 150000, category: 'Patents' },
    { name: 'Copyright Registration', audience: 'Individuals' as const, type: 'fixed' as const, priceMin: 8000, category: 'Copyrights' },
    { name: 'IP Portfolio Audit', audience: 'Businesses' as const, type: 'variable' as const, priceMin: 75000, priceMax: 200000, category: 'Consulting' },
  ];

  for (const fee of fees) {
    await prisma.feeItem.create({ data: fee });
  }
  console.log('✅ Sample fees created');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
