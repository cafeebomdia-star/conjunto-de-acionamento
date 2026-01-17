import React, { useState, useEffect, useCallback } from 'react';
import { View, AppState } from './types.ts';
import { supabase } from './lib/supabase.ts';
import Welcome from './views/Auth/Welcome.tsx';
import Login from './views/Auth/Login.tsx';
import Register from './views/Auth/Register.tsx';
import Today from './views/Dashboard/Today.tsx';
import History from './views/Dashboard/History.tsx';
import FixedCosts from './views/Dashboard/FixedCosts.tsx';
import Report from './views/Dashboard/Report.tsx';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.WELCOME);
  const [loading, setLoading] = useState(true);
  const [appState, setAppState] = useState<AppState>({
    user: null,
    dailyRecords: [],
    fixedCosts: [],
    theme: 'light',
  });

  const loadData = useCallback(async (userId: string) => {
    try {
      const [profileRes, costsRes, recordsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        supabase.from('fixed_costs').select('*').eq('user_id', userId),
        supabase.from('daily_records').select('*, expenses(*)').eq('user_id', userId).order('date', { ascending: false })
      ]);

      setAppState({
        user: profileRes.data ? {
          firstName: profileRes.data.first_name,
          lastName: profileRes.data.last_name,
          email: profileRes.data.email,
          phone: profileRes.data.phone
        } : null,
        fixedCosts: costsRes.data?.map((c: any) => ({
          id: c.id,
          name: c.name,
          monthlyAmount: Number(c.monthly_amount)
        })) || [],
        dailyRecords: recordsRes.data?.map((r: any) => ({
          date: r.date,
          earnings: Number(r.earnings),
          mileage: r.mileage,
          isClosed: Boolean(r.is_closed),
          expenses: (r.expenses || []).map((e: any) => ({
            id: e.id,
            type: e.type,
            amount: Number(e.amount)
          }))
        })) || [],
        theme: 'light'
      });
    } catch (error) { 
      console.error("Erro ao carregar dados:", error); 
    } finally { 
      setLoading(false); 
    }
  }, []);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        loadData(session.user.id);
        setCurrentView(View.TODAY);
      } else {
        setLoading(false);
        setCurrentView(View.WELCOME);
      }
    });
  }, [loadData]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="spinner"></div>
    </div>
  );

  const renderView = () => {
    switch (currentView) {
      case View.WELCOME: return <Welcome onNavigate={setCurrentView} theme="light" />;
      case View.LOGIN: return <Login onLogin={() => setCurrentView(View.TODAY)} onBack={() => setCurrentView(View.WELCOME)} theme="light" />;
      case View.REGISTER: return <Register onRegister={() => setCurrentView(View.LOGIN)} onBack={() => setCurrentView(View.WELCOME)} theme="light" />;
      case View.TODAY: return <Today appState={appState} aiInsight={null} onNavigate={setCurrentView} onUpdateRecord={() => {}} onToggleTheme={() => {}} onLogout={() => supabase.auth.signOut()} />;
      case View.HISTORY: return <History records={appState.dailyRecords} fixedCosts={appState.fixedCosts} onNavigate={setCurrentView} theme="light" onSelectDay={() => {}} />;
      case View.FIXED_COSTS: return <FixedCosts fixedCosts={appState.fixedCosts} onAdd={() => {}} onRemove={() => {}} onNavigate={setCurrentView} theme="light" />;
      case View.REPORT: {
        const todayStr = new Date().toISOString().split('T')[0];
        const record = appState.dailyRecords.find(r => r.date === todayStr);
        return <Report record={record} fixedCosts={appState.fixedCosts} onBack={() => setCurrentView(View.TODAY)} />;
      }
      default: return <Welcome onNavigate={setCurrentView} theme="light" />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl relative">
      {renderView()}
    </div>
  );
};

export default App;