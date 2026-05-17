require("./config/env");

const bcrypt = require("bcryptjs");
const { create, findOne, updateById } = require("./utils/supabaseData");

const servicesSeed = [
  {
    title: "Scar Revision",
    slug: "scar-revision",
    shortDescription: "Corrective pigment work for scars, acne marks, and visible skin tone irregularities.",
    fullDescription: "Advanced paramedical micropigmentation for surgical scars, acne scarring, and complex restoration cases.",
    category: "Paramedical",
    tags: ["scar", "revision", "paramedical"],
    featured: true,
    active: true,
    displayOrder: 1
  },
  {
    title: "Vitiligo Camouflage",
    slug: "vitiligo-camouflage",
    shortDescription: "Customized tone blending for face, body, and lip vitiligo areas.",
    fullDescription: "Targeted pigment camouflage designed to restore visual balance with a careful consultation-first approach.",
    category: "Paramedical",
    tags: ["vitiligo", "camouflage"],
    featured: true,
    active: true,
    displayOrder: 2
  },
  {
    title: "Lip Blush",
    slug: "lip-blush",
    shortDescription: "Soft lip enhancement with refined, natural-looking color.",
    fullDescription: "Luxury cosmetic micropigmentation for clients who want balanced lip tone, subtle definition, and a polished finish.",
    category: "Cosmetic",
    tags: ["lips", "blush", "beauty"],
    featured: true,
    active: true,
    displayOrder: 3
  },
  {
    title: "Powder Brows",
    slug: "powder-brows",
    shortDescription: "Elegant brow definition tailored to face shape and style preference.",
    fullDescription: "A polished brow treatment designed for clients who want soft fullness and a long-wear makeup effect.",
    category: "Cosmetic",
    tags: ["brows", "powder", "beauty"],
    featured: false,
    active: true,
    displayOrder: 4
  }
];

const testimonialsSeed = [
  {
    clientName: "Areeba",
    rating: 5,
    quote: "The scar revision work gave me so much confidence back. The whole process felt professional, gentle, and beautifully handled.",
    service: "Scar Revision",
    featured: true,
    published: true
  },
  {
    clientName: "Mahnoor",
    rating: 5,
    quote: "My lip blush healed so naturally and evenly. The consultation made me feel completely comfortable before we started.",
    service: "Lip Blush",
    featured: true,
    published: true
  },
  {
    clientName: "Sana",
    rating: 5,
    quote: "Huma explained every step clearly and delivered results that looked elegant, soft, and premium.",
    service: "Powder Brows",
    featured: false,
    published: true
  }
];

const resultsSeed = [
  {
    title: "Scar softening case",
    service: "Scar Revision",
    clientAlias: "Client A",
    description: "A corrective case focused on restoring smoother tone and confidence through advanced paramedical work.",
    beforeImageUrl: "https://example.com/results/scar-before.jpg",
    afterImageUrl: "https://example.com/results/scar-after.jpg",
    featured: true,
    published: true
  },
  {
    title: "Vitiligo blend case",
    service: "Vitiligo Camouflage",
    clientAlias: "Client B",
    description: "A facial camouflage result planned to create more harmonious visual blending with surrounding tone.",
    beforeImageUrl: "https://example.com/results/vitiligo-before.jpg",
    afterImageUrl: "https://example.com/results/vitiligo-after.jpg",
    featured: true,
    published: true
  },
  {
    title: "Lip color enhancement",
    service: "Lip Blush",
    clientAlias: "Client C",
    description: "A beauty-focused result for brighter, more balanced lip tone with a refined finish.",
    beforeImageUrl: "https://example.com/results/lips-before.jpg",
    afterImageUrl: "https://example.com/results/lips-after.jpg",
    featured: false,
    published: true
  }
];

const siteSettingsSeed = {
  businessName: "Huma Arshad Aesthetics",
  instagramUrl: "https://www.instagram.com/humachaudhry.aesthetics/",
  whatsappUrl: "",
  phone: "",
  email: "admin@humaarshad.com",
  address: "Islamabad, Pakistan",
  consultationCtaText: "Book Consultation",
  bookingLink: "https://www.instagram.com/humachaudhry.aesthetics/"
};

async function upsertBy(resource, filters, payload) {
  const existing = await findOne(resource, filters);
  return existing ? updateById(resource, existing._id, payload) : create(resource, payload);
}

async function seed() {
  await upsertBy("admins", { email: "admin@humaarshad.com" }, {
    email: "admin@humaarshad.com",
    passwordHash: await bcrypt.hash("Admin123!", 10),
    fullName: "Huma Arshad Admin",
    role: "admin"
  });

  for (const service of servicesSeed) {
    await upsertBy("services", { slug: service.slug }, service);
  }

  for (const testimonial of testimonialsSeed) {
    const existing = await findOne("testimonials", { client_name: testimonial.clientName });
    if (!existing) {
      await create("testimonials", testimonial);
    }
  }

  for (const result of resultsSeed) {
    const existing = await findOne("results", { title: result.title });
    if (!existing) {
      await create("results", result);
    }
  }

  const settings = await findOne("settings", {}, [{ column: "created_at", ascending: false }]);
  if (settings) {
    await updateById("settings", settings._id, siteSettingsSeed);
  } else {
    await create("settings", siteSettingsSeed);
  }

  console.log("Seed completed successfully.");
  console.log("Admin email: admin@humaarshad.com");
  console.log("Admin password: Admin123!");
}

seed().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});

