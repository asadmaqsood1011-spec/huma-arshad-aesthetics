const { getSupabase } = require("../config/supabase");

const configs = {
  admins: {
    table: "admins",
    columns: {
      email: "email",
      passwordHash: "password_hash",
      fullName: "full_name",
      role: "role"
    }
  },
  bookings: {
    table: "booking_requests",
    columns: {
      fullName: "full_name",
      email: "email",
      phone: "phone",
      service: "service",
      preferredDate: "preferred_date",
      preferredTime: "preferred_time",
      message: "message",
      status: "status",
      source: "source"
    }
  },
  inquiries: {
    table: "contact_inquiries",
    columns: {
      fullName: "full_name",
      email: "email",
      phone: "phone",
      subject: "subject",
      message: "message",
      status: "status"
    }
  },
  newsletter: {
    table: "newsletter_leads",
    columns: {
      email: "email",
      source: "source"
    }
  },
  services: {
    table: "services",
    columns: {
      title: "title",
      slug: "slug",
      shortDescription: "short_description",
      fullDescription: "full_description",
      category: "category",
      tags: "tags",
      featured: "featured",
      active: "active",
      displayOrder: "display_order"
    }
  },
  results: {
    table: "result_cases",
    columns: {
      title: "title",
      service: "service",
      clientAlias: "client_alias",
      description: "description",
      beforeImageUrl: "before_image_url",
      afterImageUrl: "after_image_url",
      featured: "featured",
      published: "published"
    }
  },
  testimonials: {
    table: "testimonials",
    columns: {
      clientName: "client_name",
      rating: "rating",
      quote: "quote",
      service: "service",
      featured: "featured",
      published: "published"
    }
  },
  availability: {
    table: "availability_slots",
    columns: {
      date: "date",
      time: "time",
      available: "available"
    }
  },
  settings: {
    table: "site_settings",
    columns: {
      businessName: "business_name",
      instagramUrl: "instagram_url",
      whatsappUrl: "whatsapp_url",
      phone: "phone",
      email: "email",
      address: "address",
      consultationCtaText: "consultation_cta_text",
      bookingLink: "booking_link"
    }
  }
};

function getConfig(resource) {
  const config = configs[resource];

  if (!config) {
    throw new Error(`Unknown Supabase resource: ${resource}`);
  }

  return config;
}

function toDb(resource, payload) {
  const config = getConfig(resource);
  const row = {};

  Object.entries(payload || {}).forEach(([key, value]) => {
    const column = config.columns[key];

    if (column && value !== undefined) {
      row[column] = value;
    }
  });

  return row;
}

function fromDb(resource, row) {
  if (!row) {
    return null;
  }

  const config = getConfig(resource);
  const model = {
    _id: row.id,
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };

  Object.entries(config.columns).forEach(([key, column]) => {
    model[key] = row[column];
  });

  return model;
}

function applyFilters(query, filters) {
  Object.entries(filters || {}).forEach(([column, value]) => {
    query = query.eq(column, value);
  });

  return query;
}

function applyOrder(query, order) {
  (order || []).forEach(({ column, ascending = true }) => {
    query = query.order(column, { ascending });
  });

  return query;
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value || "")
  );
}

async function list(resource, options = {}) {
  const config = getConfig(resource);
  let query = getSupabase().from(config.table).select("*");
  query = applyFilters(query, options.filters);
  query = applyOrder(query, options.order);

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data || []).map((row) => fromDb(resource, row));
}

async function count(resource, filters = {}) {
  const config = getConfig(resource);
  let query = getSupabase().from(config.table).select("id", {
    count: "exact",
    head: true
  });
  query = applyFilters(query, filters);

  const { count: total, error } = await query;

  if (error) {
    throw error;
  }

  return total || 0;
}

async function findById(resource, id, filters = {}) {
  if (!isUuid(id)) {
    return null;
  }

  const config = getConfig(resource);
  let query = getSupabase().from(config.table).select("*").eq("id", id);
  query = applyFilters(query, filters);

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw error;
  }

  return fromDb(resource, data);
}

async function findOne(resource, filters = {}, order = []) {
  const config = getConfig(resource);
  let query = getSupabase().from(config.table).select("*");
  query = applyFilters(query, filters);
  query = applyOrder(query, order);

  const { data, error } = await query.limit(1).maybeSingle();

  if (error) {
    throw error;
  }

  return fromDb(resource, data);
}

async function create(resource, payload) {
  const config = getConfig(resource);
  const { data, error } = await getSupabase()
    .from(config.table)
    .insert(toDb(resource, payload))
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return fromDb(resource, data);
}

async function updateById(resource, id, payload) {
  if (!isUuid(id)) {
    return null;
  }

  const config = getConfig(resource);
  const { data, error } = await getSupabase()
    .from(config.table)
    .update(toDb(resource, payload))
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return fromDb(resource, data);
}

async function deleteById(resource, id) {
  if (!isUuid(id)) {
    return null;
  }

  const config = getConfig(resource);
  const { data, error } = await getSupabase()
    .from(config.table)
    .delete()
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return fromDb(resource, data);
}

module.exports = {
  count,
  create,
  deleteById,
  findById,
  findOne,
  isUuid,
  list,
  updateById
};

