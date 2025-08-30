CREATE TABLE herds (
  id SERIAL PRIMARY KEY,
  farm_name VARCHAR(255) NOT NULL,
  country VARCHAR(255),
  species VARCHAR(255),
  adult_count INTEGER,
  youngstock_bands JSONB
);

INSERT INTO herds (farm_name, country, species, adult_count, youngstock_bands) VALUES
('Green Valley Dairy Farm', 'UK', 'dairy_cattle', 250, '{ "calves": 45, "heifers": 80 }');

CREATE TABLE amu_entries (
  id SERIAL PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  active_name VARCHAR(255) NOT NULL,
  antimicrobial_class VARCHAR(255),
  is_hp_cia BOOLEAN DEFAULT false,
  species VARCHAR(255),
  age_class VARCHAR(255),
  route VARCHAR(255),
  pack_concentration_mg_per_unit NUMERIC,
  units_administered NUMERIC NOT NULL,
  duration_days INTEGER,
  animal_weight_kg NUMERIC,
  start_date DATE,
  end_date DATE,
  notes TEXT
);

INSERT INTO amu_entries (product_name, active_name, antimicrobial_class, is_hp_cia, species, age_class, route, pack_concentration_mg_per_unit, units_administered, duration_days, animal_weight_kg, start_date, end_date, notes) VALUES
('Baytril 2.5%', 'Enrofloxacin', 'Fluoroquinolones', true, 'dairy_cattle', 'adult', 'injectable', 25, 180, 1, 425, '2024-11-01', '2024-11-01', 'Respiratory infection treatment'),
('Amoxinsol', 'Amoxicillin', 'Penicillins', false, 'dairy_cattle', 'adult', 'intramammary', 200, 400, 3, null, '2024-11-05', '2024-11-07', 'Mastitis treatment protocol'),
('Excenel RTU', 'Ceftiofur', 'Cephalosporins', true, 'dairy_cattle', 'adult', 'injectable', 50, 59, 1, 425, '2024-11-10', null, 'Post-surgical prophylaxis');

CREATE TABLE medications (
  id SERIAL PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL UNIQUE,
  active_name VARCHAR(255) NOT NULL,
  antimicrobial_class VARCHAR(255),
  is_hp_cia BOOLEAN DEFAULT false,
  pack_concentration_mg_per_unit NUMERIC,
  default_route VARCHAR(255)
);

INSERT INTO medications (product_name, active_name, antimicrobial_class, is_hp_cia, pack_concentration_mg_per_unit, default_route) VALUES
('Baytril 2.5%', 'Enrofloxacin', 'Fluoroquinolones', true, 25, 'injectable'),
('Amoxinsol', 'Amoxicillin', 'Penicillins', false, 200, 'intramammary'),
('Excenel RTU', 'Ceftiofur', 'Cephalosporins', true, 50, 'injectable'),
('Pen & Strep', 'Penicillin & Streptomycin', 'Penicillins', false, 250, 'injectable');
