import React from 'react';
import { Home, Calculator, Baby, Cog as Cow, Sheet as Sheep, TestTube, Download, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigationGroups = [
  {
    name: 'Overview',
    items: [
      { id: 'home', name: 'Home', icon: Home, description: 'Farm dashboard and KPIs' }
    ]
  },
  {
    name: 'Antimicrobial Use',
    items: [
      { id: 'amu-calculator', name: 'AMU Calculator', icon: Calculator, description: 'mg/PCU, DDDvet, DCDvet calculations' }
    ]
  },
  {
    name: 'Animal Health',
    items: [
      { id: 'calf-health', name: 'Calf Health', icon: Baby, description: 'Calf-specific tools and calculators' },
      { id: 'cow-health', name: 'Cow Health', icon: Cow, description: 'Dairy cow health management' },
      { id: 'sheep-health', name: 'Sheep Health', icon: Sheep, description: 'Sheep and lamb health tools' }
    ]
  },
  {
    name: 'Support Tools',
    items: [
      { id: 'diagnostics', name: 'Diagnostics', icon: TestTube, description: 'Sample size and test characteristics' },
      { id: 'downloads', name: 'Downloads', icon: Download, description: 'Templates and reports' }
    ]
  }
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <div className="flex flex-col w-72 bg-white border-r border-gray-200 h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
            <Cow className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">FarmHealth</h1>
            <p className="text-sm text-gray-500">Decision Support</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {navigationGroups.map((group) => (
          <div key={group.name}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {group.name}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onSectionChange(item.id)}
                      className={clsx(
                        "w-full flex items-center p-3 rounded-lg text-left transition-all duration-200 group",
                        isActive 
                          ? "bg-green-50 text-green-700 border border-green-200" 
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <Icon className={clsx(
                        "w-5 h-5 mr-3 transition-colors",
                        isActive ? "text-green-600" : "text-gray-400 group-hover:text-gray-600"
                      )} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {item.description}
                        </div>
                      </div>
                      {isActive && (
                        <ChevronRight className="w-4 h-4 text-green-600" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}