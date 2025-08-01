// ---------- TabsPage.tsx ----------
import React, { useState } from 'react';
import EncryptTab from './EncryptTab';
import CrackTab from './CrackTab';
import DashboardTab from './DashboardTab';
import RoleTab from './RoleTab';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TabsPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [currentRole, setCurrentRole] = useState('admin');
  const [defaultTab, setDefaultTab] = useState('encrypt');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      <Header currentRole={currentRole} />

      <div className="container mx-auto px-6 py-20">
        <Tabs value={defaultTab} onValueChange={setDefaultTab} className="w-full max-w-4xl mx-auto">
        <TabsList className="flex justify-center bg-slate-800/50 backdrop-blur-lg rounded-2xl p-2 shadow-2xl border border-slate-700/50 mb-9">
  <TabsTrigger value="dashboard" className="text-white text-lg data-[state=active]:bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl px-6 py-3">
    Dashboard
  </TabsTrigger>
  <TabsTrigger value="encrypt" className="text-white text-lg data-[state=active]:bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl px-6 py-3">
    Encrypt
  </TabsTrigger>
  <TabsTrigger value="crack" className="text-white text-lg data-[state=active]:bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl px-6 py-3">
    Crack
  </TabsTrigger>
  <TabsTrigger value="role" className="text-white text-lg data-[state=active]:bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl px-6 py-3">
    Role
  </TabsTrigger>
</TabsList>


          <TabsContent value="encrypt">
            <EncryptTab
              currentRole={currentRole}
              selectedFile={file}
              setSelectedFile={setFile}
              password={password}
              setPassword={setPassword}
            />
          </TabsContent>

          <TabsContent value="crack">
            <CrackTab
              currentRole={currentRole}
              selectedFile={file}
              setSelectedFile={setFile}
              previousPassword={password} 
            />
          </TabsContent>

          <TabsContent value="dashboard">
            <DashboardTab currentRole={currentRole} />
          </TabsContent>

          <TabsContent value="role">
            <RoleTab currentRole={currentRole} setCurrentRole={setCurrentRole} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Background Animation */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>
    </div>
  );
};

export default TabsPage;
