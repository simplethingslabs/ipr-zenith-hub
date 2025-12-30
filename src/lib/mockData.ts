import { Post, FeeItem, Settings } from '@/types';

export const mockSettings: Settings = {
  id: '1',
  firmName: 'IPR Central',
  tagline: 'Protecting Your Intellectual Property',
  bio: 'IPR Central is a leading intellectual property consultancy dedicated to helping businesses and individuals protect their innovations, brands, and creative works. With years of experience in trademark registration, patent filing, copyright protection, and design rights, we provide comprehensive IP solutions tailored to your needs.',
  email: 'info@iprcentral.com',
  phone: '+91 98765 43210',
  whatsapp: '+919876543210',
  address: {
    line: '123 IP Tower, Business District',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
  },
  socialLinks: {
    linkedin: 'https://linkedin.com/company/iprcentral',
    twitter: 'https://twitter.com/iprcentral',
  },
  heroImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80',
};

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Understanding Trademark Classification: A Complete Guide',
    slug: 'understanding-trademark-classification',
    content: `
# Understanding Trademark Classification

Trademark classification is a fundamental aspect of intellectual property protection that every business owner should understand. The Nice Classification system, established by the Nice Agreement (1957), provides an international standard for classifying goods and services.

## What is the Nice Classification?

The Nice Classification consists of 45 classes:
- **Classes 1-34**: Cover goods (products)
- **Classes 35-45**: Cover services

### Why Classification Matters

When you register a trademark, you must specify the classes under which you want protection. This determines:

1. The scope of your trademark protection
2. The registration fees you'll pay
3. Potential conflicts with existing marks

## Common Classes for Businesses

Here are some frequently used classes:

- **Class 9**: Software, apps, electronic devices
- **Class 25**: Clothing, footwear, headgear
- **Class 35**: Advertising, business management, retail services
- **Class 42**: IT services, software development, scientific research

## Best Practices

> "A well-planned trademark strategy considers both current operations and future expansion."

When selecting classes:

- Consider your current products/services
- Think about future business expansion
- Review competitor registrations
- Consult with an IP professional

## Conclusion

Understanding trademark classification is essential for effective brand protection. A strategic approach to classification can save costs and provide comprehensive coverage for your intellectual property.

---

*Need help with trademark classification? Contact IPR Central for expert guidance.*
    `,
    excerpt: 'Learn how the Nice Classification system works and why proper trademark classification is crucial for protecting your brand.',
    coverImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
    category: 'Commentary',
    tags: ['trademarks', 'classification', 'nice agreement'],
    status: 'published',
    publishedAt: '2024-12-15T10:00:00Z',
    createdAt: '2024-12-10T08:00:00Z',
    updatedAt: '2024-12-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Landmark Judgment: Delhi High Court on Software Patents',
    slug: 'delhi-high-court-software-patents',
    content: `
# Delhi High Court's Landmark Ruling on Software Patents

In a significant judgment that will shape the future of software patents in India, the Delhi High Court has clarified the patentability criteria for computer-related inventions.

## Case Background

The case involved a dispute between two technology companies regarding a patent for an AI-based inventory management system.

## Key Holdings

The Court held that:

1. Software \`per se\` remains non-patentable under Section 3(k) of the Patents Act
2. However, software that produces a "technical effect" or solves a "technical problem" may be patentable
3. The technical contribution must be assessed as a whole

### The Technical Effect Test

The judgment establishes a three-part test:

- Does the invention solve a technical problem?
- Does it produce a technical effect beyond normal software operation?
- Is there a technical contribution to the art?

## Implications for Innovators

This judgment provides much-needed clarity for:

- Software developers seeking patent protection
- Startups with technology-driven innovations
- Foreign companies filing patents in India

## Expert Commentary

This ruling aligns Indian patent law more closely with European Patent Office guidelines while maintaining the statutory prohibition on software patents *per se*.

---

*For assistance with software patent applications, consult our patent specialists at IPR Central.*
    `,
    excerpt: 'Analysis of the Delhi High Court\'s recent ruling that provides clarity on when software-related inventions can be patented in India.',
    coverImage: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=800&q=80',
    category: 'Judgment',
    tags: ['patents', 'software', 'court judgment', 'delhi high court'],
    status: 'published',
    publishedAt: '2024-12-10T14:00:00Z',
    createdAt: '2024-12-08T09:00:00Z',
    updatedAt: '2024-12-10T14:00:00Z',
  },
  {
    id: '3',
    title: 'Copyright in the Age of AI: What Creators Need to Know',
    slug: 'copyright-age-of-ai',
    content: `
# Copyright in the Age of AI

The rise of artificial intelligence has created unprecedented challenges for copyright law. As AI tools become more sophisticated, creators and businesses must understand how copyright applies to AI-generated content.

## The Fundamental Question

Can AI-generated works be protected by copyright? The answer varies by jurisdiction:

- **India**: Works must be created by a "person" - the status of AI works is unclear
- **USA**: Copyright Office has stated AI-generated works cannot be copyrighted
- **UK**: Computer-generated works may have limited protection

## Key Considerations

### Training Data
AI models trained on copyrighted works raise infringement concerns. Creators should:

- Document their creative process
- Maintain records of human involvement
- Consider licensing implications

### Ownership Issues

When humans use AI as a tool:
1. The human author likely retains copyright
2. The level of human creativity matters
3. Employer agreements may affect ownership

## Practical Recommendations

> "The more human creativity involved, the stronger the copyright claim."

For creators using AI tools:

- Add substantial human creative input
- Document your creative decisions
- Keep records of prompts and modifications
- Review platform terms of service

## Looking Ahead

Legislation is evolving rapidly. Stay informed about:

- Proposed AI regulations
- Case law developments
- Industry best practices

---

*Questions about AI and copyright? IPR Central can help you navigate these complex issues.*
    `,
    excerpt: 'Exploring the complex intersection of artificial intelligence and copyright law, with practical guidance for creators.',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    category: 'Commentary',
    tags: ['copyright', 'artificial intelligence', 'technology'],
    status: 'published',
    publishedAt: '2024-12-05T11:00:00Z',
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-05T11:00:00Z',
  },
  {
    id: '4',
    title: 'Design Registration: Protecting Product Aesthetics',
    slug: 'design-registration-protecting-aesthetics',
    content: `
# Design Registration: Protecting Product Aesthetics

Industrial design registration protects the unique visual appearance of products. This guide covers everything you need to know about design protection in India.

## What Can Be Protected?

Design registration covers:

- Shape and configuration
- Pattern and ornamentation
- Composition of lines and colors
- Combination of the above

## Requirements for Registration

A registrable design must be:

1. **New**: Not previously published in India
2. **Original**: Not a mere imitation
3. **Non-functional**: Purely aesthetic features
4. **Applied to an article**: Not abstract patterns

## The Registration Process

| Step | Timeline | Description |
|------|----------|-------------|
| Application | Day 1 | File with Controller of Designs |
| Examination | 1-3 months | Formal and substantive review |
| Registration | 3-6 months | Certificate issued |

## Duration and Renewal

- Initial term: 10 years
- Renewable for additional 5 years
- Maximum protection: 15 years

## Common Mistakes to Avoid

- Filing after public disclosure
- Including functional features
- Poor quality representations
- Incorrect classification

---

*Protect your product designs with IPR Central's expert assistance.*
    `,
    excerpt: 'A comprehensive guide to industrial design registration in India, including requirements, process, and best practices.',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    category: 'Commentary',
    tags: ['designs', 'registration', 'industrial design'],
    status: 'published',
    publishedAt: '2024-11-28T09:00:00Z',
    createdAt: '2024-11-25T08:00:00Z',
    updatedAt: '2024-11-28T09:00:00Z',
  },
  {
    id: '5',
    title: 'Draft: Upcoming Changes to Patent Filing Procedures',
    slug: 'upcoming-patent-filing-changes',
    content: `
# Upcoming Changes to Patent Filing Procedures

*This article is currently in draft and will be published soon.*

The Indian Patent Office has announced significant changes...
    `,
    excerpt: 'Preview of upcoming changes to patent filing procedures in India.',
    category: 'Commentary',
    tags: ['patents', 'procedure', 'updates'],
    status: 'draft',
    createdAt: '2024-12-20T10:00:00Z',
    updatedAt: '2024-12-20T10:00:00Z',
  },
];

export const mockFees: FeeItem[] = [
  // Individual Fees
  {
    id: '1',
    name: 'Trademark Search (Comprehensive)',
    audience: 'Individuals',
    type: 'fixed',
    priceMin: 2500,
    category: 'Trademarks',
    notes: 'Includes search across all classes and conflict analysis report',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Trademark Registration (Single Class)',
    audience: 'Individuals',
    type: 'fixed',
    priceMin: 5500,
    category: 'Trademarks',
    notes: 'Government fees included. Additional classes at ₹4,500 each.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Copyright Registration',
    audience: 'Individuals',
    type: 'variable',
    priceMin: 3000,
    priceMax: 8000,
    category: 'Copyrights',
    notes: 'Price varies based on type of work (literary, artistic, musical, etc.)',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Design Registration',
    audience: 'Individuals',
    type: 'fixed',
    priceMin: 8000,
    category: 'Designs',
    notes: 'Single design registration with one set of representations',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    name: 'Patent Consultation',
    audience: 'Individuals',
    type: 'fixed',
    priceMin: 5000,
    category: 'Patents',
    notes: '1-hour consultation to assess patentability and strategy',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  // Business Fees
  {
    id: '6',
    name: 'Trademark Portfolio Audit',
    audience: 'Businesses',
    type: 'variable',
    priceMin: 15000,
    priceMax: 50000,
    category: 'Trademarks',
    notes: 'Comprehensive review of existing trademarks with recommendations',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '7',
    name: 'Trademark Registration (Multiple Classes)',
    audience: 'Businesses',
    type: 'variable',
    priceMin: 12000,
    priceMax: 35000,
    category: 'Trademarks',
    notes: 'Bulk pricing for 3+ class registrations',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '8',
    name: 'Patent Application (Provisional)',
    audience: 'Businesses',
    type: 'fixed',
    priceMin: 25000,
    category: 'Patents',
    notes: 'Drafting and filing of provisional patent application',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '9',
    name: 'Patent Application (Complete)',
    audience: 'Businesses',
    type: 'variable',
    priceMin: 50000,
    priceMax: 150000,
    category: 'Patents',
    notes: 'Price varies based on complexity and technical field',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '10',
    name: 'IP Due Diligence',
    audience: 'Businesses',
    type: 'variable',
    priceMin: 50000,
    priceMax: 200000,
    category: 'Advisory',
    notes: 'For M&A, funding rounds, or partnership evaluations',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '11',
    name: 'Trademark Opposition/Defense',
    audience: 'Businesses',
    type: 'variable',
    priceMin: 20000,
    priceMax: 75000,
    category: 'Enforcement',
    notes: 'Representation in opposition proceedings',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '12',
    name: 'Cease & Desist Letter',
    audience: 'Businesses',
    type: 'fixed',
    priceMin: 8000,
    category: 'Enforcement',
    notes: 'Drafting and sending legal notice for IP infringement',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const mockUser = {
  id: '1',
  email: 'admin@iprcentral.com',
  name: 'Admin User',
  role: 'admin' as const,
};
