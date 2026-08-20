import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ChurchBanner } from './components/ChurchBanner';
import { HomeQuickMenu } from './components/HomeQuickMenu';
import { SecretariatsGrid } from './components/SecretariatsGrid';
import { HowItWorks } from './components/HowItWorks';
import { StatsAndMap } from './components/StatsAndMap';
import { ComplaintWizard } from './components/ComplaintWizard';
import { ConfirmationModal } from './components/ConfirmationModal';
import { ProtocolLookup } from './components/ProtocolLookup';
import { TransparencyDashboard } from './components/TransparencyDashboard';
import { AdminPanel } from './components/AdminPanel';
import { CamaraPresentationSlides } from './components/CamaraPresentationSlides';
import { Footer } from './components/Footer';
import { BottomNavBar } from './components/BottomNavBar';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';

import { Report, SecretariatId, SecretariatInfo } from './types';
import { INITIAL_REPORTS, SECRETARIATS } from './data/mockData';
import { 
  getReports, 
  createReport, 
  getReportByProtocol, 
  updateReportStatus, 
  rateReport,
  subscribeToReportsRealtime,
  getSecretariats,
  updateSecretariat,
  createSecretariat,
  deleteSecretariat,
  subscribeToSecretariatsRealtime
} from './services/supabaseService';
import { isSupabaseConfigured } from './lib/supabase';

export default function App() {
  // Navigation State
  const [activeView, setActiveView] = useState<'home' | 'wizard' | 'confirmation' | 'lookup' | 'transparency' | 'admin' | 'presentation'>('home');

  // Reports state (fetches from Supabase / API server / local fallback)
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  
  // Secretariats state (fetches from Supabase / API server / fallback)
  const [secretariats, setSecretariats] = useState<SecretariatInfo[]>(SECRETARIATS);

  // Selected Secretariat for prefilling wizard
  const [selectedSecretariatId, setSelectedSecretariatId] = useState<SecretariatId | undefined>(undefined);

  // Active protocol for confirmation or lookup
  const [activeProtocol, setActiveProtocol] = useState<string>('');

  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // ----------------------------------------------------
  // FETCH REPORTS & SECRETARIATS FROM SUPABASE / BACKEND API
  // ----------------------------------------------------
  const fetchAllReports = async () => {
    try {
      const data = await getReports();
      if (Array.isArray(data)) {
        setReports(data);
      }
    } catch (err) {
      console.warn('Erro ao carregar dados de relatórios:', err);
    }
  };

  const fetchAllSecretariats = async () => {
    try {
      const data = await getSecretariats();
      if (Array.isArray(data) && data.length > 0) {
        setSecretariats(data);
      }
    } catch (err) {
      console.warn('Erro ao carregar secretarias:', err);
    }
  };

  useEffect(() => {
    fetchAllReports();
    fetchAllSecretariats();

    // Subscribe to Supabase realtime changes if configured
    const unsubscribeReports = subscribeToReportsRealtime(() => {
      fetchAllReports();
    });

    const unsubscribeSec = subscribeToSecretariatsRealtime(() => {
      fetchAllSecretariats();
    });

    return () => {
      unsubscribeReports();
      unsubscribeSec();
    };
  }, []);

  // ----------------------------------------------------
  // SECRETARIAT CRUD HANDLERS
  // ----------------------------------------------------
  const handleUpdateSecretariat = async (id: string, updates: Partial<SecretariatInfo>) => {
    try {
      const updatedList = await updateSecretariat(id, updates, secretariats);
      setSecretariats(updatedList);
    } catch (err) {
      console.error('Erro ao atualizar secretaria:', err);
    }
  };

  const handleCreateSecretariat = async (newSec: SecretariatInfo) => {
    try {
      const updatedList = await createSecretariat(newSec, secretariats);
      setSecretariats(updatedList);
    } catch (err) {
      console.error('Erro ao cadastrar secretaria:', err);
    }
  };

  const handleDeleteSecretariat = async (id: string) => {
    try {
      const updatedList = await deleteSecretariat(id, secretariats);
      setSecretariats(updatedList);
    } catch (err) {
      console.error('Erro ao excluir secretaria:', err);
    }
  };

  // ----------------------------------------------------
  // SUBMIT NEW REPORT
  // ----------------------------------------------------
  const handleSubmitReport = async (reportPayload: any): Promise<string> => {
    try {
      const created = await createReport(reportPayload);
      if (created) {
        setActiveProtocol(created.protocol);
        await fetchAllReports();
        setActiveView('confirmation');
        return created.protocol;
      }
    } catch (err) {
      console.error('Erro ao enviar denúncia:', err);
    }

    // Fallback local memory creation
    const randomSixDigits = Math.floor(100000 + Math.random() * 900000);
    const protocol = `MVM-2026-${randomSixDigits}`;
    const nowISO = new Date().toISOString();

    const newReport: Report = {
      id: `rep-${Date.now()}`,
      protocol,
      type: reportPayload.type || 'anonima',
      secretariatId: reportPayload.secretariatId,
      category: reportPayload.category,
      customCategory: reportPayload.customCategory,
      description: reportPayload.description,
      attachments: reportPayload.attachments || [],
      location: reportPayload.location,
      createdAt: nowISO,
      updatedAt: nowISO,
      status: 'recebida',
      citizenName: reportPayload.citizenName,
      citizenCpf: reportPayload.citizenCpf,
      citizenEmail: reportPayload.citizenEmail,
      citizenPhone: reportPayload.citizenPhone,
      timeline: [
        {
          id: `t-${Date.now()}`,
          status: 'recebida',
          date: nowISO,
          title: 'Denúncia Registrada',
          description: 'Sua solicitação foi recebida e aguarda triagem da Ouvidoria.',
          author: 'Sistema +VOZ'
        }
      ],
      comments: []
    };

    setReports(prev => [newReport, ...prev]);
    setActiveProtocol(protocol);
    setActiveView('confirmation');
    return protocol;
  };

  // ----------------------------------------------------
  // SEARCH REPORT BY PROTOCOL
  // ----------------------------------------------------
  const handleSearchProtocol = async (proto: string): Promise<Report | null> => {
    try {
      const found = await getReportByProtocol(proto);
      if (found) return found;
    } catch (err) {
      console.warn('Busca de protocolo:', err);
    }

    // Fallback local search
    const localMatch = reports.find(r => r.protocol.toUpperCase() === proto.trim().toUpperCase());
    return localMatch || null;
  };

  // ----------------------------------------------------
  // UPDATE REPORT (ADMIN)
  // ----------------------------------------------------
  const handleUpdateReport = async (id: string, updateData: any) => {
    const current = reports.find(r => r.id === id);
    if (current) {
      try {
        await updateReportStatus(id, updateData, current);
        await fetchAllReports();
        return;
      } catch (err) {
        console.warn('Erro ao atualizar denúncia:', err);
      }
    }

    // Local fallback update
    setReports(prev => prev.map(r => {
      if (r.id !== id) return r;
      const nowISO = new Date().toISOString();
      const updatedTimeline = [...r.timeline];

      if (updateData.status && updateData.status !== r.status) {
        updatedTimeline.push({
          id: `t-${Date.now()}`,
          status: updateData.status,
          date: nowISO,
          title: `Status alterado para ${updateData.status}`,
          description: updateData.comment || 'Atualização administrativa.',
          author: updateData.role || 'Secretaria Responsável',
          photos: updateData.solutionPhotos
        });
      }

      const updatedComments = [...r.comments];
      if (updateData.comment) {
        updatedComments.push({
          id: `c-${Date.now()}`,
          author: updateData.author || 'Servidor Público',
          role: updateData.role || 'Secretaria Responsável',
          text: updateData.comment,
          date: nowISO,
          isInternal: !!updateData.isInternal
        });
      }

      return {
        ...r,
        status: updateData.status || r.status,
        updatedAt: nowISO,
        timeline: updatedTimeline,
        comments: updatedComments,
        solutionPhotos: updateData.solutionPhotos ? [...(r.solutionPhotos || []), ...updateData.solutionPhotos] : r.solutionPhotos,
        assignedOfficer: updateData.assignedOfficer || r.assignedOfficer
      };
    }));
  };

  // ----------------------------------------------------
  // RATE REPORT
  // ----------------------------------------------------
  const handleRateReport = async (reportId: string, rating: number, feedback: string) => {
    try {
      await rateReport(reportId, rating, feedback);
      await fetchAllReports();
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate report counts per secretariat for badges
  const countsBySec: Record<string, number> = {};
  reports.forEach(r => {
    countsBySec[r.secretariatId] = (countsBySec[r.secretariatId] || 0) + 1;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] font-poppins selection:bg-[#0F8A43] selection:text-white pb-16 md:pb-0">
      
      {/* Navbar Header (Hidden in full slide presentation mode) */}
      {activeView !== 'presentation' && (
        <Navbar
          activeView={activeView}
          onNavigate={(view) => {
            if (view === 'wizard') setSelectedSecretariatId(undefined);
            setActiveView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isAdminLoggedIn={isAdminLoggedIn}
        />
      )}

      {/* Main Content Body */}
      <main className="flex-1">
        
        {/* VIEW 1: HOME PAGE */}
        {activeView === 'home' && (
          <div>
            {/* Top Church Contour Banner */}
            <ChurchBanner
              onNewComplaint={() => {
                setSelectedSecretariatId(undefined);
                setActiveView('wizard');
              }}
              onSearchProtocol={(proto) => {
                setActiveProtocol(proto);
                setActiveView('lookup');
              }}
            />

            {/* Quick Option Cards Menu (Screen 1 in layout image) */}
            <HomeQuickMenu
              onNewComplaint={() => {
                setSelectedSecretariatId(undefined);
                setActiveView('wizard');
              }}
              onNavigate={(view) => {
                setActiveView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Secretariats Grid (Dynamic cards from Supabase / State) */}
            <div id="secretarias">
              <SecretariatsGrid
                secretariats={secretariats}
                reportCountsBySecretariat={countsBySec}
                onSelectSecretariat={(secId) => {
                  setSelectedSecretariatId(secId);
                  setActiveView('wizard');
                }}
              />
            </div>

            {/* How It Works Block (5 Steps) */}
            <div id="como-funciona">
              <HowItWorks />
            </div>

            {/* Statistics & Leaflet Map */}
            <StatsAndMap
              reports={reports}
              onSelectReport={(report) => {
                setActiveProtocol(report.protocol);
                setActiveView('lookup');
              }}
            />
          </div>
        )}

        {/* VIEW 2: COMPLAINT WIZARD */}
        {activeView === 'wizard' && (
          <ComplaintWizard
            secretariats={secretariats}
            initialSecretariatId={selectedSecretariatId}
            onSubmitReport={handleSubmitReport}
            onCancel={() => setActiveView('home')}
          />
        )}

        {/* VIEW 3: CONFIRMATION */}
        {activeView === 'confirmation' && (
          <ConfirmationModal
            protocol={activeProtocol}
            onConsultProtocol={(proto) => {
              setActiveProtocol(proto);
              setActiveView('lookup');
            }}
            onNewComplaint={() => {
              setSelectedSecretariatId(undefined);
              setActiveView('wizard');
            }}
          />
        )}

        {/* VIEW 4: PROTOCOL LOOKUP */}
        {activeView === 'lookup' && (
          <ProtocolLookup
            initialProtocol={activeProtocol}
            onSearch={handleSearchProtocol}
            onRateReport={handleRateReport}
            onGoHome={() => setActiveView('home')}
          />
        )}

        {/* VIEW 5: TRANSPARENCY DASHBOARD */}
        {activeView === 'transparency' && (
          <TransparencyDashboard
            reports={reports}
            onSelectReport={(report) => {
              setActiveProtocol(report.protocol);
              setActiveView('lookup');
            }}
          />
        )}

        {/* VIEW 6: ADMIN PANEL */}
        {activeView === 'admin' && (
          <AdminPanel
            reports={reports}
            onUpdateReport={handleUpdateReport}
            isAdminLoggedIn={isAdminLoggedIn}
            setIsAdminLoggedIn={setIsAdminLoggedIn}
            secretariats={secretariats}
            onUpdateSecretariat={handleUpdateSecretariat}
            onCreateSecretariat={handleCreateSecretariat}
            onDeleteSecretariat={handleDeleteSecretariat}
          />
        )}

        {/* VIEW 7: CAMARA MUNICIPAL PRESENTATION SLIDES */}
        {activeView === 'presentation' && (
          <CamaraPresentationSlides
            onGoHome={() => setActiveView('home')}
            onStartLiveDemo={() => {
              setSelectedSecretariatId(undefined);
              setActiveView('wizard');
            }}
          />
        )}

      </main>

      {/* Footer (Hidden in presentation mode) */}
      {activeView !== 'presentation' && <Footer />}

      {/* Mobile PWA Bottom App Bar (Hidden in presentation mode) */}
      {activeView !== 'presentation' && (
        <BottomNavBar
          activeView={activeView}
          onNavigate={(view) => {
            if (view === 'wizard') setSelectedSecretariatId(undefined);
            setActiveView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* PWA Floating Install Prompt */}
      {activeView !== 'presentation' && <PWAInstallPrompt />}

    </div>
  );
}
