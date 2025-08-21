import React from 'react';
import { Bell, Settings, User, ChevronDown } from 'lucide-react';

interface HeaderProps {
  currentFarm: string;
}

export function Header({ currentFarm }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
            <span className="text-sm font-medium text-gray-700">Farm:</span>
            <button className="flex items-center space-x-1 text-sm font-semibold text-green-700 hover:text-green-800 transition-colors">
              <span>{currentFarm}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
            <Settings className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2 pl-4 border-l border-gray-200">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-green-600" />
            </div>
            <button className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              <span>Dr. Smith</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}