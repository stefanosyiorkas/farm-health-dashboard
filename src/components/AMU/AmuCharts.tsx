import React, { useMemo, useRef } from 'react';
import { toPng } from 'html-to-image';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AmuEntry, MetricType } from '../../types';
import { AlertTriangle, Download } from 'lucide-react';

interface AmuChartsProps {
  entries: AmuEntry[];
  selectedMetric: MetricType;
}

const COLORS = ['#16A34A', '#2563EB', '#D97706', '#DC2626', '#7C2D12', '#4B5563', '#6B7280'];

export function AmuCharts({ entries, selectedMetric }: AmuChartsProps) {
  const classChartRef = useRef<HTMLDivElement>(null);
  const activeChartRef = useRef<HTMLDivElement>(null);

  const downloadChart = (ref: React.RefObject<HTMLDivElement>, filename: string) => {
    if (ref.current === null) {
      return;
    }

    const filter = (node: HTMLElement) => {
      // Exclude elements with the 'exclude-from-download' class
      return !node.classList?.contains('exclude-from-download');
    };

    toPng(ref.current, { cacheBust: true, backgroundColor: 'white', pixelRatio: 2, filter })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((err) => {
        console.error('oops, something went wrong!', err);
      });
  };

  const getMetricValueForEntry = (entry: AmuEntry, metric: MetricType): number => {
    const standardWeight = 425; // kg for dairy cattle, as used in backend
    const totalMg = entry.pack_concentration_mg_per_unit * entry.units_administered;

    switch (metric) {
      case 'dddvet':
        return (totalMg / (entry.animal_weight_kg || standardWeight)) * (entry.duration_days || 1) * 0.1;
      case 'dcdvet':
        return (totalMg / (entry.animal_weight_kg || standardWeight)) * 0.15;
      case 'mg_per_pcu':
      default:
        return totalMg;
    }
  };

  const { label: metricLabel, formatter: metricFormatter } = useMemo(() => {
    switch (selectedMetric) {
      case 'dddvet': return { label: 'DDDvet', formatter: (val: number) => val.toFixed(1) };
      case 'dcdvet': return { label: 'DCDvet', formatter: (val: number) => val.toFixed(1) };
      case 'mg_per_pcu':
      default: return { label: 'Total mg', formatter: (val: number) => val.toLocaleString() };
    }
  }, [selectedMetric]);

  // Calculate class breakdown
  const classData = useMemo(() => entries.reduce((acc, entry) => {
    const metricValue = getMetricValueForEntry(entry, selectedMetric);
    const existing = acc.find(item => item.class === entry.antimicrobial_class);
    
    if (existing) {
      existing.value += metricValue;
      if (entry.is_hp_cia) {
        existing.hp_cia_value += metricValue;
      }
    } else {
      acc.push({
        class: entry.antimicrobial_class,
        value: metricValue,
        hp_cia_value: entry.is_hp_cia ? metricValue : 0,
      });
    }
    return acc;
  }, [] as Array<{ class: string; value: number; hp_cia_value: number }>), [entries, selectedMetric]);

  // Calculate active breakdown
  const activeData = useMemo(() => entries.reduce((acc, entry) => {
    const metricValue = getMetricValueForEntry(entry, selectedMetric);
    const existing = acc.find(item => item.active === entry.active_name);
    
    if (existing) {
      existing.value += metricValue;
    } else {
      acc.push({
        active: entry.active_name,
        value: metricValue,
        is_hp_cia: entry.is_hp_cia
      });
    }
    return acc;
  }, [] as Array<{ active: string; value: number; is_hp_cia: boolean }>)
  .sort((a, b) => b.value - a.value)
  .slice(0, 10), [entries, selectedMetric]);

  const totalMg = entries.reduce((sum, entry) => 
    sum + (entry.pack_concentration_mg_per_unit * entry.units_administered), 0
  );

  const hpCiaTotal = entries.reduce((sum, entry) => 
    sum + (entry.is_hp_cia ? entry.pack_concentration_mg_per_unit * entry.units_administered : 0), 0
  );

  const hpCiaPercentage = totalMg > 0 ? ((hpCiaTotal / totalMg) * 100) : 0;

  if (entries.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
          <div className="text-gray-400 mb-4">
            <BarChart className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Antimicrobial Class Breakdown</h3>
          <p className="text-gray-500">Add treatments to see class distribution</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
          <div className="text-gray-400 mb-4">
            <PieChart className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Top Active Ingredients</h3>
          <p className="text-gray-500">Add treatments to see active ingredients</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Class Breakdown Chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6" ref={classChartRef}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Κατηγορίες Αντιμικροβιακών</h3>
            <p className="text-sm text-gray-500">Κατανομή κατά {metricLabel}</p>
          </div>
          <div className="flex items-center space-x-2">
            {hpCiaPercentage > 0 && (
              <div className="flex items-center space-x-2 bg-red-50 px-3 py-1.5 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-red-700">
                  {hpCiaPercentage.toFixed(1)}% HP-CIA
                </span>
              </div>
            )}
            <button
              onClick={() => downloadChart(classChartRef, 'antimicrobial-classes-chart.png')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all exclude-from-download"
              title="Download Chart"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={classData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="class" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value: number, name: string) => [`${metricFormatter(value)}`, name]}
                labelFormatter={(label) => `Class: ${label}`}
              />
              <Bar dataKey="value" name="Total" fill="#16A34A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="hp_cia_value" name="HP-CIA" fill="#DC2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Actives Chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6" ref={activeChartRef}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Κορυφαίες Δραστικές Ουσίες</h3>
            <p className="text-sm text-gray-500">Με βάση τη συνεισφορά σε {metricLabel}</p>
          </div>
          <button
            onClick={() => downloadChart(activeChartRef, 'top-active-ingredients-chart.png')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all exclude-from-download"
            title="Download Chart"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activeData} layout="vertical" margin={{ top: 20, right: 30, left: 80, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis 
                type="category" 
                dataKey="active" 
                tick={{ fontSize: 12 }}
                width={80}
              />
              <Tooltip 
                formatter={(value: number) => [`${metricFormatter(value)}`, metricLabel]}
                labelFormatter={(label) => `Active: ${label}`}
              />
              <Bar 
                dataKey="value" 
                fill="#2563EB" 
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
