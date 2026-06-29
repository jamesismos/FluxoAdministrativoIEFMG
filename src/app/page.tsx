'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Dashboard } from '../components/Dashboard';
import { EntradaTriagem } from '../components/EntradaTriagem';
import { Aia } from '../components/Aia';
import { Dcf } from '../components/Dcf';
import { SimplesDeclaracao } from '../components/SimplesDeclaracao';
import { TaxasDAE } from '../components/TaxasDAE';
import { ASV } from '../components/ASV';
import { ModelosSEI } from '../components/ModelosSEI';
import { AcompanhamentosBlocos } from '../components/AcompanhamentosBlocos';
import { ValidacaoChefia } from '../components/ValidacaoChefia';
import { PlanilhasRelatorios } from '../components/PlanilhasRelatorios';
import { BaseNormativa } from '../components/BaseNormativa';
import { Configuracoes } from '../components/Configuracoes';

import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  FileSpreadsheet, 
  CheckSquare, 
  DollarSign, 
  Car, 
  Library, 
  FolderHeart, 
  UserCheck, 
  BarChart3, 
  Scale, 
  Settings,
  ShieldCheck
} from 'lucide-react';

export default function Home() {
  const { settings } = useApp();
  const [activeTab, setActiveTab] = useState<string>('Painel');
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);

  // Helper for cross-navigation between tabs
  const handleNavigate = (tabName: string, processId?: string) => {
    setActiveTab(tabName);
    if (processId) {
      setSelectedProcessId(processId);
    } else {
      setSelectedProcessId(null);
    }
  };

  // Render correct component based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'Painel':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'Entrada / Triagem':
        return <EntradaTriagem onNavigate={handleNavigate} />;
      case 'AIA — Intervenção Ambiental':
        return <Aia activeProcessId={selectedProcessId} onNavigate={handleNavigate} />;
      case 'DCF':
        return <Dcf activeProcessId={selectedProcessId} onNavigate={handleNavigate} />;
      case 'Simples Declaração':
        return <SimplesDeclaracao activeProcessId={selectedProcessId} onNavigate={handleNavigate} />;
      case 'Taxas / DAE / Restituição':
        return <TaxasDAE />;
      case 'ASV / Veículos':
        return <ASV />;
      case 'Modelos SEI':
        return <ModelosSEI />;
      case 'Acompanhamentos e Blocos':
        return <AcompanhamentosBlocos onNavigate={handleNavigate} />;
      case 'Validação da Chefia':
        return <ValidacaoChefia onNavigate={handleNavigate} />;
      case 'Planilhas / Relatórios':
        return <PlanilhasRelatorios />;
      case 'Base Normativa':
        return <BaseNormativa />;
      case 'Configurações':
        return <Configuracoes />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  const menuItems = [
    { name: 'Painel', icon: <LayoutDashboard size={16} /> },
    { name: 'Entrada / Triagem', icon: <PlusCircle size={16} /> },
    { name: 'AIA — Intervenção Ambiental', icon: <FileText size={16} /> },
    { name: 'DCF', icon: <FileSpreadsheet size={16} /> },
    { name: 'Simples Declaração', icon: <CheckSquare size={16} /> },
    { name: 'Taxas / DAE / Restituição', icon: <DollarSign size={16} /> },
    { name: 'ASV / Veículos', icon: <Car size={16} /> },
    { name: 'Modelos SEI', icon: <Library size={16} /> },
    { name: 'Acompanhamentos e Blocos', icon: <FolderHeart size={16} /> },
    { name: 'Validação da Chefia', icon: <UserCheck size={16} /> },
    { name: 'Planilhas / Relatórios', icon: <BarChart3 size={16} /> },
    { name: 'Base Normativa', icon: <Scale size={16} /> },
    { name: 'Configurações', icon: <Settings size={16} /> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar navigation */}
      <aside className="w-64 border-r border-slate-900 bg-slate-900/30 flex flex-col justify-between shrink-0">
        <div>
          {/* Sidebar Logo Header */}
          <div className="p-5 border-b border-slate-900 flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider">NAR Flow</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Assistente IEF</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-0.5">
            {menuItems.map(item => (
              <button
                key={item.name}
                onClick={() => handleNavigate(item.name)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition text-left ${activeTab === item.name ? 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/10' : 'text-slate-450 hover:bg-slate-900 hover:text-white border border-transparent'}`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* User Info Card Footer */}
        <div className="p-4 border-t border-slate-900 bg-slate-900/15">
          <div className="bg-slate-950/80 border border-slate-900 rounded-lg p-2.5 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-xs uppercase border border-emerald-500/20">
              {settings.servidorPadrao.substring(0, 2)}
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-bold text-white truncate">{settings.servidorPadrao}</p>
              <p className="text-[8px] text-slate-500 uppercase tracking-widest truncate">{settings.nomeUnidade}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main app panel */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header navbar */}
        <header className="h-14 border-b border-slate-900 bg-slate-900/10 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium">Unidade:</span>
            <span className="bg-slate-900 border border-slate-850 px-2 py-0.5 rounded text-[10px] text-slate-300 font-bold uppercase">{settings.nomeUnidade}</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Chefia: <strong className="text-white">{settings.chefiaNome}</strong></span>
            <span className="text-slate-700">|</span>
            <span className="text-[10px] font-semibold text-emerald-500">Local-First (Privado)</span>
          </div>
        </header>

        {/* Active view component */}
        <section className="flex-1 overflow-y-auto p-6 max-w-5xl w-full mx-auto">
          {renderContent()}
        </section>
      </main>
    </div>
  );
}
