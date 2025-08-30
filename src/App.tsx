import React, { useState } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { HomeScreen } from './components/Home/HomeScreen';
import { AmuCalculator } from './components/AMU/AmuCalculator';
import { MedicationsScreen } from './components/Medications/MedicationsScreen';
import { ComingSoon } from './components/Common/ComingSoon';
import { useApiData } from './hooks/useApiData';
import { Baby, Cog as Cow, Sheet as Sheep, TestTube, Download, Loader2, AlertTriangle } from 'lucide-react';
import { Medication } from './types';

// --- MOCK DATA (placeholder until API hook is updated) ---
const MOCK_MEDICATIONS: Medication[] = [
  { id: 1, product_name: 'Baytril 2.5%', active_name: 'Enrofloxacin', antimicrobial_class: 'Fluoroquinolones', is_hp_cia: true, pack_concentration_mg_per_unit: 25, default_route: 'injectable' },
  { id: 2, product_name: 'Amoxinsol', active_name: 'Amoxicillin', antimicrobial_class: 'Penicillins', is_hp_cia: false, pack_concentration_mg_per_unit: 200, default_route: 'intramammary' },
  { id: 3, product_name: 'Excenel RTU', active_name: 'Ceftiofur', antimicrobial_class: 'Cephalosporins', is_hp_cia: true, pack_concentration_mg_per_unit: 50, default_route: 'injectable' },
];

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const {
    herdOverview,
    amuEntries,
    loading,
    error,
    selectedMetric,
    setSelectedMetric,
    addEntry,
    updateEntry,
    deleteEntry
  } = useApiData();

  const renderMainContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
        </div>
      );
    }

    if (error || !herdOverview) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-red-600 bg-red-50 rounded-lg p-8">
          <AlertTriangle className="w-16 h-16 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error Loading Data</h2>
          <p className="text-red-500">{error?.message || "Could not load farm data. Please check the connection."}</p>
        </div>
      );
    }
    
    switch (activeSection) {
      case 'home':
        return (
          <HomeScreen
            herdOverview={herdOverview}
            selectedMetric={selectedMetric}
            onMetricChange={setSelectedMetric}
            onNavigate={setActiveSection}
          />
        );
      
      case 'amu-calculator':
        return (
          <AmuCalculator
            entries={amuEntries}
            metrics={herdOverview.metrics}
            selectedMetric={selectedMetric}
            medications={MOCK_MEDICATIONS}
            onMetricChange={setSelectedMetric}
            onAddEntry={addEntry}
            onUpdateEntry={updateEntry}
            onDeleteEntry={deleteEntry}
          />
        );
      
      case 'medications':
        return <MedicationsScreen />;

      case 'calf-health':
        return (
          <ComingSoon
            title="Calf Health Tools"
            description="Comprehensive tools for managing calf health and development"
            icon={Baby}
            features={[
              'Milk replacer calculator',
              'Passive transfer checker',
              'Growth tracking and monitoring',
              'Vaccination schedule management',
              'Health scoring systems'
            ]}
          />
        );
      
      case 'cow-health':
        return (
          <ComingSoon
            title="Cow Health Management"
            description="Advanced dairy cow health monitoring and management tools"
            icon={Cow}
            features={[
              'Mobility scoring uploader',
              'Body condition scoring',
              'Reproductive health tracking',
              'Mastitis management tools',
              'Lameness monitoring'
            ]}
          />
        );
      
      case 'sheep-health':
        return (
          <ComingSoon
            title="Sheep Health Tools"
            description="Specialized health management for sheep and lamb operations"
            icon={Sheep}
            features={[
              'Flock health monitoring',
              'Parasite management',
              'Wool quality assessment',
              'Breeding program support',
              'Nutritional analysis'
            ]}
          />
        );
      
      case 'diagnostics':
        return (
          <ComingSoon
            title="Diagnostic Tools"
            description="Statistical and analytical tools for farm diagnostics"
            icon={TestTube}
            features={[
              'Sample size calculators',
              'Test sensitivity and specificity analysis',
              'Disease prevalence estimation',
              'Diagnostic test interpretation',
              'Statistical significance testing'
            ]}
          />
        );
      
      case 'downloads':
        return (
          <ComingSoon
            title="Downloads & Templates"
            description="Access templates, reports, and downloadable resources"
            icon={Download}
            features={[
              'Excel templates for data import',
              'PDF report generation',
              'Custom form templates',
              'Regulatory compliance documents',
              'Best practice guidelines'
            ]}
          />
        );
      
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Section not found</h2>
            <p className="text-gray-600 mt-2">The requested section could not be loaded.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentFarm={herdOverview?.herd.farm_name || '...'} />
        
        <main className="flex-1 overflow-y-auto p-8">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
