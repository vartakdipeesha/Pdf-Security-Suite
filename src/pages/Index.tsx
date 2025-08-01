import React, { useState } from 'react';
import { Key, Activity, Users, Lock } from 'lucide-react';
import Header from '@/components/Header';
import EncryptTab from '@/components/EncryptTab';
import CrackTab from '@/components/CrackTab';
import DashboardTab from '@/components/DashboardTab';
import RoleTab from '@/components/RoleTab';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState('Admin');

  // Add state for file and password as required by EncryptTab and CrackTab
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'encrypt', label: 'Encrypt', icon: Lock },
    { id: 'crack', label: 'Crack', icon: Key },
    { id: 'role', label: 'Role', icon: Users },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'encrypt':
        return (
          <EncryptTab
            currentRole={currentRole}
            selectedFile={file}
            setSelectedFile={setFile}
            password={password}
            setPassword={setPassword}
          />
        );
      case 'crack':
        return (
          <CrackTab
            currentRole={currentRole}
            selectedFile={file}
            setSelectedFile={setFile}
            previousPassword={password}
          />
        );
      case 'role':
        return (
          <RoleTab
            currentRole={currentRole}
            setCurrentRole={setCurrentRole}
          />
        );
      default:
        return <DashboardTab currentRole={currentRole} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header currentRole={currentRole} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-2 shadow-2xl border border-slate-700/50">
            <div className="flex space-x-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </div>

      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>
    </div>
  );
};

export default Index;
