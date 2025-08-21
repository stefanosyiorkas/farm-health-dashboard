import React, { useState } from 'react';
import { Plus, Trash2, Edit3, AlertTriangle, FileDown, FileUp } from 'lucide-react';
import { AmuEntry } from '../../types';
import { clsx } from 'clsx';

interface AmuDataGridProps {
  entries: AmuEntry[];
  onAddEntry: (entry: Omit<AmuEntry, 'id'>) => void;
  onUpdateEntry: (id: string, updates: Partial<AmuEntry>) => void;
  onDeleteEntry: (id: string) => void;
}

const defaultEntry: Omit<AmuEntry, 'id'> = {
  product_name: '',
  active_name: '',
  antimicrobial_class: '',
  is_hp_cia: false,
  species: 'dairy_cattle',
  age_class: 'adult',
  route: 'injectable',
  pack_concentration_mg_per_unit: 0,
  units_administered: 0,
  duration_days: 1,
  animal_weight_kg: 425,
  start_date: '',
  end_date: '',
  notes: ''
};

export function AmuDataGrid({ entries, onAddEntry, onUpdateEntry, onDeleteEntry }: AmuDataGridProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState<Omit<AmuEntry, 'id'>>(defaultEntry);

  const handleAddEntry = () => {
    if (newEntry.product_name && newEntry.active_name && newEntry.pack_concentration_mg_per_unit > 0) {
      onAddEntry(newEntry);
      setNewEntry(defaultEntry);
      setShowAddForm(false);
    }
  };

  const handleUpdateEntry = (id: string, field: keyof AmuEntry, value: any) => {
    onUpdateEntry(id, { [field]: value });
  };

  const downloadTemplate = () => {
    const csvContent = [
      'product_name,active_name,antimicrobial_class,is_hp_cia,species,age_class,route,pack_concentration_mg_per_unit,units_administered,duration_days,animal_weight_kg,start_date,end_date,notes',
      'Baytril 2.5%,Enrofloxacin,Fluoroquinolones,true,dairy_cattle,adult,injectable,25,180,1,425,2024-11-01,2024-11-01,Respiratory infection treatment'
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'amu_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Treatment Entries</h3>
            <p className="text-sm text-gray-500 mt-1">Add antimicrobial treatments for calculation</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={downloadTemplate}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Template
            </button>
            
            <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <FileUp className="w-4 h-4 mr-2" />
              Import Excel
            </button>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Entry
            </button>
          </div>
        </div>
      </div>

      {/* Add Entry Form */}
      {showAddForm && (
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h4 className="text-md font-medium text-gray-900 mb-4">Add New Treatment</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                value={newEntry.product_name}
                onChange={(e) => setNewEntry({ ...newEntry, product_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="e.g. Baytril 2.5%"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Active Ingredient *</label>
              <input
                type="text"
                value={newEntry.active_name}
                onChange={(e) => setNewEntry({ ...newEntry, active_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="e.g. Enrofloxacin"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
              <select
                value={newEntry.route}
                onChange={(e) => setNewEntry({ ...newEntry, route: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              >
                <option value="injectable">Injectable</option>
                <option value="intramammary">Intramammary</option>
                <option value="oral">Oral</option>
                <option value="topical">Topical</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Concentration (mg/unit) *</label>
              <input
                type="number"
                value={newEntry.pack_concentration_mg_per_unit || ''}
                onChange={(e) => setNewEntry({ ...newEntry, pack_concentration_mg_per_unit: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="25"
                min="0"
                step="0.1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Units Administered *</label>
              <input
                type="number"
                value={newEntry.units_administered || ''}
                onChange={(e) => setNewEntry({ ...newEntry, units_administered: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="180"
                min="0"
                step="0.1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
              <input
                type="number"
                value={newEntry.duration_days || ''}
                onChange={(e) => setNewEntry({ ...newEntry, duration_days: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="1"
                min="1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Animal Weight (kg)</label>
              <input
                type="number"
                value={newEntry.animal_weight_kg || ''}
                onChange={(e) => setNewEntry({ ...newEntry, animal_weight_kg: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="425"
                min="0"
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-7">
              <input
                type="checkbox"
                checked={newEntry.is_hp_cia}
                onChange={(e) => setNewEntry({ ...newEntry, is_hp_cia: e.target.checked })}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <label className="text-sm font-medium text-gray-700">HP-CIA</label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddEntry}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              Add Entry
            </button>
          </div>
        </div>
      )}

      {/* Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conc. (mg)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total mg</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries.map((entry) => {
              const totalMg = entry.pack_concentration_mg_per_unit * entry.units_administered;
              
              return (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">{entry.product_name}</span>
                      {entry.is_hp_cia && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          HP-CIA
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{entry.active_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{entry.antimicrobial_class}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 capitalize">{entry.route}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{entry.pack_concentration_mg_per_unit}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{entry.units_administered}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{entry.duration_days}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {totalMg.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingId(entry.id)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteEntry(entry.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {entries.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">No treatments added yet</h3>
            <p className="text-sm text-gray-500 mb-4">Add your first antimicrobial treatment to begin calculations</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Entry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}