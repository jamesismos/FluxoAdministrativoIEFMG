'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Process } from '../types';
import { FolderHeart, Archive, ChevronRight, FileCheck } from 'lucide-react';

interface AcompanhamentosBlocosProps {
  onNavigate: (tab: string, processId?: string) => void;
}

export const AcompanhamentosBlocos: React.FC<AcompanhamentosBlocosProps> = ({ onNavigate }) => {
  const { processes, updateProcess } = useApp();
  const [viewMode, setViewMode] = useState<'acompanhamento' | 'blocos'>('acompanhamento');

  const acompanhamentoCategorias = [
    'Intervenção Ambiental',
    'DCFs Ativas',
    'Simples Declarações em análise',
    'DCFs para cadastrar saldo SIAM',
    'Acompanhamento de medidas compensatórias',
    'Outros'
  ];

  const blocosCategorias = [
    'DCF finalizadas',
    'Intervenção ambiental finalizada',
    'Indeferido tributário',
    'Simples Declaração finalizada',
    'Pedido de restituição',
    'Medidas compensatórias',
    'Outros'
  ];

  // Filters
  const activeProcesses = processes.filter(p => p.emAcompanhamentoEspecial && !p.isFinalized);
  const archivedProcesses = processes.filter(p => p.isFinalized || p.blocoInterno !== '');

  const getProcessesByAcompCategory = (cat: string) => {
    return activeProcesses.filter(p => p.acompanhamentoTipo === cat);
  };

  const getProcessesByBlocoCategory = (cat: string) => {
    return archivedProcesses.filter(p => p.blocoInterno === cat);
  };

  const handleFinalize = (id: string, bloco: string) => {
    updateProcess(id, {
      isFinalized: true,
      emAcompanhamentoEspecial: false,
      blocoInterno: bloco
    });
    alert('Processo finalizado e arquivado localmente!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Acompanhamentos & Blocos Internos</h1>
          <p className="text-slate-400 text-sm">Monitore quais processos estão sob acompanhamento especial ativo de prazos e quais já foram transferidos para os blocos de arquivamento no SEI.</p>
        </div>

        <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
          <button
            onClick={() => setViewMode('acompanhamento')}
            className={`px-3 py-1.5 rounded-md font-semibold transition ${viewMode === 'acompanhamento' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Acompanhamentos Especiais ({activeProcesses.length})
          </button>
          <button
            onClick={() => setViewMode('blocos')}
            className={`px-3 py-1.5 rounded-md font-semibold transition ${viewMode === 'blocos' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Blocos Internos ({archivedProcesses.length})
          </button>
        </div>
      </div>

      {/* Main panel */}
      <div className="bg-slate-900/30 border border-slate-800 p-5 rounded-xl text-xs space-y-4">
        {viewMode === 'acompanhamento' ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-850 pb-2">
              <FolderHeart className="text-emerald-400" size={18} />
              <h2 className="text-base font-bold text-white">Listagem de Filas Ativas (Acompanhamento)</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {acompanhamentoCategorias.map(cat => {
                const list = getProcessesByAcompCategory(cat);
                return (
                  <div key={cat} className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                      <strong className="text-white text-xs">{cat}</strong>
                      <span className="bg-slate-900 border border-slate-850 px-2 py-0.5 rounded text-[10px] text-slate-400 font-bold">{list.length}</span>
                    </div>

                    {list.length === 0 ? (
                      <p className="text-slate-650 italic text-[11px]">Nenhum processo nesta fila.</p>
                    ) : (
                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        {list.map(p => (
                          <div 
                            key={p.id}
                            className="bg-slate-900/40 p-2 rounded border border-slate-850 flex justify-between items-center hover:bg-slate-900 transition"
                          >
                            <div className="space-y-0.5">
                              <span className="font-mono font-bold text-slate-100">{p.seiNumber}</span>
                              <p className="text-[10px] text-slate-450">{p.requerente.substring(0, 20)}... | {p.municipio}</p>
                              <p className="text-[10px] text-amber-400">Ação: {p.proximaAcao.substring(0, 30)}...</p>
                            </div>
                            
                            <div className="flex gap-1.5 shrink-0 ml-2">
                              <button 
                                onClick={() => onNavigate(p.type === 'AIA' ? 'AIA — Intervenção Ambiental' : p.type === 'DCF' ? 'DCF' : 'Simples Declaração', p.id)}
                                className="bg-slate-800 hover:bg-slate-700 text-white p-1 rounded transition"
                                title="Abrir processo"
                              >
                                <ChevronRight size={14} />
                              </button>
                              <button 
                                onClick={() => {
                                  const bloco = cat.includes('DCF') ? 'DCF finalizadas' : cat.includes('Simples') ? 'Simples Declaração finalizada' : 'Intervenção ambiental finalizada';
                                  handleFinalize(p.id, bloco);
                                }}
                                className="bg-emerald-950 hover:bg-emerald-900 text-emerald-400 p-1 rounded border border-emerald-800/30 transition font-bold text-[9px]"
                                title="Concluir"
                              >
                                <FileCheck size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-850 pb-2">
              <Archive className="text-emerald-400" size={18} />
              <h2 className="text-base font-bold text-white">Arquivados em Blocos Internos (SEI)</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blocosCategorias.map(cat => {
                const list = getProcessesByBlocoCategory(cat);
                return (
                  <div key={cat} className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                      <strong className="text-white text-xs">{cat}</strong>
                      <span className="bg-slate-900 border border-slate-850 px-2 py-0.5 rounded text-[10px] text-slate-400 font-bold">{list.length}</span>
                    </div>

                    {list.length === 0 ? (
                      <p className="text-slate-650 italic text-[11px]">Nenhum processo neste bloco.</p>
                    ) : (
                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        {list.map(p => (
                          <div 
                            key={p.id}
                            className="bg-slate-900/40 p-2 rounded border border-slate-850 flex justify-between items-center"
                          >
                            <div className="space-y-0.5">
                              <span className="font-mono font-bold text-slate-400 line-through">{p.seiNumber}</span>
                              <p className="text-[10px] text-slate-500">{p.requerente.substring(0, 20)}... | {p.municipio}</p>
                              <p className="text-[10px] text-emerald-500 font-semibold">Status: Finalizado / Concluído</p>
                            </div>
                            
                            <button 
                              onClick={() => {
                                updateProcess(p.id, { isFinalized: false, emAcompanhamentoEspecial: true });
                                alert('Retornado para fila ativa de acompanhamento.');
                              }}
                              className="bg-slate-850 hover:bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded transition text-[9px]"
                            >
                              Reativar
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
