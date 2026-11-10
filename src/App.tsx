import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Header } from './components/Header.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { ParcellesView } from './components/ParcellesView.tsx';
import { HarvestsView } from './components/HarvestsView.tsx';
import { ConsultationsView } from './components/ConsultationsView.tsx';
import { MarketPricesView } from './components/MarketPricesView.tsx';
import { GuidesView } from './components/GuidesView.tsx';
import { NewParcelleModal } from './components/NewParcelleModal.tsx';
import { NewHarvestModal } from './components/NewHarvestModal.tsx';
import { NewConsultationModal } from './components/NewConsultationModal.tsx';
import { ProfileModal } from './components/ProfileModal.tsx';
import {
  api,
  Parcelle,
  Harvest,
  Consultation,
  MarketPrice,
  AgriculturalGuide,
  DashboardStats,
} from './lib/api.ts';
import {
  LayoutDashboard,
  Layers,
  Wheat,
  MessageSquareText,
  TrendingUp,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';

function AgriConseilApp() {
  const { user, token, loading: authLoading, signInWithGoogle } = useAuth();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'parcelles' | 'harvests' | 'consultations' | 'market' | 'guides'>('dashboard');

  // Application Data States
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [parcelles, setParcelles] = useState<Parcelle[]>([]);
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [guides, setGuides] = useState<AgriculturalGuide[]>([]);

  const [loadingData, setLoadingData] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modals
  const [newParcelleOpen, setNewParcelleOpen] = useState(false);
  const [newHarvestOpen, setNewHarvestOpen] = useState(false);
  const [newConsultationOpen, setNewConsultationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [preselectedParcelle, setPreselectedParcelle] = useState<Parcelle | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Load public data (Market prices & Guides)
  const loadPublicData = useCallback(async () => {
    try {
      const [pricesData, guidesData] = await Promise.all([
        api.getMarketPrices().catch(() => []),
        api.getGuides().catch(() => []),
      ]);
      setMarketPrices(pricesData);
      setGuides(guidesData);
    } catch (err) {
      console.error('Erreur chargement données publiques:', err);
    }
  }, []);

  // Load authenticated data (Parcelles, Harvests, Stats, User Consultations)
  const loadUserData = useCallback(async () => {
    if (!token) {
      setParcelles([]);
      setHarvests([]);
      setStats(null);
      // Load public community consultations
      const publicConsultations = await api.getConsultations(null).catch(() => []);
      setConsultations(publicConsultations);
      return;
    }

    try {
      setLoadingData(true);
      const [parcellesData, harvestsData, statsData, consultationsData] = await Promise.all([
        api.getParcelles(token).catch(() => []),
        api.getHarvests(token).catch(() => []),
        api.getDashboard(token).catch(() => null),
        api.getConsultations(token).catch(() => []),
      ]);
      setParcelles(parcellesData);
      setHarvests(harvestsData);
      setStats(statsData);
      setConsultations(consultationsData);
    } catch (err) {
      console.error('Erreur chargement données utilisateur:', err);
    } finally {
      setLoadingData(false);
    }
  }, [token]);

  useEffect(() => {
    loadPublicData();
  }, [loadPublicData]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Handler: Create Parcelle
  const handleCreateParcelle = async (data: any) => {
    if (!token) return;
    const created = await api.createParcelle(token, data);
    setParcelles((prev) => [created, ...prev]);
    showNotification(`Parcelle "${created.name}" enregistrée avec succès`);
    await loadUserData();
  };

  // Handler: Delete Parcelle
  const handleDeleteParcelle = async (id: number) => {
    if (!token) return;
    try {
      await api.deleteParcelle(token, id);
      setParcelles((prev) => prev.filter((p) => p.id !== id));
      setHarvests((prev) => prev.filter((h) => h.parcelleId !== id));
      showNotification('Parcelle supprimée');
      await loadUserData();
    } catch (err: any) {
      showNotification(err.message || 'Erreur suppression', 'error');
    }
  };

  // Handler: Create Harvest
  const handleCreateHarvest = async (data: any) => {
    if (!token) return;
    const created = await api.createHarvest(token, data);
    setHarvests((prev) => [created, ...prev]);
    showNotification(`Récolte de ${created.quantityKg} kg enregistrée`);
    await loadUserData();
  };

  // Handler: Delete Harvest
  const handleDeleteHarvest = async (id: number) => {
    if (!token) return;
    try {
      await api.deleteHarvest(token, id);
      setHarvests((prev) => prev.filter((h) => h.id !== id));
      showNotification('Pesée supprimée');
      await loadUserData();
    } catch (err: any) {
      showNotification(err.message || 'Erreur suppression', 'error');
    }
  };

  // Handler: Create Consultation
  const handleCreateConsultation = async (data: any) => {
    if (!token) return;
    const created = await api.createConsultation(token, data);
    setConsultations((prev) => [created, ...prev]);
    showNotification('Demande de diagnostic transmise à l\'équipe agronomique');
    await loadUserData();
  };

  // Handler: Answer Consultation
  const handleAnswerConsultation = async (id: number, answerText: string) => {
    if (!token) return;
    const updated = await api.answerConsultation(token, id, answerText);
    setConsultations((prev) => prev.map((c) => (c.id === id ? updated : c)));
    showNotification('Conseil agronomique enregistré avec succès');
  };

  const navItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'parcelles', label: 'Mes Parcelles', icon: Layers, count: parcelles.length },
    { id: 'harvests', label: 'Récoltes & Pesées', icon: Wheat, count: harvests.length },
    { id: 'consultations', label: 'Conseil & Diagnostic', icon: MessageSquareText, count: consultations.filter(c => c.status === 'en_attente').length },
    { id: 'market', label: 'Cours des Marchés (SIM)', icon: TrendingUp },
    { id: 'guides', label: 'Fiches Techniques', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-emerald-200 selection:text-emerald-950">
      {/* Header */}
      <Header onOpenProfile={() => setProfileOpen(true)} />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200/90 shadow-xs mb-6 overflow-x-auto flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {typeof item.count === 'number' && item.count > 0 && (
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                      isActive ? 'bg-amber-400 text-amber-950' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Global Notification Toast */}
        {notification && (
          <div
            className={`fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold transition-all ${
              notification.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : 'bg-red-900 text-white border-red-700'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Active Tab Content */}
        <main className="flex-1">
          {authLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-3" />
              <p className="text-xs">Chargement d'AgriConseil...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView
                  stats={stats}
                  parcelles={parcelles}
                  harvests={harvests}
                  consultations={consultations}
                  marketPrices={marketPrices}
                  onNavigateTab={(tab) => setActiveTab(tab as any)}
                  onOpenNewParcelle={() => {
                    if (!user) {
                      signInWithGoogle();
                    } else {
                      setNewParcelleOpen(true);
                    }
                  }}
                  onOpenNewHarvest={() => {
                    if (!user) {
                      signInWithGoogle();
                    } else if (parcelles.length === 0) {
                      setNewParcelleOpen(true);
                    } else {
                      setPreselectedParcelle(null);
                      setNewHarvestOpen(true);
                    }
                  }}
                  onOpenNewConsultation={() => {
                    if (!user) {
                      signInWithGoogle();
                    } else {
                      setNewConsultationOpen(true);
                    }
                  }}
                  isAuthenticated={!!user}
                  onSignIn={signInWithGoogle}
                />
              )}

              {activeTab === 'parcelles' && (
                <ParcellesView
                  parcelles={parcelles}
                  onOpenNewParcelle={() => setNewParcelleOpen(true)}
                  onOpenNewHarvestForParcelle={(parcelle) => {
                    setPreselectedParcelle(parcelle);
                    setNewHarvestOpen(true);
                  }}
                  onDeleteParcelle={handleDeleteParcelle}
                  isAuthenticated={!!user}
                  onSignIn={signInWithGoogle}
                />
              )}

              {activeTab === 'harvests' && (
                <HarvestsView
                  harvests={harvests}
                  parcelles={parcelles}
                  onOpenNewHarvest={() => {
                    setPreselectedParcelle(null);
                    setNewHarvestOpen(true);
                  }}
                  onDeleteHarvest={handleDeleteHarvest}
                  isAuthenticated={!!user}
                  onSignIn={signInWithGoogle}
                />
              )}

              {activeTab === 'consultations' && (
                <ConsultationsView
                  consultations={consultations}
                  parcelles={parcelles}
                  onOpenNewConsultation={() => setNewConsultationOpen(true)}
                  onAnswerConsultation={handleAnswerConsultation}
                  isAuthenticated={!!user}
                  onSignIn={signInWithGoogle}
                />
              )}

              {activeTab === 'market' && <MarketPricesView marketPrices={marketPrices} />}

              {activeTab === 'guides' && <GuidesView guides={guides} />}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-slate-200/80 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-700">AgriConseil CI</span>
            <span>—</span>
            <span>Conseil agronomique & gestion des exploitations en Côte d'Ivoire</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span>Base de données Cloud SQL PostgreSQL</span>
            <span>•</span>
            <span>Authentification Google Firebase</span>
            <span>•</span>
            <span>Abidjan (UTC+00:00)</span>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <NewParcelleModal
        isOpen={newParcelleOpen}
        onClose={() => setNewParcelleOpen(false)}
        onSubmit={handleCreateParcelle}
      />

      <NewHarvestModal
        isOpen={newHarvestOpen}
        onClose={() => {
          setNewHarvestOpen(false);
          setPreselectedParcelle(null);
        }}
        parcelles={parcelles}
        preselectedParcelle={preselectedParcelle}
        onSubmit={handleCreateHarvest}
      />

      <NewConsultationModal
        isOpen={newConsultationOpen}
        onClose={() => setNewConsultationOpen(false)}
        parcelles={parcelles}
        onSubmit={handleCreateConsultation}
      />

      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AgriConseilApp />
    </AuthProvider>
  );
}
