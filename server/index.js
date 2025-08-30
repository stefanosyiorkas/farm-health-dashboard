const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// --- METRIC CALCULATION LOGIC (from useMockData.ts) ---
const calculateMetrics = (entries, herd) => {
  const standardWeight = 425; // kg for dairy cattle
  const pcu = herd.adult_count * standardWeight;
  
  let totalMg = 0;
  let hpCiaMg = 0;
  let totalDddvet = 0;
  let totalDcdvet = 0;

  entries.forEach(entry => {
    const entryTotalMg = entry.pack_concentration_mg_per_unit * entry.units_administered;
    totalMg += entryTotalMg;
    
    if (entry.is_hp_cia) {
      hpCiaMg += entryTotalMg;
    }

    // Simplified calculations for demo
    totalDddvet += (entryTotalMg / (entry.animal_weight_kg || standardWeight)) * (entry.duration_days || 1) * 0.1;
    totalDcdvet += (entryTotalMg / (entry.animal_weight_kg || standardWeight)) * 0.15;
  });

  const mgPerPcu = pcu > 0 ? totalMg / pcu : 0;
  const hpCiaShare = totalMg > 0 ? (hpCiaMg / totalMg) * 100 : 0;

  return {
    mg_per_pcu: mgPerPcu,
    dddvet: totalDddvet,
    dcdvet: totalDcdvet,
    hp_cia_share: hpCiaShare,
    total_mg: totalMg
  };
};


app.get('/api/herd-overview', async (req, res) => {
  try {
    const herdResult = await pool.query('SELECT * FROM herds WHERE id = 1');
    const herd = herdResult.rows[0];
    
    const entriesResult = await pool.query('SELECT * FROM amu_entries ORDER BY start_date DESC');
    const entries = entriesResult.rows;

    const metrics = calculateMetrics(entries, herd);

    // Calculate Top Actives and Class Breakdown from real data
    const actives = {};
    entries.forEach(entry => {
      const totalMg = entry.pack_concentration_mg_per_unit * entry.units_administered;
      if (!actives[entry.active_name]) {
        actives[entry.active_name] = {
          total_mg: 0,
          is_hp_cia: false,
        };
      }
      actives[entry.active_name].total_mg += totalMg;
      if (entry.is_hp_cia) {
        actives[entry.active_name].is_hp_cia = true;
      }
    });

    const top_actives = Object.keys(actives).map(name => ({
      name,
      total_mg: actives[name].total_mg,
      is_hp_cia: actives[name].is_hp_cia,
      share_percent: metrics.total_mg > 0 ? (actives[name].total_mg / metrics.total_mg) * 100 : 0
    }))
    .sort((a, b) => b.total_mg - a.total_mg)
    .slice(0, 5);

    const classes = {};
    entries.forEach(entry => {
        const totalMg = entry.pack_concentration_mg_per_unit * entry.units_administered;
        const className = entry.antimicrobial_class || 'Unclassified';
        if (!classes[className]) {
            classes[className] = {
                total_mg: 0,
                hp_cia_mg: 0
            };
        }
        classes[className].total_mg += totalMg;
        if (entry.is_hp_cia) {
            classes[className].hp_cia_mg += totalMg;
        }
    });

    const class_breakdown = Object.keys(classes).map(name => ({
        class_name: name,
        total_mg: classes[name].total_mg,
        share_percent: metrics.total_mg > 0 ? (classes[name].total_mg / metrics.total_mg) * 100 : 0,
        hp_cia_mg: classes[name].hp_cia_mg
    }))
    .sort((a, b) => b.total_mg - a.total_mg);
    
    // Mocking trends for now to match frontend expectations
    const herdOverview = {
      herd,
      metrics,
      trends: [
        { month: '2024-01', mg_per_pcu: 0.32, dddvet: 14.2, dcdvet: 9.1, hp_cia_share: 18.5 },
        { month: '2024-02', mg_per_pcu: 0.25, dddvet: 11.8, dcdvet: 7.9, hp_cia_share: 12.3 },
        { month: '2024-03', mg_per_pcu: 0.31, dddvet: 13.5, dcdvet: 8.8, hp_cia_share: 16.7 },
        { month: '2024-04', mg_per_pcu: 0.22, dddvet: 10.1, dcdvet: 6.5, hp_cia_share: 11.2 },
        { month: '2024-05', mg_per_pcu: 0.29, dddvet: 12.9, dcdvet: 8.4, hp_cia_share: 14.8 },
        { month: '2024-06', mg_per_pcu: 0.26, dddvet: 11.5, dcdvet: 7.7, hp_cia_share: 13.1 },
        { month: '2024-07', mg_per_pcu: 0.33, dddvet: 15.2, dcdvet: 9.8, hp_cia_share: 19.3 },
        { month: '2024-08', mg_per_pcu: 0.27, dddvet: 12.3, dcdvet: 8.0, hp_cia_share: 14.5 },
        { month: '2024-09', mg_per_pcu: 0.30, dddvet: 13.7, dcdvet: 8.9, hp_cia_share: 16.2 },
        { month: '2024-10', mg_per_pcu: 0.24, dddvet: 10.8, dcdvet: 7.2, hp_cia_share: 12.8 },
        { month: '2024-11', mg_per_pcu: 0.28, dddvet: 12.5, dcdvet: 8.3, hp_cia_share: 15.2 },
        { month: '2024-12', mg_per_pcu: 0.25, dddvet: 11.2, dcdvet: 7.5, hp_cia_share: 13.6 }
      ],
      top_actives,
      class_breakdown
    };

    res.json(herdOverview);
  } catch (error) {
    console.error('Error fetching herd overview:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/amu-entries', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM amu_entries ORDER BY start_date DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching AMU entries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/amu-entries', async (req, res) => {
  try {
    const {
      product_name, active_name, antimicrobial_class, is_hp_cia, species,
      age_class, route, pack_concentration_mg_per_unit, units_administered,
      duration_days, animal_weight_kg, start_date, end_date, notes
    } = req.body;

    const result = await pool.query(
      `INSERT INTO amu_entries (
        product_name, active_name, antimicrobial_class, is_hp_cia, species,
        age_class, route, pack_concentration_mg_per_unit, units_administered,
        duration_days, animal_weight_kg, start_date, end_date, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [
        product_name, active_name, antimicrobial_class, is_hp_cia, species,
        age_class, route, pack_concentration_mg_per_unit, units_administered,
        duration_days, animal_weight_kg, start_date || null, end_date || null, notes
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding AMU entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/amu-entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      product_name, active_name, antimicrobial_class, is_hp_cia, species,
      age_class, route, pack_concentration_mg_per_unit, units_administered,
      duration_days, animal_weight_kg, start_date, end_date, notes
    } = req.body;

    const result = await pool.query(
      `UPDATE amu_entries SET
        product_name = $1, active_name = $2, antimicrobial_class = $3, is_hp_cia = $4,
        species = $5, age_class = $6, route = $7, pack_concentration_mg_per_unit = $8,
        units_administered = $9, duration_days = $10, animal_weight_kg = $11,
        start_date = $12, end_date = $13, notes = $14
      WHERE id = $15 RETURNING *`,
      [
        product_name, active_name, antimicrobial_class, is_hp_cia, species,
        age_class, route, pack_concentration_mg_per_unit, units_administered,
        duration_days, animal_weight_kg, start_date || null, end_date || null, notes, id
      ]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error updating AMU entry ${req.params.id}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- MEDICATIONS API ---

app.get('/api/medications', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM medications ORDER BY product_name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/medications', async (req, res) => {
  try {
    const { product_name, active_name, antimicrobial_class, is_hp_cia, pack_concentration_mg_per_unit, default_route } = req.body;
    const result = await pool.query(
      `INSERT INTO medications (product_name, active_name, antimicrobial_class, is_hp_cia, pack_concentration_mg_per_unit, default_route)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [product_name, active_name, antimicrobial_class, is_hp_cia, pack_concentration_mg_per_unit, default_route]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding medication:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/medications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { product_name, active_name, antimicrobial_class, is_hp_cia, pack_concentration_mg_per_unit, default_route } = req.body;
    const result = await pool.query(
      `UPDATE medications SET
         product_name = $1, active_name = $2, antimicrobial_class = $3,
         is_hp_cia = $4, pack_concentration_mg_per_unit = $5, default_route = $6
       WHERE id = $7 RETURNING *`,
      [product_name, active_name, antimicrobial_class, is_hp_cia, pack_concentration_mg_per_unit, default_route, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error updating medication ${req.params.id}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/medications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM medications WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting medication ${req.params.id}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.delete('/api/amu-entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM amu_entries WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting AMU entry ${req.params.id}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
