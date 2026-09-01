/**
 * Seed the database with the initial catalog, testimonials and site copy
 * so the website is not empty on first run.
 *
 * Run with: npm run db:seed
 */
import { PrismaClient } from "@prisma/client";
import { slugify } from "../src/lib/utils";

const prisma = new PrismaClient();

async function main() {
  // ---- Site content (singleton row) --------------------------------------
  await prisma.siteContent.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main" }, // all fields fall back to the schema defaults
  });

  // ---- Products ------------------------------------------------------------
  const products = [
    {
      name: "Ricoh MP 3510 Photocopier",
      price: 22000,
      category: "Photocopier",
      description:
        "High-speed Ricoh MP 3510 multifunction photocopier available on monthly rental — ideal for banks, universities and busy offices needing 35 pages-per-minute printing, copying and scanning with duplex support.",
      imageUrl:
        "https://images.unsplash.com/photo-1612815154858-60aa4c59eabd?q=80&w=1200&auto=format&fit=crop",
      featured: true,
    },
    {
      name: "Xerox WorkCentre 7845",
      price: 28000,
      category: "Photocopier",
      description:
        "Color Xerox WorkCentre 7845 photocopier on rent, built for high-volume corporate printing with network scanning, ideal for marketing and admin departments that need color output daily.",
      imageUrl:
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?q=80&w=1200&auto=format&fit=crop",
      featured: true,
    },
    {
      name: "Canon iR 2625 Photocopier",
      price: 18000,
      category: "Photocopier",
      description:
        "Compact and reliable Canon iR 2625 photocopier, a cost-effective monthly rental option for small offices, schools and reception areas.",
      imageUrl:
        "https://images.unsplash.com/photo-1601972602288-3be527b4f18a?q=80&w=1200&auto=format&fit=crop",
      featured: true,
    },
    {
      name: "HP LaserJet Enterprise Printer",
      price: 12000,
      category: "Printer",
      description:
        "Heavy-duty HP LaserJet Enterprise printer on rent for departments that need dedicated fast black-and-white printing alongside a shared photocopier.",
      imageUrl:
        "https://images.unsplash.com/photo-1612815154858-60aa4c59eabd?q=80&w=1200&auto=format&fit=crop",
      featured: false,
    },
    {
      name: "Universal Toner Cartridge Refill",
      price: 3500,
      priceLabel: "/cartridge",
      category: "Toner",
      description:
        "Genuine and compatible toner cartridge supply for Ricoh, Xerox, Canon and HP machines, delivered across Lahore with same-day service for active rental clients.",
      imageUrl:
        "https://images.unsplash.com/photo-1585313319701-b2e5b3f1a5f4?q=80&w=1200&auto=format&fit=crop",
      featured: false,
    },
    {
      name: "Bulk Office Copier Package (5 Units)",
      price: 95000,
      priceLabel: "/month",
      category: "Photocopier",
      description:
        "A bundled deal of 5 photocopiers for large offices, universities and bank branches — the same volume-pricing model made popular by GCS, with a dedicated account manager and priority on-site support.",
      imageUrl:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
      featured: true,
    },
  ];

  for (const p of products) {
    const slug = slugify(p.name);
    await prisma.product.upsert({
      where: { slug },
      update: {},
      create: { ...p, slug },
    });
  }

  // ---- Testimonials ----------------------------------------------------
  const testimonials = [
    {
      name: "Fahad Malik",
      company: "Operations Manager, Private Bank — Lahore",
      message:
        "PrintPro replaced our aging copiers with Ricoh machines on a simple monthly plan. Their engineers respond same-day whenever we call — best service we've had from any vendor in Lahore.",
      rating: 5,
    },
    {
      name: "Dr. Ayesha Farooq",
      company: "Admin Department, University Campus — Lahore",
      message:
        "We rent six copiers from PrintPro across two campuses. The PaperCut integration alone has cut our paper wastage by almost a third. Highly recommended for any university.",
      rating: 5,
    },
    {
      name: "Umar Siddiqui",
      company: "Director, Corporate Office — Lahore",
      message:
        "Transparent pricing, genuine toner, and they actually pick up the phone. Switched from another supplier and haven't looked back.",
      rating: 5,
    },
  ];

  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({
      where: { name: t.name, company: t.company },
    });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
    }
  }


  // ---- Services (homepage + /services section) --------------------------
  const services = [
    {
      title: "Photocopier Rental (Monthly)",
      description: "Ricoh, Xerox and Canon photocopiers on flexible monthly rental plans — no heavy upfront investment.",
      imageUrl: "https://images.unsplash.com/photo-1612815154858-60aa4c59eabd?q=80&w=1200&auto=format&fit=crop",
      order: 1,
    },
    {
      title: "Toner & Pages Supply",
      description: "Genuine and compatible toner, drums and consumables delivered across Lahore, on schedule.",
      imageUrl: "https://images.unsplash.com/photo-1585313319701-b2e5b3f1a5f4?q=80&w=1200&auto=format&fit=crop",
      order: 2,
    },
    {
      title: "On-site Repair & Maintenance",
      description: "Certified technicians for same-day breakdown support and scheduled preventive maintenance.",
      imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop",
      order: 3,
    },
    {
      title: "Bulk Printer/Copier Deals",
      description: "Volume pricing for banks, universities and large offices needing multiple units.",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
      order: 4,
    },
  ];
  for (const s of services) {
    const existing = await prisma.service.findFirst({ where: { title: s.title } });
    if (!existing) await prisma.service.create({ data: s });
  }

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
