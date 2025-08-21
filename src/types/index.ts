export interface Herd {
  id: string;
  farm_name: string;
  country: string;
  species: string;
  adult_count: number;
  youngstock_bands?: Record<string, number>;
}

export interface AmuEntry {
  id: string;
  product_name: string;
  active_name: string;
  antimicrobial_class: string;
  is_hp_cia: boolean;
  species: string;
  age_class: string;
  route: string;
  pack_concentration_mg_per_unit: number;
  units_administered: number;
  duration_days: number;
  animal_weight_kg?: number;
  start_date?: string;
  end_date?: string;
  notes?: string;
}

export interface AmuMetrics {
  mg_per_pcu: number;
  dddvet: number;
  dcdvet: number;
  hp_cia_share: number;
  total_mg: number;
}

export interface HerdOverview {
  herd: Herd;
  metrics: AmuMetrics;
  trends: Array<{
    month: string;
    mg_per_pcu: number;
    dddvet: number;
    dcdvet: number;
    hp_cia_share: number;
  }>;
  top_actives: Array<{
    name: string;
    total_mg: number;
    share_percent: number;
    is_hp_cia: boolean;
  }>;
  class_breakdown: Array<{
    class_name: string;
    total_mg: number;
    share_percent: number;
    hp_cia_mg: number;
  }>;
}

export type MetricType = 'mg_per_pcu' | 'dddvet' | 'dcdvet';