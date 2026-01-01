import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('M07Choudhary', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'sahil09pr@gmail.com' },
    update: {
      password: hashedPassword, // Ensure password is updated if user exists
    },
    create: {
      email: 'sahil09pr@gmail.com',
      password: hashedPassword,
      name: 'Sahil Choudhary',
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
