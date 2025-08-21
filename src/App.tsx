import React, { useState } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { HomeScreen } from './components/Home/HomeScreen';
import { AmuCalculator } from './components/AMU/AmuCalculator';
import { ComingSoon } from './components/Common/ComingSoon';
import { useMockData } from './hooks/useMockData';
import { Baby, Cog as Cow, Sheet as Sheep, TestTube, Download } from 'lucide-react';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const {
    herdOverview,
    amuEntries,
    calculatedMetrics,
    selectedMetric,
    setSelectedMetric,
    addEntry,
    updateEntry,
    deleteEntry
  } = useMockData();

  const renderMainContent = () => {
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
            metrics={calculatedMetrics}
            selectedMetric={selectedMetric}
            onMetricChange={setSelectedMetric}
            onAddEntry={addEntry}
            onUpdateEntry={updateEntry}
            onDeleteEntry={deleteEntry}
          />
        );
      
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
        <Header currentFarm={herdOverview.herd.farm_name} />
        
        <main className="flex-1 overflow-y-auto p-8">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}

export default App;