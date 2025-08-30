import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Edit3, Check, X, Pill, FileDown, Search, Filter } from 'lucide-react';
import { Medication } from '../../types';
import { clsx } from 'clsx';

// --- MOCK DATA (placeholder) ---
const MOCK_MEDICATIONS: Medication[] = [
  { id: 1, product_name: 'Baytril 2.5%', active_name: 'Enrofloxacin', antimicrobial_class: 'Fluoroquinolones', is_hp_cia: true, pack_concentration_mg_per_unit: 25, default_route: 'injectable' },
  { id: 2, product_name: 'Amoxinsol', active_name: 'Amoxicillin', antimicrobial_class: 'Penicillins', is_hp_cia: false, pack_concentration_mg_per_unit: 200, default_route: 'intramammary' },
  { id: 3, product_name: 'Excenel RTU', active_name: 'Ceftiofur', antimicrobial_class: 'Cephalosporins', is_hp_cia: true, pack_concentration_mg_per_unit: 50, default_route: 'injectable' },
  { id: 4, product_name: 'Pen & Strep', active_name: 'Penicillin & Streptomycin', antimicrobial_class: 'Penicillins', is_hp_cia: false, pack_concentration_mg_per_unit: 250, default_route: 'injectable' },
];

export function MedicationsScreen() {
  // Note: This state management is temporary. It will be replaced by props from useApiData.ts
  const [medications, setMedications] = useState<Medication[]>(MOCK_MEDICATIONS);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<Partial<Medication> | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedication, setNewMedication] = useState<Omit<Medication, 'id'>>({
    product_name: '', active_name: '', antimicrobial_class: '', is_hp_cia: false, pack_concentration_mg_per_unit: 0, default_route: 'injectable'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');

  const uniqueClasses = useMemo(() => [...new Set(medications.map(m => m.antimicrobial_class).filter(Boolean))], [medications]);
  const uniqueActives = useMemo(() => [...new Set(medications.map(m => m.active_name).filter(Boolean))], [medications]);

  const filteredMedications = useMemo(() => {
    return medications
      .filter(med => {
        if (classFilter === 'all') return true;
        return med.antimicrobial_class === classFilter;
      })
      .filter(med => {
        if (!searchTerm) return true;
        const lowerSearch = searchTerm.toLowerCase();
        return (
          med.product_name.toLowerCase().includes(lowerSearch) ||
          med.active_name.toLowerCase().includes(lowerSearch)
        );
      });
  }, [medications, searchTerm, classFilter]);

  const handleStartEditing = (med: Medication) => {
    setEditingId(med.id);
    setEditingData({ ...med });
  };
  const handleCancelEditing = () => {
    setEditingId(null);
    setEditingData(null);
  };
  const handleSaveEditing = () => {
    // Placeholder for API call
    if (editingId && editingData) {
      setMedications(meds => meds.map(m => m.id === editingId ? { ...m, ...editingData } as Medication : m));
    }
    handleCancelEditing();
  };
  const handleAddMedication = () => {
    // Placeholder for API call
    setMedications(meds => [...meds, { id: Date.now(), ...newMedication }]);
    setShowAddForm(false);
    setNewMedication({ product_name: '', active_name: '', antimicrobial_class: '', is_hp_cia: false, pack_concentration_mg_per_unit: 0, default_route: 'injectable' });
  };
  const handleDeleteMedication = (id: number) => {
    // Placeholder for API call
    setMedications(meds => meds.filter(m => m.id !== id));
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Διαχείριση Φαρμάκων</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Λίστα Φαρμάκων</h3>
            <p className="text-sm text-gray-500 mt-1">Προσθήκη, επεξεργασία ή διαγραφή φαρμάκων από τον κατάλογό σας.</p>
          </div>
          <button onClick={() => setShowAddForm(true)} className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Νέο Φάρμακο
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Αναζήτηση φαρμάκου..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">Όλες οι Κατηγορίες</option>
              {uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {showAddForm && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h4 className="text-md font-medium text-gray-900 mb-4">Προσθήκη Νέου Φαρμάκου</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <datalist id="active-ingredients">{uniqueActives.map(a => <option key={a} value={a} />)}</datalist>
              <datalist id="antimicrobial-classes">{uniqueClasses.map(c => <option key={c} value={c} />)}</datalist>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Όνομα Προϊόντος *</label>
                <input value={newMedication.product_name} onChange={(e) => setNewMedication({...newMedication, product_name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Δραστικό Συστατικό *</label>
                <input value={newMedication.active_name} onChange={(e) => setNewMedication({...newMedication, active_name: e.target.value})} list="active-ingredients" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Κατηγορία</label>
                <input value={newMedication.antimicrobial_class} onChange={(e) => setNewMedication({...newMedication, antimicrobial_class: e.target.value})} list="antimicrobial-classes" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Συγκ. (mg/μονάδα)</label>
                <input type="number" value={newMedication.pack_concentration_mg_per_unit || ''} onChange={(e) => setNewMedication({...newMedication, pack_concentration_mg_per_unit: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Προεπιλεγμένη Οδός</label>
                <select value={newMedication.default_route} onChange={(e) => setNewMedication({...newMedication, default_route: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="injectable">Ενέσιμη</option>
                  <option value="intramammary">Ενδομαστική</option>
                  <option value="oral">Από το στόμα</option>
                  <option value="topical">Τοπική</option>
                </select>
              </div>
              <div className="flex items-center space-x-2 pt-7">
                <input type="checkbox" checked={newMedication.is_hp_cia} onChange={(e) => setNewMedication({...newMedication, is_hp_cia: e.target.checked})} className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                <label className="text-sm font-medium text-gray-700">HP-CIA</label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button onClick={() => setShowAddForm(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Άκυρο</button>
              <button onClick={handleAddMedication} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">Προσθήκη</button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <datalist id="active-ingredients-edit">{uniqueActives.map(a => <option key={a} value={a} />)}</datalist>
          <datalist id="antimicrobial-classes-edit">{uniqueClasses.map(c => <option key={c} value={c} />)}</datalist>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Προϊόν</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Δραστικό</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Κατηγορία</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Οδός</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Συγκ. (mg)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ενέργειες</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMedications.map(med => {
                const isEditing = editingId === med.id;
                const data = isEditing ? editingData : med;
                if (!data) return null;
                return (
                  <tr key={med.id} className={clsx(isEditing && "bg-blue-50")}>
                    <td className="px-6 py-4 align-top">
                      {isEditing ? 
                        <div>
                           <input value={data.product_name || ''} onChange={(e) => setEditingData({...data, product_name: e.target.value})} className="w-full px-2 py-1 border rounded"/>
                           <div className="flex items-center mt-2">
                            <input type="checkbox" id={`is_hp_cia-edit-${med.id}`} checked={data.is_hp_cia} onChange={(e) => setEditingData({...data, is_hp_cia: e.target.checked})} className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                            <label htmlFor={`is_hp_cia-edit-${med.id}`} className="ml-2 text-xs font-medium text-gray-700">HP-CIA</label>
                          </div>
                        </div>
                        : 
                        <div>
                          <span className="font-medium">{data.product_name}</span>
                          {data.is_hp_cia && <span className="ml-2 text-xs font-medium bg-red-100 text-red-800 px-2 py-0.5 rounded">HP-CIA</span>}
                        </div>
                      }
                    </td>
                    <td className="px-6 py-4 align-top">{isEditing ? <input value={data.active_name || ''} onChange={(e) => setEditingData({...data, active_name: e.target.value})} list="active-ingredients-edit" className="w-full px-2 py-1 border rounded"/> : data.active_name}</td>
                    <td className="px-6 py-4 align-top">{isEditing ? <input value={data.antimicrobial_class || ''} onChange={(e) => setEditingData({...data, antimicrobial_class: e.target.value})} list="antimicrobial-classes-edit" className="w-full px-2 py-1 border rounded"/> : data.antimicrobial_class}</td>
                    <td className="px-6 py-4 align-top">{isEditing ? 
                      <select value={data.default_route} onChange={(e) => setEditingData({...data, default_route: e.target.value})} className="w-full px-2 py-1 border rounded">
                        <option value="injectable">Ενέσιμη</option><option value="intramammary">Ενδομαστική</option><option value="oral">Από το στόμα</option><option value="topical">Τοπική</option>
                      </select>
                      : <span className="capitalize">{data.default_route}</span>}
                    </td>
                    <td className="px-6 py-4 align-top">{isEditing ? <input type="number" value={data.pack_concentration_mg_per_unit || ''} onChange={(e) => setEditingData({...data, pack_concentration_mg_per_unit: Number(e.target.value)})} className="w-24 px-2 py-1 border rounded"/> : data.pack_concentration_mg_per_unit}</td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center space-x-2">
                        {isEditing ? (
                          <>
                            <button onClick={handleSaveEditing} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check className="w-4 h-4"/></button>
                            <button onClick={handleCancelEditing} className="p-1 text-gray-500 hover:bg-gray-100 rounded"><X className="w-4 h-4"/></button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleStartEditing(med)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit3 className="w-4 h-4"/></button>
                            <button onClick={() => handleDeleteMedication(med.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
