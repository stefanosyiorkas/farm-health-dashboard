import { pool } from './db.js';

async function init() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS herds (
        id SERIAL PRIMARY KEY,
        farm_name TEXT,
        country TEXT,
        species TEXT,
        adult_count INTEGER
      );

      CREATE TABLE IF NOT EXISTS amu_entries (
        id SERIAL PRIMARY KEY,
        herd_id INTEGER REFERENCES herds(id),
        product_name TEXT,
        active_name TEXT,
        antimicrobial_class TEXT,
        is_hp_cia BOOLEAN,
        species TEXT,
        age_class TEXT,
        route TEXT,
        pack_concentration_mg_per_unit REAL,
        units_administered REAL,
        duration_days INTEGER,
        animal_weight_kg REAL,
        start_date DATE,
        end_date DATE,
        notes TEXT
      );
    `);

    await client.query('TRUNCATE amu_entries, herds RESTART IDENTITY');

    const herdResult = await client.query(
      `INSERT INTO herds (farm_name, country, species, adult_count) VALUES ($1, $2, $3, $4) RETURNING id`,
      ['Green Valley Dairy Farm', 'UK', 'dairy_cattle', 250]
    );
    const herdId = herdResult.rows[0].id;

    const entries = [
      {
        product_name: 'Baytril 2.5%',
        active_name: 'Enrofloxacin',
        antimicrobial_class: 'Fluoroquinolones',
        is_hp_cia: true,
        species: 'dairy_cattle',
        age_class: 'adult',
        route: 'injectable',
        pack_concentration_mg_per_unit: 25,
        units_administered: 180,
        duration_days: 1,
        animal_weight_kg: 425,
        start_date: '2024-11-01',
        end_date: '2024-11-01',
        notes: 'Respiratory infection treatment'
      },
      {
        product_name: 'Amoxinsol',
        active_name: 'Amoxicillin',
        antimicrobial_class: 'Penicillins',
        is_hp_cia: false,
        species: 'dairy_cattle',
        age_class: 'adult',
        route: 'intramammary',
        pack_concentration_mg_per_unit: 200,
        units_administered: 400,
        duration_days: 3,
        start_date: '2024-11-05',
        end_date: '2024-11-07',
        notes: 'Mastitis treatment protocol'
      },
      {
        product_name: 'Excenel RTU',
        active_name: 'Ceftiofur',
        antimicrobial_class: 'Cephalosporins',
        is_hp_cia: true,
        species: 'dairy_cattle',
        age_class: 'adult',
        route: 'injectable',
        pack_concentration_mg_per_unit: 50,
        units_administered: 59,
        duration_days: 1,
        animal_weight_kg: 425,
        start_date: '2024-11-10',
        notes: 'Post-surgical prophylaxis'
      }
    ];

    for (const e of entries) {
      await client.query(
        `INSERT INTO amu_entries (
          herd_id, product_name, active_name, antimicrobial_class, is_hp_cia, species, age_class, route,
          pack_concentration_mg_per_unit, units_administered, duration_days, animal_weight_kg, start_date, end_date, notes
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
        [
          herdId,
          e.product_name,
          e.active_name,
          e.antimicrobial_class,
          e.is_hp_cia,
          e.species,
          e.age_class,
          e.route,
          e.pack_concentration_mg_per_unit,
          e.units_administered,
          e.duration_days,
          e.animal_weight_kg,
          e.start_date,
          e.end_date,
          e.notes
        ]
      );
    }

    const res = await client.query('SELECT * FROM amu_entries');
    console.log('Seeded AMU entries:', res.rows);
  } finally {
    client.release();
  }
}

init().catch(err => {
  console.error(err);
  process.exit(1);
});
