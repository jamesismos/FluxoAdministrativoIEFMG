'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { FileSpreadsheet, Save, Trash2, PlusCircle, Clock, AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface DcfProps {
  activeProcessId: string | null;
  onNavigate: (tab: string, processId?: string) => void;
}

// Componente de step do fluxo
function FlowStep({ label, note, checked, onChange }: {
  label: string; note?: string; checked: boolean; onChange: () => void;
}) {
  return (
    <label className={`flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition select-none ${
      checked
        ? 'bg-emerald-950/25 border border-emerald-900/30'
        : 'bg-slate-900/20 border border-slate-800/40 hover:bg-slate-900/40'
    }`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 w-4 h-4 accent-emerald-500 shrink-0 cursor-pointer"
      />
      <div className="min-w-0 flex-1">
        <p className={`text-xs font-semibold leading-tight ${checked ? 'text-emerald-300 line-through opacity-60' : 'text-slate-200'}`}>
          {label}
        </p>
        {note && <p className="text-[10px] text-slate-500 mt-0.5">{note}</p>}
      </div>
      {checked && <CheckCircle2 size={13} className="text-emerald-500 shrink-0 ml-auto mt-0.5" />}
    </label>
  );
}

// Cabeçalho de fase com progresso e colapso
function PhaseHeader({ num, label, done, total, collapsed, onToggle }: {
  num: number; label: string; done: number; total: number; collapsed: boolean; onToggle: () => void;
}) {
  const isComplete = done === total && total > 0;
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

export const Dcf: React.FC<DcfProps> = ({ activeProcessId, onNavigate }) => {
  const { processes, updateProcess, deleteProcess, settings } = useApp();

  const process = processes.find(p => p.id === activeProcessId && p.type === 'DCF');
  const dcfList = processes.filter(p => p.type === 'DCF');

  // Todos os booleanos do fluxo em um único objeto
  const [flow, setFlow] = useState<Record<string, boolean>>({});
  const [produtoDeclarado, setProdutoDeclarado] = useState('');
  const [volumeDeclarado, setVolumeDeclarado] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({ 1: false, 2: false, 3: false });

  // Sincroniza com dados salvos
  useEffect(() => {
    if (process?.dcfData) {
      const d = process.dcfData;
      setFlow({
        conferidoFormulario: d.conferidoFormulario ?? false,
        conferidoArquivosDigitais: d.conferidoArquivosDigitais ?? false,
        conferidoCadastroPlantio: d.conferidoCadastroPlantio ?? false,
        conferidoDaeTaxaFlorestal: d.conferidoDaeTaxaFlorestal ?? false,
        conferidoDaeExpediente: d.conferidoDaeExpediente ?? false,
        conferidoComprovantes: d.conferidoComprovantes ?? false,
        conferidoTermoCiencia: d.conferidoTermoCiencia ?? false,
        conferidoPlanilhaColheita: d.conferidoPlanilhaColheita ?? false,
        correspondeTaxaVolume: d.correspondeTaxaVolume ?? false,
        termoConcordanciaOutroProprietario: d.termoConcordanciaOutroProprietario ?? false,
        daeAnoAnterior: d.daeAnoAnterior ?? false,
        pagamentoSiteFazendaConfirmado: d.pagamentoSiteFazendaConfirmado ?? false,
        despachoAceiteCriado: d.despachoAceiteCriado ?? false,
        memorandoDistribuicaoCriado: d.memorandoDistribuicaoCriado ?? false,
        encaminhadoAflobio: d.encaminhadoAflobio ?? false,
        emAcompEspecialDCFs: d.emAcompEspecialDCFs ?? false,
        processoConcluidoNAR: d.processoConcluidoNAR ?? false,
        saldoSiamLancado: d.saldoSiamLancado ?? false,
        despachoAvaliacaoCriado: d.despachoAvaliacaoCriado ?? false,
        intimacaoEletronicaCriada: d.intimacaoEletronicaCriada ?? false,
      });
      setProdutoDeclarado(d.produtoDeclarado || '');
      setVolumeDeclarado(d.volumeDeclarado || 0);
    }
  }, [activeProcessId, process?.dcfData]);

  // TELA DE LISTA (quando nenhum processo selecionado)
  if (!process) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Processos DCF</h1>
            <p className="text-slate-400 text-xs mt-0.5">Declarações de Colheita de Florestas — {dcfList.length} cadastrada(s)</p>
          </div>
          <button
            onClick={() => onNavigate('Entrada / Triagem')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
          >
            <PlusCircle size={14} /> Nova DCF
          </button>
        </div>

        {dcfList.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <FileSpreadsheet size={48} className="mx-auto text-slate-700 mb-3" />
            <h2 className="text-lg font-bold text-white">Nenhum Processo DCF Cadastrado</h2>
            <p className="text-sm mt-1">Crie um novo processo de Declaração de Colheita na Triagem.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {dcfList.map(p => {
              const dias = Math.ceil((Date.now() - new Date(p.dataEntrada).getTime()) / 86400000);
              const isLate = dias > 20 && !p.isFinalized;
              // Progresso
              const d = p.dcfData;
              const steps = [
                d?.conferidoFormulario, d?.conferidoArquivosDigitais, d?.conferidoCadastroPlantio,
                d?.conferidoDaeTaxaFlorestal, d?.conferidoDaeExpediente, d?.conferidoComprovantes,
                d?.conferidoTermoCiencia, d?.conferidoPlanilhaColheita, d?.correspondeTaxaVolume,
                d?.pagamentoSiteFazendaConfirmado, d?.despachoAceiteCriado, d?.memorandoDistribuicaoCriado,
                d?.emAcompEspecialDCFs, d?.processoConcluidoNAR, d?.saldoSiamLancado,
                d?.despachoAvaliacaoCriado, d?.intimacaoEletronicaCriada
              ];
              const done = steps.filter(Boolean).length;
              const prog = Math.round((done / steps.length) * 100);
              return (
                <div
                  key={p.id}
                  className={`p-3 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-3 transition ${
                    p.isFinalized ? 'border-slate-800 bg-slate-900/20 opacity-60'
                      : isLate ? 'border-red-800/50 bg-red-950/10'
                      : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {p.isFinalized && <span className="bg-slate-700 text-slate-300 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Finalizado</span>}
                      {isLate && <span className="bg-red-500/20 text-red-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase flex items-center gap-1"><Clock size={9} /> {dias}d</span>}
                      {p.emAcompanhamentoEspecial && !p.isFinalized && <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Ativo</span>}
                      <strong className="text-white text-sm font-mono">{p.seiNumber}</strong>
                      <span className="text-slate-400 text-xs">{p.requerente}</span>
                    </div>
                    <p className="text-slate-400 text-xs">{p.municipio} | Entrada: <span className="font-mono">{p.dataEntrada}</span></p>
                    {/* Progress bar inline */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-800 rounded-full h-1">
                        <div className="bg-emerald-600 h-1 rounded-full" style={{ width: `${prog}%` }} />
                      </div>
                      <span className="text-[10px] text-slate-500 shrink-0">{prog}%</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => onNavigate('DCF', p.id)}
                      className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition font-medium cursor-pointer"
                    >
                      Gerenciar
                    </button>
                    <button
                      onClick={() => { if (confirm('Excluir este processo?')) { deleteProcess(p.id); } }}
                      className="bg-red-950/20 hover:bg-red-900/40 text-red-400 border border-red-800/30 text-xs px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                    >
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

  // TELA DE FLUXO (processo selecionado)
  const isAflobio = settings.municipiosAflobioPecanha.includes(process.municipio);

  // Definição dos steps por fase
  const fase1Steps = [
    { key: 'conferidoFormulario', label: 'Formulário DCF assinado pelo declarante' },
    { key: 'conferidoArquivosDigitais', label: 'Croqui / Shapefile do talhão (arquivos digitais)' },
    { key: 'conferidoCadastroPlantio', label: 'Cadastro de plantio ativo/homologado no SIAM' },
    { key: 'conferidoDaeTaxaFlorestal', label: 'DAE de taxa florestal quitado' },
    { key: 'conferidoDaeExpediente', label: 'DAE de expediente quitado' },
    { key: 'conferidoComprovantes', label: 'Comprovantes bancários de arrecadação anexos' },
    { key: 'conferidoTermoCiencia', label: 'Termo de ciência e responsabilidade do declarante' },
    { key: 'conferidoPlanilhaColheita', label: 'Planilha de rendimento da colheita por talhão' },
    { key: 'correspondeTaxaVolume', label: 'Volume e produto correspondem ao DAE pago' },
    { key: 'termoConcordanciaOutroProprietario', label: 'Termo de concordância assinado (se arrendamento/terceiros)' },
    { key: 'daeAnoAnterior', label: 'Verificado DAEs anteriores (evitar reutilização)' },
    { key: 'pagamentoSiteFazendaConfirmado', label: 'Pagamento confirmado no site da Fazenda MG', note: 'fazenda.mg.gov.br → Consulta de DAE' },
  ];

  const fase2StepsBase = [
    { key: 'despachoAceiteCriado', label: 'Despacho de aceite criado no SEI', note: 'Modelo favorito: Despacho de Aceite de DCF' },
    { key: 'memorandoDistribuicaoCriado', label: 'Memorando de distribuição criado no SEI', note: 'Modelo favorito: Memorando de Distribuição de DCF' },
    { key: 'emAcompEspecialDCFs', label: 'Adicionado ao acompanhamento especial "DCFs Ativas"' },
    { key: 'processoConcluidoNAR', label: 'Processo concluído no NAR Guanhães', note: 'Concluir no SEI — aguardar técnico analisar' },
  ];
  const aflobioStep = { key: 'encaminhadoAflobio', label: 'Processo encaminhado para AFLOBIO Peçanha', note: 'Ana Célia faz a análise para municípios AFLOBIO' };
  const fase2Steps = isAflobio
    ? [fase2StepsBase[0], fase2StepsBase[1], aflobioStep, fase2StepsBase[2], fase2StepsBase[3]]
    : fase2StepsBase;

  const fase3Steps = [
    { key: 'saldoSiamLancado', label: 'Saldo lançado no SIAM (pelo técnico)', note: 'Modelo: Despacho Lançamento de Saldo SIAM' },
    { key: 'despachoAvaliacaoCriado', label: 'Despacho de avaliação técnica criado no SEI', note: 'Modelo: Despacho de Avaliação Técnica de DCF' },
    { key: 'intimacaoEletronicaCriada', label: 'Intimação eletrônica enviada ao declarante', note: 'Modelo: Intimação Eletrônica de Ciência' },
  ];

  const todosSteps = [...fase1Steps, ...fase2Steps, ...fase3Steps];
  const totalSteps = todosSteps.length;
  const doneSteps = todosSteps.filter(s => flow[s.key]).length;
  const progress = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;

  const f1Done = fase1Steps.filter(s => flow[s.key]).length;
  const f2Done = fase2Steps.filter(s => flow[s.key]).length;
  const f3Done = fase3Steps.filter(s => flow[s.key]).length;

  // Determina etapa derivada do progresso
  const derivaEtapa = () => {
    if (f3Done > 0) return 'Finalização';
    if (f2Done > 0) return 'Apta';
    if (f1Done > 0) return 'Conferência';
    return 'Entrada';
  };

  const toggleStep = (key: string) => {
    const newFlow = { ...flow, [key]: !flow[key] };
    setFlow(newFlow);
    if (activeProcessId && process.dcfData) {
      updateProcess(activeProcessId, {
        dcfData: {
          ...process.dcfData,
          ...newFlow,
          produtoDeclarado,
          volumeDeclarado,
          etapa: (() => {
            const f1 = fase1Steps.filter(s => newFlow[s.key]).length;
            const f2 = fase2Steps.filter(s => newFlow[s.key]).length;
            const f3 = fase3Steps.filter(s => newFlow[s.key]).length;
            if (f3 > 0) return 'Finalização' as const;
            if (f2 > 0) return 'Apta' as const;
            if (f1 > 0) return 'Conferência' as const;
            return 'Entrada' as const;
          })(),
        }
      });
    }
  };

  const handleSave = () => {
    if (!activeProcessId || !process.dcfData) return;
    updateProcess(activeProcessId, {
      dcfData: {
        ...process.dcfData,
        ...flow,
        produtoDeclarado,
        volumeDeclarado,
        etapa: derivaEtapa(),
      }
    });
    setFeedbackMsg('Salvo!');
    setTimeout(() => setFeedbackMsg(''), 1500);
  };

  const toggleCollapse = (phase: number) => {
    setCollapsed(prev => ({ ...prev, [phase]: !prev[phase] }));
  };

  const dias = Math.ceil((Date.now() - new Date(process.dataEntrada).getTime()) / 86400000);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded font-bold border ${
              process.isFinalized
                ? 'bg-slate-700/30 text-slate-400 border-slate-700/30'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}>
              DCF {process.isFinalized ? '— Finalizado' : '— Ativo'}
            </span>
            <h1 className="text-xl font-bold text-white font-mono">{process.seiNumber}</h1>
            {dias > 20 && !process.isFinalized && (
              <span className="bg-red-500/20 text-red-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase flex items-center gap-1">
                <Clock size={9} /> {dias} dias
              </span>
            )}
          </div>
          <p className="text-slate-400 text-xs mt-1">
            {process.requerente} · {process.municipio} · Entrada: <span className="font-mono">{process.dataEntrada}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {feedbackMsg && <span className="text-emerald-400 text-xs font-semibold">{feedbackMsg}</span>}
          <button onClick={handleSave} className="bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer">
            <Save size={14} /> Salvar
          </button>
          <button onClick={() => { if (confirm('Excluir este processo?')) { deleteProcess(process.id); onNavigate('Painel'); } }}
            className="bg-red-950/20 hover:bg-red-900/40 text-red-400 border border-red-800/30 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Alerta AFLOBIO */}
      {isAflobio && (
        <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-lg flex gap-2.5 text-amber-300 text-xs">
          <AlertCircle className="shrink-0 mt-0.5" size={14} />
          <p><strong>AFLOBIO Peçanha:</strong> Após aceite, encaminhar para Ana Célia realizar a análise técnica.</p>
        </div>
      )}

      {/* Produto / Volume */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Produto Declarado</label>
          <input type="text" value={produtoDeclarado} onChange={e => setProdutoDeclarado(e.target.value)} onBlur={handleSave}
            placeholder="ex: Eucalipto" className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-slate-600" />
        </div>
        <div>
          <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Volume (m³ / st)</label>
          <input type="number" value={volumeDeclarado} onChange={e => setVolumeDeclarado(Number(e.target.value))} onBlur={handleSave}
            className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-slate-600" />
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

      {/* FASE 1 — Conferência Documental */}
      <div className="bg-slate-900/30 border border-slate-800/60 rounded-xl overflow-hidden">
        <div className="border-b border-slate-800/60">
          <PhaseHeader num={1} label="Conferência Documental" done={f1Done} total={fase1Steps.length} collapsed={!!collapsed[1]} onToggle={() => toggleCollapse(1)} />
        </div>
        {!collapsed[1] && (
          <div className="p-3 space-y-1.5">
            {fase1Steps.map(s => (
              <FlowStep key={s.key} label={s.label} note={(s as any).note} checked={!!flow[s.key]} onChange={() => toggleStep(s.key)} />
            ))}
          </div>
        )}
      </div>

      {/* FASE 2 — Aceite e Instrução */}
      <div className="bg-slate-900/30 border border-slate-800/60 rounded-xl overflow-hidden">
        <div className="border-b border-slate-800/60">
          <PhaseHeader num={2} label="Aceite e Instrução no SEI" done={f2Done} total={fase2Steps.length} collapsed={!!collapsed[2]} onToggle={() => toggleCollapse(2)} />
        </div>
        {!collapsed[2] && (
          <div className="p-3 space-y-1.5">
            <p className="text-slate-500 text-[10px] px-1 pb-1">Após conferência documental aprovada — criar documentos no SEI e distribuir para análise técnica.</p>
            {fase2Steps.map(s => (
              <FlowStep key={s.key} label={s.label} note={(s as any).note} checked={!!flow[s.key]} onChange={() => toggleStep(s.key)} />
            ))}
            {/* Recusa (informativo) */}
            <div className="mt-2 p-2.5 bg-red-950/10 border border-red-900/20 rounded-lg text-[10px] text-red-400">
              <strong>Se recusado:</strong> Criar Despacho de Recusa + Comunicação ao declarante (modelos favoritos no SEI). Concluir o processo. Não inserir na planilha DCF Rio Doce.
            </div>
          </div>
        )}
      </div>

      {/* FASE 3 — Finalização */}
      <div className="bg-slate-900/30 border border-slate-800/60 rounded-xl overflow-hidden">
        <div className="border-b border-slate-800/60">
          <PhaseHeader num={3} label="Finalização (após análise técnica)" done={f3Done} total={fase3Steps.length} collapsed={!!collapsed[3]} onToggle={() => toggleCollapse(3)} />
        </div>
        {!collapsed[3] && (
          <div className="p-3 space-y-1.5">
            <p className="text-slate-500 text-[10px] px-1 pb-1">Quando o técnico concluir a análise e lançar saldo no SIAM — finalizar no SEI.</p>
            {fase3Steps.map(s => (
              <FlowStep key={s.key} label={s.label} note={(s as any).note} checked={!!flow[s.key]} onChange={() => toggleStep(s.key)} />
            ))}
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
                  <option value="DCF- Declaração de Colheita de Florestas Plantadas e Produção de Carvão.">DCF — Colheita de Florestas Plantadas</option>
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
