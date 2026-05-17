create extension if not exists pgcrypto;

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  full_name text not null,
  role text not null default 'admin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists booking_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  service text not null,
  preferred_date text not null default '',
  preferred_time text not null default '',
  message text not null default '',
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null default '',
  subject text not null default '',
  message text not null,
  status text not null default 'unread' check (status in ('unread', 'read', 'replied')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists newsletter_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text not null default '',
  full_description text not null default '',
  category text not null default '',
  tags text[] not null default '{}',
  featured boolean not null default false,
  active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists result_cases (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  service text not null,
  client_alias text not null default '',
  description text not null default '',
  before_image_url text not null default '',
  after_image_url text not null default '',
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  quote text not null,
  service text not null default '',
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists availability_slots (
  id uuid primary key default gen_random_uuid(),
  date text not null,
  time text not null,
  available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  business_name text not null default 'Huma Arshad Aesthetics',
  instagram_url text not null default '',
  whatsapp_url text not null default '',
  phone text not null default '',
  email text not null default '',
  address text not null default '',
  consultation_cta_text text not null default 'Book Consultation',
  booking_link text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'admins',
    'booking_requests',
    'contact_inquiries',
    'newsletter_leads',
    'services',
    'result_cases',
    'testimonials',
    'availability_slots',
    'site_settings'
  ]
  loop
    execute format('drop trigger if exists set_%I_updated_at on %I', table_name, table_name);
    execute format('create trigger set_%I_updated_at before update on %I for each row execute function set_updated_at()', table_name, table_name);
  end loop;
end;
$$;

insert into admins (email, password_hash, full_name, role)
values ('admin@humaarshad.com', '$2a$10$tGwezurU/JFhI/NoZsp.M.imXm3FdxMhUke9yfJQaEUb2/rAAecpW', 'Huma Arshad Admin', 'admin')
on conflict (email) do update set
  password_hash = excluded.password_hash,
  full_name = excluded.full_name,
  role = excluded.role;

insert into services (title, slug, short_description, full_description, category, tags, featured, active, display_order)
values
  ('Scar Revision', 'scar-revision', 'Corrective pigment work for scars, acne marks, and visible skin tone irregularities.', 'Advanced paramedical micropigmentation for surgical scars, acne scarring, and complex restoration cases.', 'Paramedical', array['scar','revision','paramedical'], true, true, 1),
  ('Vitiligo Camouflage', 'vitiligo-camouflage', 'Customized tone blending for face, body, and lip vitiligo areas.', 'Targeted pigment camouflage designed to restore visual balance with a careful consultation-first approach.', 'Paramedical', array['vitiligo','camouflage'], true, true, 2),
  ('Lip Blush', 'lip-blush', 'Soft lip enhancement with refined, natural-looking color.', 'Luxury cosmetic micropigmentation for clients who want balanced lip tone, subtle definition, and a polished finish.', 'Cosmetic', array['lips','blush','beauty'], true, true, 3),
  ('Powder Brows', 'powder-brows', 'Elegant brow definition tailored to face shape and style preference.', 'A polished brow treatment designed for clients who want soft fullness and a long-wear makeup effect.', 'Cosmetic', array['brows','powder','beauty'], false, true, 4)
on conflict (slug) do update set
  title = excluded.title,
  short_description = excluded.short_description,
  full_description = excluded.full_description,
  category = excluded.category,
  tags = excluded.tags,
  featured = excluded.featured,
  active = excluded.active,
  display_order = excluded.display_order;

insert into testimonials (client_name, rating, quote, service, featured, published)
values
  ('Areeba', 5, 'The scar revision work gave me so much confidence back. The whole process felt professional, gentle, and beautifully handled.', 'Scar Revision', true, true),
  ('Mahnoor', 5, 'My lip blush healed so naturally and evenly. The consultation made me feel completely comfortable before we started.', 'Lip Blush', true, true),
  ('Sana', 5, 'Huma explained every step clearly and delivered results that looked elegant, soft, and premium.', 'Powder Brows', false, true)
on conflict do nothing;

insert into result_cases (title, service, client_alias, description, before_image_url, after_image_url, featured, published)
values
  ('Scar softening case', 'Scar Revision', 'Client A', 'A corrective case focused on restoring smoother tone and confidence through advanced paramedical work.', 'https://example.com/results/scar-before.jpg', 'https://example.com/results/scar-after.jpg', true, true),
  ('Vitiligo blend case', 'Vitiligo Camouflage', 'Client B', 'A facial camouflage result planned to create more harmonious visual blending with surrounding tone.', 'https://example.com/results/vitiligo-before.jpg', 'https://example.com/results/vitiligo-after.jpg', true, true),
  ('Lip color enhancement', 'Lip Blush', 'Client C', 'A beauty-focused result for brighter, more balanced lip tone with a refined finish.', 'https://example.com/results/lips-before.jpg', 'https://example.com/results/lips-after.jpg', false, true)
on conflict do nothing;

insert into site_settings (business_name, instagram_url, whatsapp_url, phone, email, address, consultation_cta_text, booking_link)
select 'Huma Arshad Aesthetics', 'https://www.instagram.com/humachaudhry.aesthetics/', '', '', 'admin@humaarshad.com', 'Islamabad, Pakistan', 'Book Consultation', 'https://www.instagram.com/humachaudhry.aesthetics/'
where not exists (select 1 from site_settings);

