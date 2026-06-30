'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChecklistItem } from '../types';
import { FileText, RefreshCw, Save, Trash2, PlusCircle, Clock, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Activity } from 'lucide-react';

interface AiaProps {
  activeProcessId: string | null;
  onNavigate: (tab: string, processId?: string) => void;
}

// Step do fluxo
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

// Cabeçalho de fase
function PhaseHeader({ num, label, done, total, collapsed, onToggle }: {
  num: number; label: string; done: number; total: number; collapsed: boolean; onToggle: () => void;
}) {
  const isComplete = total > 0 && done === total;
  return (
    <button onClick={onToggle} className="w-full flex items-center gap-3 text-left py-2.5 px-4 hover:bg-slate-800/20 transition">
      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
        isComplete ? 'bg-emerald-600 text-white' : done > 0 ? 'bg-slate-700 text-amber-300' : 'bg-slate-800 text-slate-500'
      }`}>{isComplete ? '✓' : num}</span>
      <div className="flex-1 min-w-0">
        <span className={`text-xs font-bold uppercase tracking-wider ${isComplete ? 'text-emerald-400' : 'text-slate-300'}`}>
          Fase {num} — {label}
        </span>
        {total > 0 && <span className="text-slate-600 text-[10px] ml-2">({done}/{total})</span>}
      </div>
      {collapsed ? <ChevronDown size={14} className="text-slate-500 shrink-0" /> : <ChevronUp size={14} className="text-slate-500 shrink-0" />}
    </button>
  );
}

const aiaInterventionsList = [
  'Supressão de cobertura vegetal nativa para uso alternativo do solo',
  'Intervenção com supressão em APP',
  'Intervenção sem supressão em APP',
  'Supressão de sub-bosque nativo em áreas com florestas plantadas',
  'Manejo sustentável',
  'Destoca em área remanescente de supressão',
  'Corte ou aproveitamento de árvores isoladas nativas vivas',
  'Aproveitamento de material lenhoso'
];

export const Aia: React.FC<AiaProps> = ({ activeProcessId, onNavigate }) => {
  const { processes, updateProcess, deleteProcess, settings } = useApp();

  const process = processes.find(p => p.id === activeProcessId && p.type === 'AIA');
  const aiaList = processes.filter(p => p.type === 'AIA');

  // State
  const [intervencoes, setIntervencoes] = useState<string[]>([]);
  const [documentosColados, setDocumentosColados] = useState('');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [responsavelTecnico, setResponsavelTecnico] = useState('');
  const [contagemDCMG, setContagemDCMG] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({ 1: false, 2: false, 3: false, 4: false });

  // Flow booleans (lidos do aiaData)
  const [flowBools, setFlowBools] = useState<Record<string, boolean>>({
    pendenciasNotificadas: false,
    despachoInstrucaoCriado: false,
    memorandoAnalistaCriado: false,
    encaminhadoAnalise: false,
    analiseTecnicaConcluida: false,
    despachoFinalCriado: false,
    encaminhadoSistemaDecisoes: false,
    sinaflorAtualizado: false,
  });

  useEffect(() => {
    if (process?.aiaData) {
      const d = process.aiaData;
      setIntervencoes(d.intervencoes || []);
      setDocumentosColados(d.documentosColados || '');
      setChecklist(d.checklist || []);
      setResponsavelTecnico(process.responsavelInterno || '');
      setContagemDCMG(d.contagemDCMG ?? 0);
      setFlowBools({
        pendenciasNotificadas: d.pendenciasNotificadas ?? false,
        despachoInstrucaoCriado: d.despachoInstrucaoCriado ?? false,
        memorandoAnalistaCriado: d.memorandoAnalistaCriado ?? false,
        encaminhadoAnalise: d.encaminhadoAnalise ?? false,
        analiseTecnicaConcluida: d.analiseTecnicaConcluida ?? false,
        despachoFinalCriado: d.despachoFinalCriado ?? false,
        encaminhadoSistemaDecisoes: d.encaminhadoSistemaDecisoes ?? false,
        sinaflorAtualizado: d.sinaflorAtualizado ?? false,
      });
    }
  }, [activeProcessId, process?.aiaData, process?.responsavelInterno]);

  // LISTA (sem processo selecionado)
  if (!process) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Processos AIA</h1>
            <p className="text-slate-400 text-xs mt-0.5">Autorizações de Intervenção Ambiental — {aiaList.length} cadastrada(s)</p>
          </div>
          <button onClick={() => onNavigate('Entrada / Triagem')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition">
            <PlusCircle size={14} /> Nova AIA
          </button>
        </div>

        {aiaList.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <FileText size={48} className="mx-auto text-slate-700 mb-3" />
            <h2 className="text-lg font-bold text-white">Nenhum Processo AIA Cadastrado</h2>
            <p className="text-sm mt-1">Crie um novo processo de Intervenção Ambiental na Triagem.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {aiaList.map(p => {
              const dias = Math.ceil((Date.now() - new Date(p.dataEntrada).getTime()) / 86400000);
              const isLate = dias > 20 && !p.isFinalized;
              const dcmg = p.aiaData?.contagemDCMG ?? 0;
              // Progresso dos flow bools
              const fb = p.aiaData;
              const flowItems = [
                fb?.pendenciasNotificadas, fb?.despachoInstrucaoCriado, fb?.memorandoAnalistaCriado,
                fb?.encaminhadoAnalise, fb?.analiseTecnicaConcluida, fb?.despachoFinalCriado,
                fb?.encaminhadoSistemaDecisoes, fb?.sinaflorAtualizado
              ];
              const done = flowItems.filter(Boolean).length;
              const prog = Math.round((done / flowItems.length) * 100);
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
                      {p.validacaoChefia === 'Aguardando chefia' && <span className="bg-amber-500/20 text-amber-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Aguardando Márcio</span>}
                      {dcmg > 0 && <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${dcmg >= 90 ? 'bg-red-500/20 text-red-400' : dcmg >= 60 ? 'bg-amber-500/20 text-amber-400' : 'bg-indigo-500/20 text-indigo-400'}`}>DCMG {dcmg}d</span>}
                      {p.emAcompanhamentoEspecial && !p.isFinalized && <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Ativo</span>}
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
                    <button onClick={() => onNavigate('AIA — Intervenção Ambiental', p.id)}
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

  // FLUXO (processo selecionado)
  const handleSave = (silent = false) => {
    if (!activeProcessId || !process.aiaData) return;
    updateProcess(activeProcessId, {
      responsavelInterno: responsavelTecnico,
      aiaData: {
        ...process.aiaData,
        intervencoes,
        documentosColados,
        checklist,
        contagemDCMG,
        ...flowBools,
      }
    });
    if (!silent) {
      setFeedbackMsg('Salvo!');
      setTimeout(() => setFeedbackMsg(''), 1500);
    }
  };

  const toggleFlow = (key: string) => {
    const newBools = { ...flowBools, [key]: !flowBools[key] };
    setFlowBools(newBools);
    if (activeProcessId && process.aiaData) {
      updateProcess(activeProcessId, {
        aiaData: { ...process.aiaData, intervencoes, documentosColados, checklist, contagemDCMG, ...newBools }
      });
    }
  };

  const saveDCMG = (val: number) => {
    setContagemDCMG(val);
    if (activeProcessId && process.aiaData) {
      updateProcess(activeProcessId, {
        aiaData: { ...process.aiaData, intervencoes, documentosColados, checklist, contagemDCMG: val, ...flowBools }
      });
    }
  };

  const handleParseSEI = () => {
    if (!documentosColados.trim()) return;
    const lines = documentosColados.split('\n');
    const parsedDocs: { title: string; number: string }[] = [];
    lines.forEach(line => {
      const match = line.match(/(.+?)\s*\((\d{7,10})\)/);
      if (match) parsedDocs.push({ title: match[1].trim(), number: match[2].trim() });
    });
    if (parsedDocs.length === 0) { alert('Nenhum documento com número SEI entre parênteses detectado.'); return; }
    const keywordMap: { keywords: string[]; itemIds: string[] }[] = [
      { keywords: ['requerimento', 'formulario', 'petição', 'solicitação'], itemIds: ['01'] },
      { keywords: ['identidade', 'cpf', 'rg', 'cnh', 'cnpj', 'identificação', 'endereço'], itemIds: ['02', '03'] },
      { keywords: ['procuração', 'procurador', 'mandato'], itemIds: ['04'] },
      { keywords: ['matrícula', 'posse', 'escritura', 'certidão de registro', 'imóvel', 'propriedade'], itemIds: ['05'] },
      { keywords: ['car', 'cadastro ambiental', 'recibo do car'], itemIds: ['06'] },
      { keywords: ['arrendamento', 'comodato', 'locação', 'parceria'], itemIds: ['07'] },
      { keywords: ['anuência', 'concordância', 'autorização proprietário'], itemIds: ['08'] },
      { keywords: ['planta', 'memorial', 'croqui', 'topográfica', 'desenho'], itemIds: ['09'] },
      { keywords: ['shapefile', 'kmz', 'kml', 'arquivo vetorial', 'digital vetorial', 'shapes'], itemIds: ['10'] },
      { keywords: ['pia', 'projeto de intervenção', 'projeto simplificado', 'pias', 'inventário florestal'], itemIds: ['11'] },
      { keywords: ['medida compensatória', 'compensação', 'termo de compromisso', 'ptrf', 'prada'], itemIds: ['12'] },
      { keywords: ['cerrado', 'lei 13.047'], itemIds: ['13'] },
      { keywords: ['expediente', 'dae expediente', 'taxa expediente'], itemIds: ['14'] },
      { keywords: ['taxa florestal', 'dae florestal', 'taxa de reposição'], itemIds: ['15'] },
      { keywords: ['fauna silvestre', 'fauna', 'inventariamento fauna', 'relatório de fauna'], itemIds: ['16'] },
      { keywords: ['resgate de fauna', 'salvamento', 'destinação de fauna'], itemIds: ['17'] },
      { keywords: ['caf', 'consumidores'], itemIds: ['18'] },
      { keywords: ['sinaflor', 'recibo sinaflor'], itemIds: ['19'] }
    ];
    const updatedChecklist = checklist.map(item => {
      const mapMatch = keywordMap.find(m => m.itemIds.includes(item.id));
      if (mapMatch) {
        const matchingDoc = parsedDocs.find(doc => mapMatch.keywords.some(kw => doc.title.toLowerCase().includes(kw)));
        if (matchingDoc) return { ...item, status: 'SIM' as const, docVinculado: `${matchingDoc.title} (${matchingDoc.number})`, observacao: 'Sugerido via parser SEI' };
      }
      return item;
    });
    setChecklist(updatedChecklist);
    alert(`Parser executado! ${parsedDocs.length} documentos encontrados.`);
  };

  const toggleCollapse = (phase: number) => setCollapsed(prev => ({ ...prev, [phase]: !prev[phase] }));

  // Progresso geral dos flow bools
  const flowKeys = Object.keys(flowBools);
  const flowDone = flowKeys.filter(k => flowBools[k]).length;
  const flowProgress = Math.round((flowDone / flowKeys.length) * 100);
  const dias = Math.ceil((Date.now() - new Date(process.dataEntrada).getTime()) / 86400000);

  // Status do DCMG
  const dcmgStatus = contagemDCMG >= 90 ? { label: 'Crítico', cls: 'bg-red-500/20 text-red-400' }
    : contagemDCMG >= 60 ? { label: 'Atenção', cls: 'bg-amber-500/20 text-amber-400' }
    : contagemDCMG > 0 ? { label: 'OK', cls: 'bg-emerald-500/20 text-emerald-400' }
    : null;

  // Pendências no checklist
  const pendencias = checklist.filter(c => c.status === 'NÃO' || c.status === 'A VERIFICAR');

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded font-bold border ${
              process.isFinalized ? 'bg-slate-700/30 text-slate-400 border-slate-700/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}>AIA {process.isFinalized ? '— Finalizado' : '— Ativo'}</span>
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
          <button onClick={() => handleSave()} className="bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer">
            <Save size={14} /> Salvar
          </button>
          <button onClick={() => { if (confirm('Excluir este processo?')) { deleteProcess(process.id); onNavigate('Painel'); } }}
            className="bg-red-950/20 hover:bg-red-900/40 text-red-400 border border-red-800/30 text-xs px-3 py-1.5 rounded-lg transition cursor-pointer">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* CONTAGEM DCMG — campo manual destacado */}
      <div className="bg-indigo-950/20 border border-indigo-800/40 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex items-center gap-2.5">
          <Activity className="text-indigo-400 shrink-0" size={20} />
          <div>
            <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Contagem DCMG</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Dias conforme sistema DCMG — atualizar manualmente</p>
          </div>
        </div>
        <div className="flex items-center gap-3 md:ml-auto">
          <input
            type="number"
            value={contagemDCMG}
            min={0}
            onChange={e => setContagemDCMG(Number(e.target.value))}
            onBlur={e => saveDCMG(Number(e.target.value))}
            className="w-24 bg-slate-950 border border-indigo-800/60 rounded-lg px-3 py-2 text-white font-mono text-xl text-center focus:outline-none focus:border-indigo-500"
          />
          <span className="text-slate-400 text-sm">dias</span>
          {dcmgStatus && (
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${dcmgStatus.cls}`}>
              {dcmgStatus.label}
            </span>
          )}
        </div>
        {contagemDCMG >= 60 && (
          <p className="text-[10px] text-indigo-300 md:ml-2">
            {contagemDCMG >= 90 ? '⚠ Prazo avançado — verificar andamento com técnico.' : '⚡ Atenção ao prazo de análise.'}
          </p>
        )}
      </div>

      {/* Barra de progresso */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Progresso do fluxo</span>
          <span className={`font-bold ${flowProgress === 100 ? 'text-emerald-400' : 'text-slate-300'}`}>{flowDone}/{flowKeys.length} passos ({flowProgress}%)</span>
        </div>
        <div className="bg-slate-800 rounded-full h-1.5">
          <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${flowProgress}%` }} />
        </div>
      </div>

      {/* FASE 1 — Triagem e Conferência */}
      <div className="bg-slate-900/30 border border-slate-800/60 rounded-xl overflow-hidden">
        <div className="border-b border-slate-800/60">
          <PhaseHeader num={1} label="Triagem e Conferência Documental"
            done={[flowBools.pendenciasNotificadas].filter(Boolean).length + checklist.filter(c => c.status === 'SIM' || c.status === 'NÃO SE APLICA').length}
            total={1 + checklist.length} collapsed={!!collapsed[1]} onToggle={() => toggleCollapse(1)} />
        </div>
        {!collapsed[1] && (
          <div className="p-4 space-y-5">
            {/* Intervenções */}
            <div>
              <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Tipos de Intervenção Requeridos</h4>
              <div className="space-y-1.5 bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                {aiaInterventionsList.map(int => (
                  <div key={int} className="flex items-start gap-2">
                    <input type="checkbox" id={int} checked={intervencoes.includes(int)}
                      onChange={e => {
                        if (e.target.checked) setIntervencoes(prev => [...prev, int]);
                        else setIntervencoes(prev => prev.filter(i => i !== int));
                      }}
                      className="w-4 h-4 rounded accent-emerald-500 mt-0.5 shrink-0" />
                    <label htmlFor={int} className="text-xs text-slate-300 cursor-pointer select-none leading-tight">{int}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Empreendimento / responsável técnico */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Empreendimento / Fazenda</label>
                <input type="text" value={process.requerente} readOnly
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-400 text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Responsável Técnico</label>
                <input type="text" value={responsavelTecnico} onChange={e => setResponsavelTecnico(e.target.value)} onBlur={() => handleSave(true)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-slate-600" />
              </div>
            </div>

            {/* Documentos SEI / Parser */}
            <div>
              <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Árvore de Documentos SEI (para matcher inteligente)</h4>
              <textarea value={documentosColados} onChange={e => setDocumentosColados(e.target.value)}
                placeholder="Cole aqui a lista de documentos do SEI no formato: Nome do Documento (NÚMERO_SEI)"
                className="w-full h-28 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 font-mono focus:outline-none focus:border-slate-600" />
              <div className="flex justify-end mt-2">
                <button onClick={handleParseSEI}
                  className="bg-sky-700 hover:bg-sky-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition">
                  <RefreshCw size={13} /> Processar SEI
                </button>
              </div>
            </div>

            {/* Checklist 19 itens */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Conferência Documental (Res. 3102/2021)</h4>
                <div className="flex gap-2">
                  <button onClick={() => setChecklist(checklist.map(i => ({ ...i, status: 'NÃO SE APLICA' as const })))}
                    className="text-[10px] text-slate-400 hover:text-white">Marcar todos N/A</button>
                  <button onClick={() => setChecklist(checklist.map(i => ({ ...i, status: 'SIM' as const })))}
                    className="text-[10px] text-slate-400 hover:text-white ml-2">Marcar todos SIM</button>
                </div>
              </div>
              <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
                {checklist.map((item, idx) => (
                  <div key={item.id} className="p-2.5 bg-slate-950/50 border border-slate-800/60 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
                    <div className="space-y-0.5 md:max-w-[55%]">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-slate-800 text-slate-300 font-bold px-1.5 py-0.5 rounded text-[9px]">{item.id}</span>
                        <strong className="text-white text-xs leading-tight">{item.description}</strong>
                      </div>
                      {item.fundamento && <p className="text-[10px] text-slate-500 italic">{item.fundamento}</p>}
                      {item.docVinculado && <p className="text-sky-400 font-semibold text-[10px]">SEI: {item.docVinculado}</p>}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <div className="flex rounded overflow-hidden border border-slate-800">
                        {(['SIM', 'NÃO', 'A VERIFICAR', 'NÃO SE APLICA'] as const).map(st => (
                          <button key={st} type="button"
                            onClick={() => { const u = [...checklist]; u[idx].status = st; setChecklist(u); }}
                            className={`px-1.5 py-0.5 text-[9px] font-bold transition ${item.status === st
                              ? st === 'SIM' ? 'bg-emerald-600 text-white'
                              : st === 'NÃO' ? 'bg-red-600 text-white'
                              : st === 'A VERIFICAR' ? 'bg-yellow-600 text-white'
                              : 'bg-slate-700 text-white'
                              : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}>
                            {st === 'NÃO SE APLICA' ? 'N/A' : st}
                          </button>
                        ))}
                      </div>
                      <input type="text" value={item.observacao}
                        onChange={e => { const u = [...checklist]; u[idx].observacao = e.target.value; setChecklist(u); }}
                        placeholder="obs..."
                        className="bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-white text-[10px] w-32 focus:outline-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step de pendências */}
            <div className="pt-2 border-t border-slate-800">
              <FlowStep
                label="Pendências identificadas e notificadas ao requerente (se houver)"
                note={`Lei 14.184/2002 — prazo de resposta: 30 dias. ${pendencias.length > 0 ? `${pendencias.length} item(ns) pendente(s) no checklist.` : 'Sem pendências no checklist.'}`}
                checked={flowBools.pendenciasNotificadas}
                onChange={() => toggleFlow('pendenciasNotificadas')}
              />
            </div>
          </div>
        )}
      </div>

      {/* FASE 2 — Instrução no SEI */}
      <div className="bg-slate-900/30 border border-slate-800/60 rounded-xl overflow-hidden">
        <div className="border-b border-slate-800/60">
          <PhaseHeader num={2} label="Instrução no SEI"
            done={['despachoInstrucaoCriado', 'memorandoAnalistaCriado', 'encaminhadoAnalise'].filter(k => flowBools[k]).length}
            total={3} collapsed={!!collapsed[2]} onToggle={() => toggleCollapse(2)} />
        </div>
        {!collapsed[2] && (
          <div className="p-4 space-y-3">
            <p className="text-[10px] text-slate-500">Após conferência aprovada — criar documentos no SEI e distribuir para análise técnica.</p>

            {/* Pendências no SEI */}
            {pendencias.length > 0 && (
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
                <p className="text-slate-400 font-semibold">Itens pendentes a notificar (Ofício ou Despacho no SEI):</p>
                {pendencias.map(c => <p key={c.id} className="text-amber-300 text-[10px]">• {c.description} {c.fundamento ? `— ${c.fundamento}` : ''}</p>)}
              </div>
            )}

            <FlowStep label="Despacho de aceite/instrução criado no SEI"
              note="Modelo favorito: Despacho de Aceite Documental de AIA"
              checked={flowBools.despachoInstrucaoCriado} onChange={() => toggleFlow('despachoInstrucaoCriado')} />

            <FlowStep label={`Memorando para analista técnico (${responsavelTecnico || 'Paulo'}) criado no SEI`}
              note="Modelo favorito: Memorando de Encaminhamento Técnico de AIA"
              checked={flowBools.memorandoAnalistaCriado} onChange={() => toggleFlow('memorandoAnalistaCriado')} />

            <FlowStep label="Processo encaminhado para análise (Márcio validou)"
              checked={flowBools.encaminhadoAnalise} onChange={() => toggleFlow('encaminhadoAnalise')} />

            {/* Validação da chefia (compacta) */}
            <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 space-y-2">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Validação da Chefia ({settings.chefiaNome})</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Status</label>
                  <select value={process.validacaoChefia}
                    onChange={e => updateProcess(process.id, { validacaoChefia: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-white">
                    <option value="Não precisa">Não precisa</option>
                    <option value="Aguardando chefia">Aguardando chefia</option>
                    <option value="Validado pela chefia">Validado pela chefia</option>
                    <option value="Ajustar minuta">Ajustar minuta</option>
                    <option value="Encaminhar para Supervisão">Encaminhar para Supervisão</option>
                    <option value="Aguardando assinatura da Supervisão">Aguardando assinatura da Supervisão</option>
                    <option value="Retornou assinado">Retornou assinado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Orientação / Notas</label>
                  <input type="text" value={process.chefiaOrientacao}
                    onChange={e => updateProcess(process.id, { chefiaOrientacao: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FASE 3 — Análise Técnica */}
      <div className="bg-slate-900/30 border border-slate-800/60 rounded-xl overflow-hidden">
        <div className="border-b border-slate-800/60">
          <PhaseHeader num={3} label="Análise Técnica"
            done={flowBools.analiseTecnicaConcluida ? 1 : 0}
            total={1} collapsed={!!collapsed[3]} onToggle={() => toggleCollapse(3)} />
        </div>
        {!collapsed[3] && (
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 p-3 bg-indigo-950/15 border border-indigo-900/20 rounded-lg text-[10px] text-indigo-300">
              <Activity size={13} className="shrink-0" />
              <p>Contagem DCMG atual: <strong className={`font-mono ml-1 ${contagemDCMG >= 90 ? 'text-red-400' : contagemDCMG >= 60 ? 'text-amber-400' : 'text-indigo-300'}`}>{contagemDCMG} dias</strong>
              {contagemDCMG > 0 ? ` — atualizar o campo acima conforme o sistema DCMG.` : ' — atualizar o campo DCMG acima.'}</p>
            </div>
            <FlowStep label="Análise técnica concluída pelo analista"
              note="Aguardar retorno do processo com o despacho do analista"
              checked={flowBools.analiseTecnicaConcluida} onChange={() => toggleFlow('analiseTecnicaConcluida')} />
          </div>
        )}
      </div>

      {/* FASE 4 — Finalização */}
      <div className="bg-slate-900/30 border border-slate-800/60 rounded-xl overflow-hidden">
        <div className="border-b border-slate-800/60">
          <PhaseHeader num={4} label="Finalização"
            done={['despachoFinalCriado', 'encaminhadoSistemaDecisoes', 'sinaflorAtualizado'].filter(k => flowBools[k]).length}
            total={3} collapsed={!!collapsed[4]} onToggle={() => toggleCollapse(4)} />
        </div>
        {!collapsed[4] && (
          <div className="p-4 space-y-3">
            <p className="text-[10px] text-slate-500">Após decisão final assinada — encaminhar ao NUREG e arquivar.</p>

            <FlowStep label="Despacho de decisão final criado no SEI"
              checked={flowBools.despachoFinalCriado} onChange={() => toggleFlow('despachoFinalCriado')} />

            <FlowStep label="Encaminhado ao NUREG / Sistema de Decisões (Sara)"
              note="Enviar e-mail para sara.oliveira@meioambiente.mg.gov.br com número SEI e dados da publicação"
              checked={flowBools.encaminhadoSistemaDecisoes} onChange={() => toggleFlow('encaminhadoSistemaDecisoes')} />

            <FlowStep label="SINAFLOR atualizado"
              checked={flowBools.sinaflorAtualizado} onChange={() => toggleFlow('sinaflorAtualizado')} />

            {/* Situação / próxima ação */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Situação</label>
                <input type="text" value={process.situacao}
                  onChange={e => updateProcess(process.id, { situacao: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Próxima ação</label>
                <input type="text" value={process.proximaAcao}
                  onChange={e => updateProcess(process.id, { proximaAcao: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-white" />
              </div>
            </div>

            {/* Controles de encerramento */}
            <div className="pt-3 border-t border-slate-800/60 space-y-2.5">
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
                  <option value="Intervenção ambiental finalizada">Intervenção ambiental finalizada</option>
                  <option value="Indeferido tributário">Indeferido tributário</option>
                  <option value="Acompanhamento de medidas compensatórias">Acompanhamento de medidas compensatórias</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
              <p className="text-[10px] text-slate-600 italic">Processo finalizado não deve ficar em acompanhamento especial. Remover da fila ativa e inserir em bloco interno.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
