import React, { useState } from 'react';
import { Icons } from './constants';
import { TabType } from './types';
import { ProfileView } from './components/features/ProfileView';
import { GrowthView } from './components/features/GrowthView';
import { FoodView } from './components/features/FoodView';
import { HealthView } from './components/features/HealthView';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileView />;
      case 'growth': return <GrowthView />;
      case 'food': return <FoodView />;
      case 'health': return <HealthView />;
      default: return <ProfileView />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neko-cream to-white max-w-2xl mx-auto shadow-2xl relative">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-neko-cream">
         <div className="p-4 text-center">
            <h1 className="text-2xl font-black text-neko-orange flex items-center justify-center gap-2">
               <Icons.Paw className="w-6 h-6" /> 猫咪管家
            </h1>
         </div>
         {/* Navigation Tabs */}
         <nav className="flex justify-around px-2 pb-2">
           <TabButton 
             isActive={activeTab === 'profile'} 
             onClick={() => setActiveTab('profile')} 
             label="档案"
             icon={<Icons.Profile />}
           />
           <TabButton 
             isActive={activeTab === 'growth'} 
             onClick={() => setActiveTab('growth')} 
             label="成长"
             icon={<Icons.Growth />}
           />
           <TabButton 
             isActive={activeTab === 'food'} 
             onClick={() => setActiveTab('food')} 
             label="干饭"
             icon={<Icons.Food />}
           />
           <TabButton 
             isActive={activeTab === 'health'} 
             onClick={() => setActiveTab('health')} 
             label="健康"
             icon={<Icons.Health />}
           />
         </nav>
      </header>

      {/* Main Content */}
      <main className="p-4 min-h-[80vh]">
        {renderContent()}
      </main>

      {/* Footer Decoration */}
      <footer className="py-6 text-center text-neko-pink/50 text-xs">
         <p>Made with Love for 🐱</p>
      </footer>
    </div>
  );
};

const TabButton: React.FC<{ isActive: boolean; onClick: () => void; label: string; icon: React.ReactNode }> = ({ isActive, onClick, label, icon }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ${
      isActive 
        ? 'bg-neko-orange text-white scale-105 shadow-md' 
        : 'text-gray-400 hover:bg-neko-cream hover:text-neko-orange'
    }`}
  >
    <div className={`${isActive ? 'scale-110' : ''} transition-transform`}>{icon}</div>
    <span className="text-xs font-bold">{label}</span>
  </button>
);

export default App;