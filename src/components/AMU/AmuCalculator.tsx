import React from 'react';
import { Info } from 'lucide-react';
import { AmuEntry, AmuMetrics, MetricType } from '../../types';
import { KPICard } from '../Common/KPICard';
import { MetricToggle } from '../Common/MetricToggle';
import { AmuDataGrid } from './AmuDataGrid';
import { AmuCharts } from './AmuCharts';

interface AmuCalculatorProps {
  entries: AmuEntry[];
  metrics: AmuMetrics;
  selectedMetric: MetricType;
  onMetricChange: (metric: MetricType) => void;
  onAddEntry: (entry: Omit<AmuEntry, 'id'>) => void;
  onUpdateEntry: (id: string, updates: Partial<AmuEntry>) => void;
  onDeleteEntry: (id: string) => void;
}

export function AmuCalculator({
  entries,
  metrics,
  selectedMetric,
  onMetricChange,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry
}: AmuCalculatorProps) {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Antimicrobial Use Calculator</h1>
            <p className="text-gray-600 max-w-2xl">
              Calculate mg/PCU, DDDvet, and DCDvet metrics for your antimicrobial treatments. 
              Track Highest-Priority Critically Important Antibiotics (HP-CIA) usage.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Info className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Metric Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Current Session</h2>
          <p className="text-sm text-gray-500 mt-1">Add treatments and view calculated metrics</p>
        </div>
        <MetricToggle 
          selectedMetric={selectedMetric}
          onMetricChange={onMetricChange}
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="mg per PCU"
          value={metrics.mg_per_pcu.toFixed(3)}
          subtitle="Milligrams per Population Correction Unit"
        />
        
        <KPICard
          title="DDDvet"
          value={metrics.dddvet.toFixed(1)}
          subtitle="Defined Daily Dose for animals"
        />
        
        <KPICard
          title="DCDvet"
          value={metrics.dcdvet.toFixed(1)}
          subtitle="Defined Course Dose for animals"
        />
        
        <KPICard
          title="HP-CIA Share"
          value={`${metrics.hp_cia_share.toFixed(1)}%`}
          subtitle={`${(metrics.total_mg * metrics.hp_cia_share / 100).toLocaleString()} mg`}
          isHighPriority={metrics.hp_cia_share > 10}
        />
      </div>

      {/* Data Grid */}
      <AmuDataGrid
        entries={entries}
        onAddEntry={onAddEntry}
        onUpdateEntry={onUpdateEntry}
        onDeleteEntry={onDeleteEntry}
      />

      {/* Charts */}
      <div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Analysis & Visualization</h3>
          <p className="text-sm text-gray-500 mt-1">Visual breakdown of antimicrobial usage patterns</p>
        </div>
        <AmuCharts entries={entries} selectedMetric={selectedMetric} />
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-4">How to Use</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <h5 className="font-semibold text-blue-800 mb-2">1. Add Treatments</h5>
            <p className="text-blue-700">
              Enter antimicrobial treatments using the "Add Entry" button or import from Excel. 
              Include product name, active ingredient, route, and dosing information.
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-blue-800 mb-2">2. Review Calculations</h5>
            <p className="text-blue-700">
              Metrics are calculated automatically based on your herd size and treatment data. 
              Switch between mg/PCU, DDDvet, and DCDvet views using the toggle.
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-blue-800 mb-2">3. Monitor HP-CIA</h5>
            <p className="text-blue-700">
              Highest-Priority Critically Important Antibiotics are highlighted in red. 
              Aim to minimize HP-CIA usage for responsible antimicrobial stewardship.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}