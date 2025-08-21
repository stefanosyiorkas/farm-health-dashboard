import React from 'react';
import { Calendar, Users, TrendingUp, AlertTriangle, Calculator, FileUp, Download, History } from 'lucide-react';
import { HerdOverview, MetricType } from '../../types';
import { KPICard } from '../Common/KPICard';
import { MetricToggle } from '../Common/MetricToggle';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format } from 'date-fns';

interface HomeScreenProps {
  herdOverview: HerdOverview;
  selectedMetric: MetricType;
  onMetricChange: (metric: MetricType) => void;
  onNavigate: (section: string) => void;
}

export function HomeScreen({ herdOverview, selectedMetric, onMetricChange, onNavigate }: HomeScreenProps) {
  const { herd, metrics, trends, top_actives, class_breakdown } = herdOverview;

  const formatMetricValue = (value: number, metric: MetricType) => {
    switch (metric) {
      case 'mg_per_pcu':
        return value.toFixed(3);
      case 'dddvet':
      case 'dcdvet':
        return value.toFixed(1);
      default:
        return value.toString();
    }
  };

  const getMetricLabel = (metric: MetricType) => {
    switch (metric) {
      case 'mg_per_pcu':
        return 'mg/PCU';
      case 'dddvet':
        return 'DDDvet';
      case 'dcdvet':
        return 'DCDvet';
      default:
        return metric;
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{herd.farm_name}</h1>
            <div className="flex items-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span className="font-medium">{herd.adult_count} dairy cows</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Last updated: {format(new Date(), 'MMM dd, yyyy')}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('amu-calculator')}
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <Calculator className="w-5 h-5 mr-2" />
              New AMU Session
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Dairy Cows"
          value={herd.adult_count.toLocaleString()}
          icon={Users}
          subtitle="Adult animals"
        />
        
        <KPICard
          title="AMU (12 months)"
          value={formatMetricValue(metrics.mg_per_pcu, 'mg_per_pcu')}
          subtitle="mg per PCU"
          trend={{ direction: 'down', value: '12%' }}
        />
        
        <KPICard
          title="DDDvet Total"
          value={formatMetricValue(metrics.dddvet, 'dddvet')}
          subtitle="Last 12 months"
          trend={{ direction: 'up', value: '8%' }}
        />
        
        <KPICard
          title="HP-CIA Usage"
          value={`${metrics.hp_cia_share.toFixed(1)}%`}
          subtitle="of total mg"
          icon={AlertTriangle}
          trend={{ direction: 'down', value: '5%' }}
          isHighPriority={metrics.hp_cia_share > 10}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">12-Month Trend</h3>
              <p className="text-sm text-gray-500">Antimicrobial usage over time</p>
            </div>
            <MetricToggle 
              selectedMetric={selectedMetric}
              onMetricChange={onMetricChange}
            />
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => format(new Date(value), 'MMM')}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number) => [
                    formatMetricValue(value, selectedMetric),
                    getMetricLabel(selectedMetric)
                  ]}
                  labelFormatter={(label) => format(new Date(label), 'MMMM yyyy')}
                />
                <Line 
                  type="monotone" 
                  dataKey={selectedMetric}
                  stroke="#16A34A" 
                  strokeWidth={3}
                  dot={{ fill: '#16A34A', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#16A34A', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Class Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Antimicrobial Classes</h3>
            <p className="text-sm text-gray-500">Current period breakdown</p>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={class_breakdown} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="class_name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number) => [`${value.toLocaleString()} mg`, 'Total']}
                />
                <Bar 
                  dataKey="total_mg" 
                  fill="#2563EB" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Actives and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Actives */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Active Ingredients</h3>
          <div className="space-y-4">
            {top_actives.map((active, index) => (
              <div key={active.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-800">{index + 1}</span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{active.name}</span>
                      {active.is_hp_cia && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          HP-CIA
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{active.share_percent.toFixed(1)}% of total</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{active.total_mg.toLocaleString()} mg</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => onNavigate('amu-calculator')}
              className="w-full flex items-center justify-between p-4 text-left bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Calculator className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">New AMU Session</span>
              </div>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <FileUp className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Import from Excel</span>
              </div>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Download className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Download Template</span>
              </div>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <History className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">View Past Sessions</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}