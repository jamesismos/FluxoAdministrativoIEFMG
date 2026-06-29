'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { Process } from '../types';
import { AlertCircle, Clock, CheckCircle2, FileText, UserCheck, ShieldAlert, Award, FileSpreadsheet } from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: string, processId?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { processes, settings } = useApp();

  // Metrics calculation
  const newProcesses = processes.filter(p => p.situacao.toLowerCase().includes('novo') || p.situacao.toLowerCase().includes('criado'));
  const waitingCheck = processes.filter(p => p.situacao.toLowerCase().includes('conferência') || p.situacao.toLowerCase().includes('documental'));
  const waitingTech = processes.filter(p => p.situacao.toLowerCase().includes('técnica') || p.situacao.toLowerCase().includes('técnico') || p.situacao.toLowerCase().includes('análise'));
  const waitingSign = processes.filter(p => p.validacaoChefia === 'Aguardando assinatura da Supervisão' || p.situacao.toLowerCase().includes('assinatura'));
  const waitingIntimacao = processes.filter(p => p.situacao.toLowerCase().includes('intimação') || p.situacao.toLowerCase().includes('prazo') || p.situacao.toLowerCase().includes('notificação'));
  const toFinalize = processes.filter(p => p.situacao.toLowerCase().includes('cadastrar') || p.situacao.toLowerCase().includes('homologado') || (p.isFinalized && !p.blocoInterno));
  const waitingChefia = processes.filter(p => p.validacaoChefia === 'Aguardando chefia' || p.validacaoChefia === 'Ajustar minuta');

  // Month-end calculation (finalized in current month)
  const currentMonth = new Date().toISOString().substring(0, 7); // "YYYY-MM"
  const finalizedThisMonth = processes.filter(p => p.isFinalized && p.dataEntrada.startsWith(currentMonth));

  // "Hoje eu preciso olhar" items
  const acompanhamentoEspecial = processes.filter(p => p.emAcompanhamentoEspecial);
  
  // Late processes (older than 20 days and not finalized)
  const isLate = (dateStr: string) => {
    const entryDate = new Date(dateStr);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - entryDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 20;
  };
  const lateProcesses = processes.filter(p => !p.isFinalized && isLate(p.dataEntrada));

  // Finalized processes not in an internal block
  const finalizedWithoutBlock = processes.filter(p => p.isFinalized && !p.blocoInterno);

  const getUrgencyClass = (p: Process) => {
    if (isLate(p.dataEntrada)) return 'border-l-4 border-red-500 bg-red-950/10 hover:bg-red-950/20';
    if (p.validacaoChefia === 'Ajustar minuta') return 'border-l-4 border-amber-500 bg-amber-950/10 hover:bg-amber-950/20';
    return 'border-l-4 border-emerald-500 bg-slate-900/40 hover:bg-slate-900/60';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Painel Geral</h1>
        <p className="text-slate-400 text-sm">Resumo da unidade local: {settings.nomeUnidade}. Servidor ativo: {settings.servidorPadrao}. Chefia: {settings.chefiaNome}.</p>
      </div>

      {/* Grid of indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Processos Novos */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Processos Novos</p>
            <h3 className="text-2xl font-bold text-white mt-1">{newProcesses.length}</h3>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
            <FileText size={20} />
          </div>
        </div>

        {/* Aguardando Conferência */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Na Triagem</p>
            <h3 className="text-2xl font-bold text-white mt-1">{waitingCheck.length}</h3>
          </div>
          <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-400">
            <Clock size={20} />
          </div>
        </div>

        {/* Aguardando Validação Chefia */}
        <button 
          onClick={() => onNavigate('Validação da Chefia')}
          className="text-left bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:bg-slate-800/80 transition"
        >
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Aguardando Márcio</p>
            <h3 className="text-2xl font-bold text-amber-400 mt-1">{waitingChefia.length}</h3>
          </div>
          <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
            <UserCheck size={20} />
          </div>
        </button>

        {/* Fechamento Mensal */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Finalizados no Mês</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">{finalizedThisMonth.length}</h3>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Award size={20} />
          </div>
        </div>
      </div>

      {/* Grid of secondary statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/40 border border-slate-800/60 p-3 rounded-lg flex items-center gap-3">
          <div className="text-indigo-400"><Clock size={16} /></div>
          <div>
            <span className="text-slate-400 text-xs">Aguardando Análise Técnica:</span>
            <strong className="text-white text-sm ml-2">{waitingTech.length}</strong>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/60 p-3 rounded-lg flex items-center gap-3">
          <div className="text-teal-400"><FileText size={16} /></div>
          <div>
            <span className="text-slate-400 text-xs">Aguardando Assinatura:</span>
            <strong className="text-white text-sm ml-2">{waitingSign.length}</strong>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/60 p-3 rounded-lg flex items-center gap-3">
          <div className="text-purple-400"><AlertCircle size={16} /></div>
          <div>
            <span className="text-slate-400 text-xs">Aguardando Resposta/Intimação:</span>
            <strong className="text-white text-sm ml-2">{waitingIntimacao.length}</strong>
          </div>
        </div>
      </div>

      {/* Section "Hoje eu preciso olhar" */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-amber-500" size={20} />
            <h2 className="text-lg font-bold text-white">Hoje eu preciso olhar</h2>
          </div>
          <span className="text-slate-400 text-xs">Controle diário de rotinas operacionais</span>
        </div>

        {acompanhamentoEspecial.length === 0 && lateProcesses.length === 0 && finalizedWithoutBlock.length === 0 ? (
          <div className="py-6 text-center text-slate-500">
            <CheckCircle2 size={32} className="mx-auto text-emerald-500/40 mb-2" />
            <p>Nenhuma pendência crítica ou ação urgente para hoje. Bom trabalho!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* 1. Lates */}
            {lateProcesses.map(p => (
              <div 
                key={p.id} 
                className={`p-3 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 transition ${getUrgencyClass(p)}`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">PRAZO CRÍTICO (+20 dias)</span>
                    <strong className="text-white text-sm">{p.seiNumber}</strong>
                    <span className="text-slate-400 text-xs">({p.requerente})</span>
                  </div>
                  <p className="text-slate-300 text-xs">Município: <span className="font-semibold">{p.municipio}</span> | Tipo: <span className="font-semibold">{p.type}</span> | Data entrada: <span className="font-mono">{p.dataEntrada}</span></p>
                  <p className="text-slate-400 text-xs">Próxima ação: <span className="text-yellow-400">{p.proximaAcao}</span></p>
                </div>
                <button 
                  onClick={() => onNavigate(p.type === 'AIA' ? 'AIA — Intervenção Ambiental' : p.type === 'DCF' ? 'DCF' : 'Simples Declaração', p.id)}
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition self-start md:self-auto font-medium"
                >
                  Abrir Fluxo
                </button>
              </div>
            ))}

            {/* 2. Finalized without block */}
            {finalizedWithoutBlock.map(p => (
              <div 
                key={p.id} 
                className="p-3 rounded-lg border-l-4 border-amber-500 bg-amber-950/10 hover:bg-amber-950/20 flex flex-col md:flex-row md:items-center justify-between gap-3 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">FINALIZADO FORA DE BLOCO</span>
                    <strong className="text-white text-sm">{p.seiNumber}</strong>
                    <span className="text-slate-400 text-xs">({p.requerente})</span>
                  </div>
                  <p className="text-slate-300 text-xs">Alerta de fluxo: <span className="text-amber-300">Processo finalizado não deve ficar em acompanhamento especial. Inserir em bloco interno e concluir.</span></p>
                </div>
                <button 
                  onClick={() => onNavigate('Acompanhamentos e Blocos')}
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition self-start md:self-auto font-medium"
                >
                  Ir para Blocos
                </button>
              </div>
            ))}

            {/* 3. Acompanhamentos especiais */}
            {acompanhamentoEspecial.filter(p => !lateProcesses.some(lp => lp.id === p.id)).map(p => (
              <div 
                key={p.id} 
                className="p-3 rounded-lg border-l-4 border-emerald-500 bg-slate-900/40 hover:bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-3 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{p.acompanhamentoTipo}</span>
                    <strong className="text-white text-sm">{p.seiNumber}</strong>
                    <span className="text-slate-400 text-xs">({p.requerente})</span>
                  </div>
                  <p className="text-slate-300 text-xs">Situação: <span className="text-slate-100">{p.situacao}</span> | Próxima ação: <span className="text-amber-400">{p.proximaAcao}</span></p>
                  {p.chefiaOrientacao && (
                    <p className="text-slate-400 text-xs italic bg-slate-900/60 p-1.5 rounded border border-slate-800 mt-1">Orientação da Chefia ({settings.chefiaNome}): {p.chefiaOrientacao}</p>
                  )}
                </div>
                <button 
                  onClick={() => onNavigate(p.type === 'AIA' ? 'AIA — Intervenção Ambiental' : p.type === 'DCF' ? 'DCF' : 'Simples Declaração', p.id)}
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition self-start md:self-auto font-medium"
                >
                  Gerenciar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grid of operational summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Unidades & DAEs rápidos */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider text-slate-300">Controles Financeiros Rápidos</h3>
            <button 
              onClick={() => onNavigate('Taxas / DAE / Restituição')}
              className="text-xs text-emerald-400 hover:underline"
            >
              Ver tudo
            </button>
          </div>
          <div className="space-y-2 text-xs">
            <p className="text-slate-400">Verifique taxas não localizadas ou pendentes de reembolso na aba financeira. Para cada restituição de taxas, elabore a respectiva declaração tributária utilizando o validador SEF.</p>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between text-slate-300">
              <span>Cabe declaração tributária:</span>
              <span className="font-mono text-emerald-400">Sim</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between text-slate-300">
              <span>Instruir restituição via Res. 1914:</span>
              <span className="font-mono text-emerald-400">Sim</span>
            </div>
          </div>
        </div>

        {/* Veículos e Viagens */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider text-slate-300">Veículos (ASV) e SIAD</h3>
            <button 
              onClick={() => onNavigate('ASV / Veículos')}
              className="text-xs text-emerald-400 hover:underline"
            >
              Ver painel de frotas
            </button>
          </div>
          <div className="space-y-2 text-xs text-slate-300">
            <p className="text-slate-400">Abertura de ASV de saída no SIAD (Atendimento 06):</p>
            <ul className="list-disc pl-4 space-y-1 text-slate-400">
              <li>Tipo 1: Atendimento dentro do município/intermunicipal de rotina.</li>
              <li>Tipo 2: Viagem com veículo de frota.</li>
              <li>Tipo 3: Oficina ou Manutenção periódica.</li>
            </ul>
            <div className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[10px] text-amber-400">
              Lembrete: Registrar km de retorno e horário do fechamento da viagem.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
