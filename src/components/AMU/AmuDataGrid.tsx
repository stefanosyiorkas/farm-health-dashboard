import React, { useState } from 'react';
import { Plus, Trash2, Edit3, AlertTriangle, FileDown, FileUp, Check, X } from 'lucide-react';
import { AmuEntry } from '../../types';
import { clsx } from 'clsx';

import { Medication } from '../../types';

interface AmuDataGridProps {
  entries: AmuEntry[];
  medications: Medication[];
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
  start_date: new Date().toISOString().split('T')[0],
  end_date: '',
  notes: ''
};

export function AmuDataGrid({ entries, medications, onAddEntry, onUpdateEntry, onDeleteEntry }: AmuDataGridProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<AmuEntry> | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState<Omit<AmuEntry, 'id'>>(defaultEntry);

  const handleStartEditing = (entry: AmuEntry) => {
    setEditingId(entry.id);
    setEditingData({ ...entry });
  };

  const handleCancelEditing = () => {
    setEditingId(null);
    setEditingData(null);
  };

  const handleSaveEditing = () => {
    if (editingId && editingData) {
      // Ensure numeric fields are numbers
      const dataToSave = {
        ...editingData,
        pack_concentration_mg_per_unit: Number(editingData.pack_concentration_mg_per_unit) || 0,
        units_administered: Number(editingData.units_administered) || 0,
        duration_days: Number(editingData.duration_days) || 0,
      };
      onUpdateEntry(editingId, dataToSave);
      handleCancelEditing();
    }
  };
  
  const handleEditingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingData) return;
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setEditingData({ ...editingData, [name]: checked });
    } else {
      setEditingData({ ...editingData, [name]: value });
    }
  };

  const handleAddEntry = () => {
    if (newEntry.product_name && newEntry.active_name && newEntry.pack_concentration_mg_per_unit > 0) {
      onAddEntry(newEntry);
      setNewEntry(defaultEntry);
      setShowAddForm(false);
    }
  };

  const handleMedicationSelect = (productName: string) => {
    const selectedMed = medications.find(m => m.product_name === productName);
    if (selectedMed) {
      setNewEntry({
        ...newEntry,
        product_name: selectedMed.product_name,
        active_name: selectedMed.active_name,
        antimicrobial_class: selectedMed.antimicrobial_class,
        is_hp_cia: selectedMed.is_hp_cia,
        pack_concentration_mg_per_unit: selectedMed.pack_concentration_mg_per_unit,
        route: selectedMed.default_route,
      });
    } else {
      setNewEntry({
        ...newEntry,
        product_name: '',
        active_name: '',
        antimicrobial_class: '',
        is_hp_cia: false,
      });
    }
  };

  const downloadTemplate = () => {
    const csvContent = [
      'product_name,active_name,antimicrobial_class,is_hp_cia,species,age_class,route,pack_concentration_mg_per_unit,units_administered,duration_days,animal_weight_kg,start_date,end_date,notes',
      'Baytril 2.5%,Enrofloxacin,Fluoroquinolones,true,dairy_cattle,adult,injectable,25,180,1,425,2024-11-01,2024-11-01,Θεραπεία αναπνευστικής λοίμωξης'
    ].join('\n');
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'amu_πρότυπο.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Καταχωρήσεις Θεραπειών</h3>
            <p className="text-sm text-gray-500 mt-1">Προσθέστε θεραπείες με αντιμικροβιακά για υπολογισμό</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={downloadTemplate}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Πρότυπο
            </button>
            
            <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <FileUp className="w-4 h-4 mr-2" />
              Εισαγωγή Excel
            </button>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Προσθήκη Καταχώρησης
            </button>
          </div>
        </div>
      </div>

      {/* Add Entry Form */}
      {showAddForm && (
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h4 className="text-md font-medium text-gray-900 mb-4">Προσθήκη Νέας Θεραπείας</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Όνομα Προϊόντος *</label>
              <select
                value={newEntry.product_name}
                onChange={(e) => handleMedicationSelect(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Επιλέξτε φάρμακο...</option>
                {medications.map(med => (
                  <option key={med.id} value={med.product_name}>{med.product_name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Δραστικό Συστατικό *</label>
              <input
                type="text"
                value={newEntry.active_name}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Οδός Χορήγησης</label>
              <select
                value={newEntry.route}
                onChange={(e) => setNewEntry({ ...newEntry, route: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              >
                <option value="injectable">Ενέσιμη</option>
                <option value="intramammary">Ενδομαστική</option>
                <option value="oral">Από το στόμα</option>
                <option value="topical">Τοπική</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Συγκέντρωση (mg/μονάδα) *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Χορηγούμενες Μονάδες *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Διάρκεια (ημέρες)</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Βάρος Ζώου (kg)</label>
              <input
                type="number"
                value={newEntry.animal_weight_kg || ''}
                onChange={(e) => setNewEntry({ ...newEntry, animal_weight_kg: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="425"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ημερομηνία Έναρξης</label>
              <input
                type="date"
                value={newEntry.start_date || ''}
                onChange={(e) => setNewEntry({ ...newEntry, start_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ημερομηνία Λήξης</label>
              <input
                type="date"
                value={newEntry.end_date || ''}
                onChange={(e) => setNewEntry({ ...newEntry, end_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
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
              Άκυρο
            </button>
            <button
              onClick={handleAddEntry}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              Προσθήκη Καταχώρησης
            </button>
          </div>
        </div>
      )}

      {/* Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Προϊόν</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Δραστικό</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Κατηγορία</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Οδός</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Συγκ. (mg)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Μονάδες</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Διάρκεια</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Σύνολο mg</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ενέργειες</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries.map((entry) => {
              const isEditing = editingId === entry.id;
              const data = isEditing ? editingData : entry;
              if (!data) return null;

              const totalMg = (data.pack_concentration_mg_per_unit || 0) * (data.units_administered || 0);
              
              return (
                <tr key={entry.id} className={clsx(isEditing ? "bg-blue-50" : "hover:bg-gray-50")}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing ? (
                      <div>
                        <input
                          type="text"
                          name="product_name"
                          value={data.product_name || ''}
                          onChange={handleEditingChange}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        />
                        <div className="flex items-center mt-2">
                          <input type="checkbox" name="is_hp_cia" id={`is_hp_cia-${entry.id}`} checked={data.is_hp_cia} onChange={handleEditingChange} className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                          <label htmlFor={`is_hp_cia-${entry.id}`} className="ml-2 text-xs font-medium text-gray-700">HP-CIA</label>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{entry.product_name}</span>
                        {entry.is_hp_cia && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            HP-CIA
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing ? <input type="text" name="active_name" value={data.active_name || ''} onChange={handleEditingChange} className="w-full px-2 py-1 border border-gray-300 rounded-md" /> : <span className="text-sm text-gray-900">{entry.active_name}</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing ? <input type="text" name="antimicrobial_class" value={data.antimicrobial_class || ''} onChange={handleEditingChange} className="w-full px-2 py-1 border border-gray-300 rounded-md" /> : <span className="text-sm text-gray-500">{entry.antimicrobial_class}</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing ? (
                      <select name="route" value={data.route} onChange={handleEditingChange} className="w-full px-2 py-1 border border-gray-300 rounded-md">
                        <option value="injectable">Ενέσιμη</option>
                        <option value="intramammary">Ενδομαστική</option>
                        <option value="oral">Από το στόμα</option>
                        <option value="topical">Τοπική</option>
                      </select>
                    ) : <span className="text-sm text-gray-500 capitalize">{entry.route}</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing ? <input type="number" name="pack_concentration_mg_per_unit" value={data.pack_concentration_mg_per_unit || ''} onChange={handleEditingChange} className="w-24 px-2 py-1 border border-gray-300 rounded-md" /> : <span className="text-sm text-gray-900">{entry.pack_concentration_mg_per_unit}</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing ? <input type="number" name="units_administered" value={data.units_administered || ''} onChange={handleEditingChange} className="w-24 px-2 py-1 border border-gray-300 rounded-md" /> : <span className="text-sm text-gray-900">{entry.units_administered}</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing ? <input type="number" name="duration_days" value={data.duration_days || ''} onChange={handleEditingChange} className="w-24 px-2 py-1 border border-gray-300 rounded-md" /> : <span className="text-sm text-gray-900">{entry.duration_days}</span>}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {totalMg.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {isEditing ? (
                        <>
                          <button onClick={handleSaveEditing} className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"><Check className="w-4 h-4" /></button>
                          <button onClick={handleCancelEditing} className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"><X className="w-4 h-4" /></button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleStartEditing(entry)} className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"><Edit3 className="w-4 h-4" /></button>
                          <button onClick={() => onDeleteEntry(entry.id)} className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                        </>
                      )}
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
            <h3 className="text-sm font-medium text-gray-900 mb-2">Δεν έχουν προστεθεί θεραπείες ακόμη</h3>
            <p className="text-sm text-gray-500 mb-4">Προσθέστε την πρώτη σας θεραπεία για να ξεκινήσουν οι υπολογισμοί</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Προσθήκη Πρώτης Καταχώρησης
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
