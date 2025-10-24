import { Screen } from '../types';
import { Home, User, Wrench, Shield, List, Chrome } from 'lucide-react';

interface NavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export function Navigation({ currentScreen, onNavigate }: NavigationProps) {
  const navItems = [
    { screen: 'dashboard' as Screen, label: 'Dashboard', icon: Home },
    { screen: 'profile' as Screen, label: 'Profile', icon: User },
    { screen: 'application-builder' as Screen, label: 'Application Builder', icon: Wrench },
    { screen: 'privacy' as Screen, label: 'Privacy', icon: Shield },
    { screen: 'tracker' as Screen, label: 'Tracker', icon: List },
    { screen: 'extension' as Screen, label: 'Extension', icon: Chrome },
  ];

  return (
    <nav className="border-b border-border bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
              <span className="text-white">M</span>
            </div>
            <span className="font-semibold">ModularApply</span>
          </div>
          
          <div className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.screen}
                  onClick={() => onNavigate(item.screen)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    currentScreen === item.screen
                      ? 'bg-[#2563EB] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
