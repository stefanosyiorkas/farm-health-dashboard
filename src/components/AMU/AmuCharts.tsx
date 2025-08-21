import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart } from 'recharts';
import { AmuEntry } from '../../types';
import { AlertTriangle } from 'lucide-react';

interface AmuChartsProps {
  entries: AmuEntry[];
}

export function AmuCharts({ entries }: AmuChartsProps) {
  // Calculate class breakdown
  const classData = entries.reduce((acc, entry) => {
    const totalMg = entry.pack_concentration_mg_per_unit * entry.units_administered;
    const existing = acc.find(item => item.class === entry.antimicrobial_class);
    
    if (existing) {
      existing.total_mg += totalMg;
      if (entry.is_hp_cia) {
        existing.hp_cia_mg += totalMg;
      }
    } else {
      acc.push({
        class: entry.antimicrobial_class,
        total_mg: totalMg,
        hp_cia_mg: entry.is_hp_cia ? totalMg : 0,
        is_hp_cia: entry.is_hp_cia
      });
    }
    return acc;
  }, [] as Array<{ class: string; total_mg: number; hp_cia_mg: number; is_hp_cia: boolean }>);

  // Calculate active breakdown
  const activeData = entries.reduce((acc, entry) => {
    const totalMg = entry.pack_concentration_mg_per_unit * entry.units_administered;
    const existing = acc.find(item => item.active === entry.active_name);
    
    if (existing) {
      existing.total_mg += totalMg;
    } else {
      acc.push({
        active: entry.active_name,
        total_mg: totalMg,
        is_hp_cia: entry.is_hp_cia
      });
    }
    return acc;
  }, [] as Array<{ active: string; total_mg: number; is_hp_cia: boolean }>)
  .sort((a, b) => b.total_mg - a.total_mg)
  .slice(0, 10);

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
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Antimicrobial Classes</h3>
            <p className="text-sm text-gray-500">Distribution by total mg</p>
          </div>
          {hpCiaPercentage > 0 && (
            <div className="flex items-center space-x-2 bg-red-50 px-3 py-1.5 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-700">
                {hpCiaPercentage.toFixed(1)}% HP-CIA
              </span>
            </div>
          )}
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
                formatter={(value: number, name: string) => [
                  `${value.toLocaleString()} mg`,
                  name === 'total_mg' ? 'Total' : 'HP-CIA'
                ]}
                labelFormatter={(label) => `Class: ${label}`}
              />
              <Bar dataKey="total_mg" fill="#16A34A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="hp_cia_mg" fill="#DC2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Actives Chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Top Active Ingredients</h3>
          <p className="text-sm text-gray-500">By total mg contribution</p>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activeData} layout="horizontal" margin={{ top: 20, right: 30, left: 80, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis 
                type="category" 
                dataKey="active" 
                tick={{ fontSize: 12 }}
                width={80}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toLocaleString()} mg`, 'Total']}
                labelFormatter={(label) => `Active: ${label}`}
              />
              <Bar 
                dataKey="total_mg" 
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