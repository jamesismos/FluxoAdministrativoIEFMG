'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Save, Trash2, PlusCircle, Clock, CheckCircle2, ChevronDown, ChevronUp, Calendar } from 'lucide-react';

interface SimplesDeclaracaoProps {
  activeProcessId: string | null;
  onNavigate: (tab: string, processId?: string) => void;
}

function FlowStep({ label, note, checked, onChange }: {
  label: string; note?: string; checked: boolean; onChange: () => void;
}) {
  return (
    <label className={`flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition select-none ${
      checked
        ? 'bg-emerald-950/25 border border-emerald-900/30'
        : 'bg-slate-900/20 border border-slate-800/40 hover:bg-slate-900/40'
    }`}>
      <input type="checkbox" checked={checked} onChange={onChange}
        className="mt-0.5 w-4 h-4 accent-emerald-500 shrink-0 cursor-pointer" />
      <div className="min-w-0 flex-1">
        <p className={`text-xs font-semibold leading-tight ${checked ? 'text-emerald-300 line-through opacity-60' : 'text-slate-200'}`}>{label}</p>
        {note && <p className="text-[10px] text-slate-500 mt-0.5">{note}</p>}
      </div>
      {checked && <CheckCircle2 size={13} className="text-emerald-500 shrink-0 ml-auto mt-0.5" />}
    </label>
  );
}

function PhaseHeader({ num, label, done, total, collapsed, onToggle }: {
  num: number; label: string; done: number; total: number; collapsed: boolean; onToggle: () => void;
}) {
  const isComplete = total > 0 && done === total;
  return (
    <button onClick={onToggle} className="w-full flex items-center gap-3 text-left py-2.5 px-4 hover:bg-slate-800/20 transition">
      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
        isComplete ? 'bg-emerald-600 text-white' : done > 0 ? 'bg-slate-700 text-amber-300' : 'bg-slate-800 text-slate-500'
      }`}>
        {isComplete ? '✓' : num}
      </span>
      <div className="flex-1 min-w-0">
        <span className={`text-xs font-bold uppercase tracking-wider ${isComplete ? 'text-emerald-400' : 'text-slate-300'}`}>
          Fase {num} — {label}
        </span>
        <span className="text-slate-600 text-[10px] ml-2">({done}/{total})</span>
      </div>
      {collapsed ? <ChevronDown size={14} className="text-slate-500 shrink-0" /> : <ChevronUp size={14} className="text-slate-500 shrink-0" />}
    </button>
  );
}

export const SimplesDeclaracao: React.FC<SimplesDeclaracaoProps> = ({ activeProcessId, onNavigate }) => {
  const { processes, updateProcess, deleteProcess } = useApp();

  const process = processes.find(p => p.id === activeProcessId && p.type === 'Simples Declaração');
  const simplesList = processes.filter(p => p.type === 'Simples Declaração');

  const [flow, setFlow] = useState<Record<string, boolean>>({
    conferidoDocumentos: false,
    memorandoAnalistaCriado: false,
    analiseTecnicaConcluida: false,
    intimacaoEletronicaCriada: false,
  });
  const [dataFormalizacao, setDataFormalizacao] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({ 1: false, 2: false, 3: false });

  useEffect(() => {
    if (process) {
      setDataFormalizacao(process.dataFormalizacao || '');
      if (process.simplesData) {
        const d = process.simplesData;
        setFlow({
          conferidoDocumentos: d.conferidoDocumentos ?? false,
          memorandoAnalistaCriado: d.memorandoAnalistaCriado ?? false,
          analiseTecnicaConcluida: d.analiseTecnicaConcluida ?? false,
          intimacaoEletronicaCriada: d.intimacaoEletronicaCriada ?? false,
        });
      }
    }
  }, [activeProcessId, process, process?.simplesData, process?.dataFormalizacao]);

  // LISTA
  if (!process) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Simples Declara\u00e7\u00f5es</h1>
            <p className="text-slate-400 text-xs mt-0.5">{simplesList.length} processo(s) cadastrado(s)</p>
          </div>
          <button onClick={() => onNavigate('Entrada / Triagem')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition">
            <PlusCircle size={14} /> Nova Declara\u00e7\u00e3o
          </button>
        </div>

        {simplesList.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <FileText size={48} className="mx-auto text-slate-700 mb-3" />
            <h2 className="text-lg font-bold text-white">Nenhuma Simples Declara\u00e7\u00e3o Cadastrada</h2>
            <p className="text-sm mt-1">Crie um novo processo de Simples Declara\u00e7\u00e3o na Triagem.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {simplesList.map(p => {
              const dias = Math.ceil((Date.now() - new Date(p.dataEntrada).getTime()) / 86400000);
              const isLate = dias > 20 && !p.isFinalized;
              const d = p.simplesData;
              const steps = [d?.conferidoDocumentos, d?.memorandoAnalistaCriado, d?.analiseTecnicaConcluida, d?.intimacaoEletronicaCriada];
              const done = steps.filter(Boolean).length;
              const prog = Math.round((done / steps.length) * 100);
              return (
                <div key={p.id} className={`p-3 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-3 transition ${
                  p.isFinalized ? 'border-slate-800 bg-slate-900/20 opacity-60'
                    : isLate ? 'border-red-800/50 bg-red-950/10'
                    : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/60'
                }`}>
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {p.isFinalized && <span className="bg-slate-700 text-slate-300 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Finalizado</span>}
                      {isLate && <span className="bg-red-500/20 text-red-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase flex items-center gap-1"><Clock size={9} /> {dias}d</span>}
                      {p.emAcompanhamentoEspecial && !p.isFinalized && <span className="bg-sky-500/20 text-sky-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Ativo</span>}
                      <strong className="text-white text-sm font-mono">{p.seiNumber}</strong>
                      <span className="text-slate-400 text-xs">{p.requerente}</span>
                    </div>
                    <p className="text-slate-400 text-xs">{p.municipio} | Entrada: <span className="font-mono">{p.dataEntrada}</span></p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-800 rounded-full h-1">
                        <div className="bg-emerald-600 h-1 rounded-full" style={{ width: `${prog}%` }} />
                      </div>
                      <span className="text-[10px] text-slate-500 shrink-0">{prog}%</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => onNavigate('Simples Declar\u00e7\u00e3o', p.id)}
                      className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition font-medium cursor-pointer">
                      Gerenciar
                    </button>
                    <button onClick={() => { if (confirm('Excluir este processo?')) deleteProcess(p.id); }}
                      className="bg-red-950/20 hover:bg-red-900/40 text-red-400 border border-red-800/30 text-xs px-2.5 py-1.5 rounded-lg transition cursor-pointer">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // FLUXO
  const derivaEtapa = (f: Record<string, boolean>) => {
    if (f.intimacaoEletronicaCriada) return 'Finalização' as const;
    if (f.memorandoAnalistaCriado) return 'Conferência' as const;
    return 'Entrada' as const;
  };

  const toggleFlow = (key: string) => {
    const newFlow = { ...flow, [key]: !flow[key] };
    setFlow(newFlow);
    if (activeProcessId && process.simplesData) {
      updateProcess(activeProcessId, {
        dataFormalizacao,
        simplesData: {
          ...process.simplesData,
          ...newFlow,
          etapa: derivaEtapa(newFlow),
        }
      });
    }
  };

  const handleSave = () => {
    if (!activeProcessId || !process.simplesData) return;
    updateProcess(activeProcessId, {
      dataFormalizacao,
      simplesData: { ...process.simplesData, ...flow, etapa: derivaEtapa(flow) }
    });
    setFeedbackMsg('Salvo!');
    setTimeout(() => setFeedbackMsg(''), 1500);
  };

  const toggleCollapse = (phase: number) => setCollapsed(prev => ({ ...prev, [phase]: !prev[phase] }));

  const totalSteps = Object.keys(flow).length;
  const doneSteps = Object.values(flow).filter(Boolean).length;
  const progress = Math.round((doneSteps / totalSteps) * 100);
  const dias = Math.ceil((Date.now() - new Date(process.dataEntrada).getTime()) / 86400000);

  const f1Done = [flow.conferidoDocumentos].filter(Boolean).length;
  const f2Done = [flow.memorandoAnalistaCriado].filter(Boolean).length;
  const f3Done = [flow.analiseTecnicaConcluida, flow.intimacaoEletronicaCriada].filter(Boolean).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded font-bold border ${
              process.isFinalized ? 'bg-slate-700/30 text-slate-400 border-slate-700/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}>Simples Declaração {process.isFinalized ? '— Finalizado' : '— Ativo'}</span>
            <h1 className="text-xl font-bold text-white font-mono">{process.seiNumber}</h1>
            {dias > 20 && !process.isFinalized && (
              <span className="bg-red-500/20 text-red-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase flex items-center gap-1">
                <Clock size={9} /> {dias} dias
              </span>
            )}
          </div>
          <p className="text-slate-400 text-xs mt-1">{process.requerente} · {process.municipio} · Entrada: <span className="font-mono">{process.dataEntrada}</span></p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {feedbackMsg && <span className="text-emerald-400 text-xs font-semibold">{feedbackMsg}</span>}
          <button onClick={handleSave} className="bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer">
            <Save size={14} /> Salvar
          </button>
          <button onClick={() => { if (confirm('Excluir este processo?')) { deleteProcess(process.id); onNavigate('Painel'); } }}
            className="bg-red-950/20 hover:bg-red-900/40 text-red-400 border border-red-800/30 text-xs px-3 py-1.5 rounded-lg transition cursor-pointer">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Formalização & Prazo Legal */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex items-center gap-2.5">
          <Calendar className="text-sky-400 shrink-0" size={20} />
          <div>
            <p className="text-xs font-bold text-sky-300 uppercase tracking-wider">Formalização / Aceite</p>
            <p className="text-[10px] text-slate-450 mt-0.5">O prazo legal de análise (30 dias) inicia-se a partir desta data</p>
          </div>
        </div>
        <div className="flex items-center gap-3 md:ml-auto">
          <input
            type="date"
            value={dataFormalizacao}
            onChange={e => {
              setDataFormalizacao(e.target.value);
              updateProcess(process.id, { dataFormalizacao: e.target.value });
            }}
            className="bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
          />
          {dataFormalizacao ? (
            <span className="text-slate-400 text-xs font-semibold">
              Formalizado há <span className="text-emerald-400 font-bold">{Math.ceil((Date.now() - new Date(dataFormalizacao).getTime()) / 86400000)}</span> dias
            </span>
          ) : (
            <span className="text-amber-400 text-[10px] font-bold bg-amber-950/20 px-2 py-0.5 rounded border border-amber-900/30">
              Aguardando Formalização (Triagem)
            </span>
          )}
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Progresso do fluxo</span>
          <span className={`font-bold ${progress === 100 ? 'text-emerald-400' : 'text-slate-300'}`}>{doneSteps}/{totalSteps} passos ({progress}%)</span>
        </div>
        <div className="bg-slate-800 rounded-full h-1.5">
          <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* FASE 1 */}
      <div className="bg-slate-900/30 border border-slate-800/60 rounded-xl overflow-hidden">
        <div className="border-b border-slate-800/60">
          <PhaseHeader num={1} label="Entrada e Confer\u00eancia Documental"
            done={f1Done} total={1} collapsed={!!collapsed[1]} onToggle={() => toggleCollapse(1)} />
        </div>
        {!collapsed[1] && (
          <div className="p-3 space-y-1.5">
            <p className="text-[10px] text-slate-500 px-1 pb-1">
              Verificar documentos m\u00ednimos da Simples Declara\u00e7\u00e3o conforme formul\u00e1rio padr\u00e3o do IEF.
            </p>
            <FlowStep label="Processo recebido e documentos m\u00ednimos conferidos"
              note="Formul\u00e1rio de Simples Declara\u00e7\u00e3o assinado e documentos obrigat\u00f3rios anexados no SEI"
              checked={flow.conferidoDocumentos} onChange={() => toggleFlow('conferidoDocumentos')} />
          </div>
        )}
      </div>

      {/* FASE 2 */}
      <div className="bg-slate-900/30 border border-slate-800/60 rounded-xl overflow-hidden">
        <div className="border-b border-slate-800/60">
          <PhaseHeader num={2} label="Instru\u00e7\u00e3o no SEI"
            done={f2Done} total={1} collapsed={!!collapsed[2]} onToggle={() => toggleCollapse(2)} />
        </div>
        {!collapsed[2] && (
          <div className="p-3 space-y-1.5">
            <p className="text-[10px] text-slate-500 px-1 pb-1">
              Criar memorando no SEI e distribuir para o analista t\u00e9cnico.
            </p>
            <FlowStep label="Memorando de distribui\u00e7\u00e3o para o analista (Paulo) criado no SEI"
              note="Modelo favorito: Memorando de Vistoria T\u00e9cnica / Distribui\u00e7\u00e3o de Simples Declara\u00e7\u00e3o"
              checked={flow.memorandoAnalistaCriado} onChange={() => toggleFlow('memorandoAnalistaCriado')} />
          </div>
        )}
      </div>

      {/* FASE 3 */}
      <div className="bg-slate-900/30 border border-slate-800/60 rounded-xl overflow-hidden">
        <div className="border-b border-slate-800/60">
          <PhaseHeader num={3} label="Conclus\u00e3o e Arquivamento"
            done={f3Done} total={2} collapsed={!!collapsed[3]} onToggle={() => toggleCollapse(3)} />
        </div>
        {!collapsed[3] && (
          <div className="p-3 space-y-1.5">
            <p className="text-[10px] text-slate-500 px-1 pb-1">
              Ap\u00f3s o t\u00e9cnico concluir a an\u00e1lise \u2014 intima\u00e7\u00e3o ao declarante e arquivamento.
            </p>
            <FlowStep label="An\u00e1lise t\u00e9cnica conclu\u00edda pelo analista"
              note="Aguardar retorno do processo com o despacho do analista"
              checked={flow.analiseTecnicaConcluida} onChange={() => toggleFlow('analiseTecnicaConcluida')} />
            <FlowStep label="Intima\u00e7\u00e3o eletr\u00f4nica de ci\u00eancia enviada ao declarante"
              note="Modelo favorito: Intima\u00e7\u00e3o Eletr\u00f4nica de Ci\u00eancia"
              checked={flow.intimacaoEletronicaCriada} onChange={() => toggleFlow('intimacaoEletronicaCriada')} />

            {/* Controles de encerramento */}
            <div className="mt-3 pt-3 border-t border-slate-800/60 space-y-2.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={process.isFinalized}
                  onChange={e => updateProcess(process.id, { isFinalized: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500" />
                <span className="text-xs text-slate-300 font-semibold">Marcar processo como FINALIZADO</span>
              </label>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 shrink-0">Bloco Interno:</span>
                <select value={process.blocoInterno}
                  onChange={e => updateProcess(process.id, { blocoInterno: e.target.value })}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-white text-xs">
                  <option value="">Selecione o bloco</option>
                  <option value="Simples Declara\u00e7\u00e3o finalizada">Simples Declara\u00e7\u00e3o finalizada</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
