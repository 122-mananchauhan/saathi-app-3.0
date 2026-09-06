import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { LandingPage } from './components/auth/LandingPage';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { FPODashboard } from './components/fpo/FPODashboard';
import { BuyerDashboard } from './components/buyer/BuyerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CSVImportModal } from './components/common/CSVImportModal';
import { GrievanceModal } from './components/disputes/GrievanceModal';

const MainContent: React.FC = () => {
  const { user, role } = useAuth();
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);

  if (!user || !role) {
    return <LandingPage onLoginSuccess={() => {}} />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-900 font-sans">
      <Header
        onOpenCSVModal={() => setShowCSVModal(true)}
        onOpenGrievanceModal={() => setShowGrievanceModal(true)}
      />

      <main className="flex-1">
        {role === 'farmer' && <FarmerDashboard />}
        {role === 'fpo' && <FPODashboard />}
        {role === 'buyer' && <BuyerDashboard />}
        {role === 'admin' && <AdminDashboard />}
      </main>

      <CSVImportModal
        isOpen={showCSVModal}
        onClose={() => setShowCSVModal(false)}
        onSuccess={() => {}}
      />

      <GrievanceModal
        isOpen={showGrievanceModal}
        onClose={() => setShowGrievanceModal(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

export default App;
