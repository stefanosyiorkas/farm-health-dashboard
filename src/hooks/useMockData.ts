import { useState, useMemo } from 'react';
import { HerdOverview, AmuEntry, AmuMetrics, MetricType } from '../types';

const MOCK_HERD_OVERVIEW: HerdOverview = {
  herd: {
    id: '1',
    farm_name: 'Green Valley Dairy Farm',
    country: 'UK',
    species: 'dairy_cattle',
    adult_count: 250,
    youngstock_bands: { 'calves': 45, 'heifers': 80 }
  },
  metrics: {
    mg_per_pcu: 0.28,
    dddvet: 12.5,
    dcdvet: 8.3,
    hp_cia_share: 15.2,
    total_mg: 29750
  },
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
  top_actives: [
    { name: 'Amoxicillin', total_mg: 12500, share_percent: 42.0, is_hp_cia: false },
    { name: 'Enrofloxacin', total_mg: 4500, share_percent: 15.1, is_hp_cia: true },
    { name: 'Penicillin G', total_mg: 3800, share_percent: 12.8, is_hp_cia: false },
    { name: 'Ceftiofur', total_mg: 2950, share_percent: 9.9, is_hp_cia: true },
    { name: 'Oxytetracycline', total_mg: 2200, share_percent: 7.4, is_hp_cia: false }
  ],
  class_breakdown: [
    { class_name: 'Penicillins', total_mg: 16300, share_percent: 54.8, hp_cia_mg: 0 },
    { class_name: 'Fluoroquinolones', total_mg: 4500, share_percent: 15.1, hp_cia_mg: 4500 },
    { class_name: 'Cephalosporins', total_mg: 2950, share_percent: 9.9, hp_cia_mg: 2950 },
    { class_name: 'Tetracyclines', total_mg: 3200, share_percent: 10.8, hp_cia_mg: 0 },
    { class_name: 'Macrolides', total_mg: 2800, share_percent: 9.4, hp_cia_mg: 2800 }
  ]
};

const MOCK_AMU_ENTRIES: AmuEntry[] = [
  {
    id: '1',
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
    id: '2',
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
    id: '3',
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

export function useMockData() {
  const [entries, setEntries] = useState<AmuEntry[]>(MOCK_AMU_ENTRIES);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('mg_per_pcu');

  const calculatedMetrics = useMemo(() => {
    const herd = MOCK_HERD_OVERVIEW.herd;
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

    const mgPerPcu = totalMg / pcu;
    const hpCiaShare = totalMg > 0 ? (hpCiaMg / totalMg) * 100 : 0;

    return {
      mg_per_pcu: mgPerPcu,
      dddvet: totalDddvet,
      dcdvet: totalDcdvet,
      hp_cia_share: hpCiaShare,
      total_mg: totalMg
    } as AmuMetrics;
  }, [entries]);

  const addEntry = (entry: Omit<AmuEntry, 'id'>) => {
    const newEntry = { ...entry, id: Date.now().toString() };
    setEntries(prev => [...prev, newEntry]);
  };

  const updateEntry = (id: string, updates: Partial<AmuEntry>) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, ...updates } : entry
    ));
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  return {
    herdOverview: MOCK_HERD_OVERVIEW,
    amuEntries: entries,
    calculatedMetrics,
    selectedMetric,
    setSelectedMetric,
    addEntry,
    updateEntry,
    deleteEntry
  };
}