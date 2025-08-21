import React from 'react';
import { clsx } from 'clsx';
import { MetricType } from '../../types';

interface MetricToggleProps {
  selectedMetric: MetricType;
  onMetricChange: (metric: MetricType) => void;
  className?: string;
}

const metrics: Array<{ key: MetricType; label: string; description: string }> = [
  { key: 'mg_per_pcu', label: 'mg/PCU', description: 'Milligrams per Population Correction Unit' },
  { key: 'dddvet', label: 'DDDvet', description: 'Defined Daily Dose for animals' },
  { key: 'dcdvet', label: 'DCDvet', description: 'Defined Course Dose for animals' }
];

export function MetricToggle({ selectedMetric, onMetricChange, className }: MetricToggleProps) {
  return (
    <div className={clsx("inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1", className)}>
      {metrics.map((metric) => (
        <button
          key={metric.key}
          onClick={() => onMetricChange(metric.key)}
          title={metric.description}
          className={clsx(
            "px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
            selectedMetric === metric.key
              ? "bg-white text-green-700 shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          )}
        >
          {metric.label}
        </button>
      ))}
    </div>
  );
}