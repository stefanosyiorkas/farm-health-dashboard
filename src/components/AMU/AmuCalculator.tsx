import React from 'react';
import { Info } from 'lucide-react';
import { AmuEntry, AmuMetrics, MetricType } from '../../types';
import { KPICard } from '../Common/KPICard';
import { MetricToggle } from '../Common/MetricToggle';
import { AmuDataGrid } from './AmuDataGrid';
import { AmuCharts } from './AmuCharts';

import { Medication } from '../../types';

interface AmuCalculatorProps {
  entries: AmuEntry[];
  metrics: AmuMetrics;
  selectedMetric: MetricType;
  medications: Medication[]; // This is a placeholder
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
  onDeleteEntry,
  medications // This is a placeholder
}: AmuCalculatorProps) {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Υπολογιστής Χρήσης Αντιμικροβιακών</h1>
            <p className="text-gray-600 max-w-2xl">
              Υπολογίστε τους δείκτες mg/PCU, DDDvet και DCDvet για τις αντιμικροβιακές σας θεραπείες & Παρακολουθήστε τη χρήση των Αντιβιοτικών Κρίσιμης Σημασίας Υψίστης Προτεραιότητας (HP-CIA).
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Info className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900">Τρέχουσα Συνεδρία</h2>
        <p className="text-sm text-gray-500 mt-1">Προσθέστε θεραπείες και δείτε τους υπολογισμένους δείκτες</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="mg per PCU"
          value={metrics.mg_per_pcu.toFixed(3)}
          subtitle="Χιλιοστόγραμμα ανά Μονάδα Διόρθωσης Πληθυσμού"
        />
        
        <KPICard
          title="DDDvet"
          value={metrics.dddvet.toFixed(1)}
          subtitle="Καθορισμένη Ημερήσια Δόση για ζώα"
        />
        
        <KPICard
          title="DCDvet"
          value={metrics.dcdvet.toFixed(1)}
          subtitle="Καθορισμένη Δόση Θεραπευτικής Αγωγής για ζώα"
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
        medications={medications}
        onAddEntry={onAddEntry}
        onUpdateEntry={onUpdateEntry}
        onDeleteEntry={onDeleteEntry}
      />

      {/* Charts */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Ανάλυση & Οπτικοποίηση</h3>
            <p className="text-sm text-gray-500 mt-1">Οπτική ανάλυση των προτύπων χρήσης αντιμικροβιακών</p>
          </div>
          <MetricToggle 
            selectedMetric={selectedMetric}
            onMetricChange={onMetricChange}
          />
        </div>
        <AmuCharts entries={entries} selectedMetric={selectedMetric} />
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-4">Οδηγίες</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <h5 className="font-semibold text-blue-800 mb-2">1. Προσθέστε Θεραπείες</h5>
            <p className="text-blue-700">
              Εισαγάγετε αντιμικροβιακές θεραπείες χρησιμοποιώντας το κουμπί "Προσθήκη Εγγραφής" 
              ή πραγματοποιήστε εισαγωγή από Excel. 
              Συμπεριλάβετε το όνομα προϊόντος, τη δραστική ουσία, τη διαδρομή χορήγησης και τις πληροφορίες δοσολογίας.
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-blue-800 mb-2">2. Ελέγξτε τους Υπολογισμούς</h5>
            <p className="text-blue-700">
              Οι δείκτες υπολογίζονται αυτόματα με βάση το μέγεθος του κοπαδιού σας και τα δεδομένα θεραπείας. 
              Εναλλάξτε μεταξύ προβολών mg/PCU, DDDvet και DCDvet χρησιμοποιώντας το διακόπτη.
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-blue-800 mb-2">3. Παρακολουθήστε τα HP-CIA</h5>
            <p className="text-blue-700">
              Τα Αντιβιοτικά Κρίσιμης Σημασίας Υψίστης Προτεραιότητας επισημαίνονται με κόκκινο χρώμα. 
              Στόχος είναι η ελαχιστοποίηση της χρήσης HP-CIA για υπεύθυνη διαχείριση των αντιμικροβιακών.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
