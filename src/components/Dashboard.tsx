'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { Process } from '../types';
import { AlertCircle, Clock, CheckCircle2, FileText, UserCheck, ShieldAlert, Award, Trash2, Scale, Activity } from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: string, processId?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { processes, deleteProcess, settings } = useApp();

  const newProcesses = processes.filter(p => p.situacao.toLowerCase().includes('novo') || p.situacao.toLowerCase().includes('criado'));
  const waitingCheck = processes.filter(p => p.situacao.toLowerCase().includes('conferência') || p.situacao.toLowerCase().includes('documental'));
  const waitingTech = processes.filter(p => p.situacao.toLowerCase().includes('técnica') || p.situacao.toLowerCase().includes('técnico') || p.situacao.toLowerCase().includes('análise'));
  const waitingSign = processes.filter(p => p.validacaoChefia === 'Aguardando assinatura da Supervisão' || p.situacao.toLowerCase().includes('assinatura'));
  const waitingIntimacao = processes.filter(p => p.situacao.toLowerCase().includes('intimação') || p.situacao.toLowerCase().includes('prazo') || p.situacao.toLowerCase().includes('notificação'));
  const waitingChefia = processes.filter(p => p.validacaoChefia === 'Aguardando chefia' || p.validacaoChefia === 'Ajustar minuta');

  const currentMonth = new Date().toISOString().substring(0, 7);
  const finalizedThisMonth = processes.filter(p => p.isFinalized && p.dataEntrada.startsWith(currentMonth));

  const acompanhamentoEspecial = processes.filter(p => p.emAcompanhamentoEspecial);

  const isLate = (dateStr: string) => {
    const diffTime = Math.abs(Date.now() - new Date(dateStr).getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) > 20;
  };
  const lateProcesses = processes.filter(p => !p.isFinalized && isLate(p.dataEntrada));
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
        <p className="text-slate-400 text-sm">Resumo: {settings.nomeUnidade} — {settings.servidorPadrao} — Chefia: {settings.chefiaNome}.</p>
      </div>

      {/* Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Processos Novos</p>
            <h3 className="text-2xl font-bold text-white mt-1">{newProcesses.length}</h3>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400"><FileText size={20} /></div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Na Triagem</p>
            <h3 className="text-2xl font-bold text-white mt-1">{waitingCheck.length}</h3>
          </div>
          <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-400"><Clock size={20} /></div>
        </div>
        <button onClick={() => onNavigate('Validação da Chefia')}
          className="text-left bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:bg-slate-800/80 transition">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Aguardando Márcio</p>
            <h3 className="text-2xl font-bold text-amber-400 mt-1">{waitingChefia.length}</h3>
          </div>
          <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400"><UserCheck size={20} /></div>
        </button>
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Finalizados no Mês</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">{finalizedThisMonth.length}</h3>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400"><Award size={20} /></div>
        </div>
      </div>

      {/* Secundários */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/40 border border-slate-800/60 p-3 rounded-lg flex items-center gap-3">
          <div className="text-indigo-400"><Clock size={16} /></div>
          <div><span className="text-slate-400 text-xs">Aguardando Análise Técnica:</span><strong className="text-white text-sm ml-2">{waitingTech.length}</strong></div>
        </div>
        <div className="bg-slate-900/40 border border-slate-800/60 p-3 rounded-lg flex items-center gap-3">
          <div className="text-teal-400"><FileText size={16} /></div>
          <div><span className="text-slate-400 text-xs">Aguardando Assinatura:</span><strong className="text-white text-sm ml-2">{waitingSign.length}</strong></div>
        </div>
        <div className="bg-slate-900/40 border border-slate-800/60 p-3 rounded-lg flex items-center gap-3">
          <div className="text-purple-400"><AlertCircle size={16} /></div>
          <div><span className="text-slate-400 text-xs">Aguardando Resposta/Intimação:</span><strong className="text-white text-sm ml-2">{waitingIntimacao.length}</strong></div>
        </div>
      </div>

      {/* Hoje eu preciso olhar */}
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
            {lateProcesses.map(p => (
              <div key={p.id} className={`p-3 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 transition ${getUrgencyClass(p)}`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">PRAZO CRÍTICO (+20 dias)</span>
                    <strong className="text-white text-sm">{p.seiNumber}</strong>
                    <span className="text-slate-400 text-xs">({p.requerente})</span>
                  </div>
                  <p className="text-slate-300 text-xs">Município: <span className="font-semibold">{p.municipio}</span> | Tipo: <span className="font-semibold">{p.type}</span> | Entrada: <span className="font-mono">{p.dataEntrada}</span></p>
                  <p className="text-slate-400 text-xs">Próxima ação: <span className="text-yellow-400">{p.proximaAcao}</span></p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => onNavigate(p.type === 'AIA' ? 'AIA — Intervenção Ambiental' : p.type === 'DCF' ? 'DCF' : 'Simples Declaração', p.id)}
                    className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition font-medium cursor-pointer">
                    Abrir Fluxo
                  </button>
                  <button onClick={() => { if (confirm('Excluir este processo?')) { deleteProcess(p.id); } }}
                    className="hover:bg-red-900/40 text-red-400 border border-red-800/30 text-xs px-3 py-1.5 rounded-lg transition cursor-pointer">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}

            {finalizedWithoutBlock.map(p => (
              <div key={p.id} className="p-3 rounded-lg border-l-4 border-amber-500 bg-amber-950/10 hover:bg-amber-950/20 flex flex-col md:flex-row md:items-center justify-between gap-3 transition">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">FINALIZADO FORA DE BLOCO</span>
                    <strong className="text-white text-sm">{p.seiNumber}</strong>
                    <span className="text-slate-400 text-xs">({p.requerente})</span>
                  </div>
                  <p className="text-slate-300 text-xs">Alerta: <span className="text-amber-300">Processo finalizado sem bloco interno. Inserir em bloco e concluir.</span></p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => onNavigate('Acompanhamentos e Blocos')}
                    className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition font-medium cursor-pointer">
                    Ir para Blocos
                  </button>
                  <button onClick={() => { if (confirm('Excluir este processo?')) { deleteProcess(p.id); } }}
                    className="hover:bg-red-900/40 text-red-400 border border-red-800/30 text-xs px-3 py-1.5 rounded-lg transition cursor-pointer">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}

            {acompanhamentoEspecial.filter(p => !lateProcesses.some(lp => lp.id === p.id)).map(p => (
              <div key={p.id} className="p-3 rounded-lg border-l-4 border-emerald-500 bg-slate-900/40 hover:bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-3 transition">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{p.acompanhamentoTipo}</span>
                    <strong className="text-white text-sm">{p.seiNumber}</strong>
                    <span className="text-slate-400 text-xs">({p.requerente})</span>
                  </div>
                  <p className="text-slate-300 text-xs">Situação: <span className="text-slate-100">{p.situacao}</span> | Próxima ação: <span className="text-amber-400">{p.proximaAcao}</span></p>
                  {p.chefiaOrientacao && (
                    <p className="text-slate-400 text-xs italic bg-slate-900/60 p-1.5 rounded border border-slate-800 mt-1">Orientação ({settings.chefiaNome}): {p.chefiaOrientacao}</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => onNavigate(p.type === 'AIA' ? 'AIA — Intervenção Ambiental' : p.type === 'DCF' ? 'DCF' : 'Simples Declaração', p.id)}
                    className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition font-medium cursor-pointer">
                    Gerenciar
                  </button>
                  <button onClick={() => { if (confirm('Excluir este processo?')) { deleteProcess(p.id); } }}
                    className="hover:bg-red-900/40 text-red-400 border border-red-800/30 text-xs px-3 py-1.5 rounded-lg transition cursor-pointer">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prazos Legais */}
      {(() => {
        const hoje = Date.now();
        const diffDias = (dateStr: string) => Math.ceil((hoje - new Date(dateStr).getTime()) / 86400000);

        const aiasSemTriagem = processes.filter(p =>
          p.type === 'AIA' && !p.isFinalized &&
          diffDias(p.dataEntrada) > 5 &&
          (p.aiaData?.checklist ?? []).every(c => c.status === 'A VERIFICAR')
        );
        const aiasContagemAlerta = processes.filter(p =>
          p.type === 'AIA' && !p.isFinalized && (p.aiaData?.contagemDCMG ?? 0) >= 60
        );
        const dcfSdAtrasados30 = processes.filter(p =>
          (p.type === 'DCF' || p.type === 'Simples Declaração') &&
          !p.isFinalized && p.dataFormalizacao && diffDias(p.dataFormalizacao) > 30
        );
        const aiasAtrasadas180 = processes.filter(p =>
          p.type === 'AIA' &&
          !p.isFinalized && p.dataFormalizacao && diffDias(p.dataFormalizacao) > 180
        );
        const hasAlerts = aiasSemTriagem.length > 0 || 
                          aiasContagemAlerta.length > 0 || 
                          dcfSdAtrasados30.length > 0 || 
                          aiasAtrasadas180.length > 0;

        return (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Scale className="text-indigo-400" size={18} />
              <h2 className="text-sm font-bold text-white">Prazos Legais</h2>
              <span className="text-slate-500 text-xs ml-1">— Lei 14.184/2002 & Decreto 47.749/2019</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[10px]">
              <div className="bg-slate-950/60 p-2 rounded border border-slate-800 text-slate-400">
                <strong className="text-slate-300 block">DCF & Simples Declaração</strong>
                Prazo legal de 30 dias após formalização / aceite — Lei 14.184/2002
              </div>
              <div className="bg-slate-950/60 p-2 rounded border border-slate-800 text-slate-400">
                <strong className="text-slate-300 block">AIA / Supressão (Análise)</strong>
                Prazo de 180 dias após formalização / aceite — Decreto 47.749/2019
              </div>
              <div className="bg-slate-950/60 p-2 rounded border border-slate-800 text-slate-400">
                <strong className="text-slate-300 block">Triagem & DCMG</strong>
                Triagem em 5d úteis da Entrada · DCMG (atenção 60d)
              </div>
            </div>

            {!hasAlerts ? (
              <div className="py-4 text-center text-slate-500 text-xs">
                <CheckCircle2 size={24} className="mx-auto text-emerald-500/40 mb-2" />
                Nenhum alerta legal pendente.
              </div>
            ) : (
              <div className="space-y-2">
                {aiasSemTriagem.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-2.5 bg-amber-950/15 border border-amber-800/30 rounded-lg text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-500/20 text-amber-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">AIA sem triagem</span>
                        <strong className="text-white font-mono">{p.seiNumber}</strong>
                        <span className="text-slate-400">{p.requerente}</span>
                      </div>
                      <p className="text-slate-400 text-[10px]">Entrada há {diffDias(p.dataEntrada)} dias — nenhum item do checklist respondido.</p>
                    </div>
                    <button onClick={() => onNavigate('AIA — Intervenção Ambiental', p.id)}
                      className="bg-slate-800 hover:bg-slate-700 text-white text-[10px] px-2.5 py-1 rounded border border-slate-700 transition shrink-0 ml-3 cursor-pointer">
                      Abrir
                    </button>
                  </div>
                ))}

                {aiasContagemAlerta.map(p => {
                  const dcmg = p.aiaData?.contagemDCMG ?? 0;
                  const critico = dcmg >= 90;
                  return (
                    <div key={p.id} className={`flex items-center justify-between p-2.5 border rounded-lg text-xs ${
                      critico ? 'bg-red-950/15 border-red-800/30' : 'bg-amber-950/15 border-amber-800/30'
                    }`}>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Activity size={11} className={critico ? 'text-red-400' : 'text-amber-400'} />
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            critico ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>DCMG {critico ? 'crítico' : 'atenção'}</span>
                          <strong className="text-white font-mono">{p.seiNumber}</strong>
                          <span className="text-slate-400">{p.requerente}</span>
                        </div>
                        <p className="text-slate-400 text-[10px]">Contagem DCMG: <strong className={critico ? 'text-red-400' : 'text-amber-400'}>{dcmg} dias</strong></p>
                      </div>
                      <button onClick={() => onNavigate('AIA — Intervenção Ambiental', p.id)}
                        className="bg-slate-800 hover:bg-slate-700 text-white text-[10px] px-2.5 py-1 rounded border border-slate-700 transition shrink-0 ml-3 cursor-pointer">
                        Abrir
                      </button>
                    </div>
                  );
                })}

                {dcfSdAtrasados30.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-2.5 bg-red-950/10 border border-red-800/20 rounded-lg text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="bg-red-500/20 text-red-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">DCF/SD +30 dias</span>
                        <strong className="text-white font-mono">{p.seiNumber}</strong>
                        <span className="text-slate-400">{p.requerente}</span>
                      </div>
                      <p className="text-slate-400 text-[10px]">Formalizado há {p.dataFormalizacao ? diffDias(p.dataFormalizacao) : 0} dias (Entrada em {p.dataEntrada}) — prazo legal para conclusão da DCF/SD (30 dias) vencido.</p>
                    </div>
                    <button onClick={() => onNavigate(p.type === 'DCF' ? 'DCF' : 'Simples Declaração', p.id)}
                      className="bg-slate-800 hover:bg-slate-700 text-white text-[10px] px-2.5 py-1 rounded border border-slate-700 transition shrink-0 ml-3 cursor-pointer">
                      Abrir
                    </button>
                  </div>
                ))}

                {aiasAtrasadas180.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-2.5 bg-red-950/10 border border-red-800/20 rounded-lg text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="bg-red-500/20 text-red-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">AIA +180 dias</span>
                        <strong className="text-white font-mono">{p.seiNumber}</strong>
                        <span className="text-slate-400">{p.requerente}</span>
                      </div>
                      <p className="text-slate-400 text-[10px]">Formalizado há {p.dataFormalizacao ? diffDias(p.dataFormalizacao) : 0} dias (Entrada em {p.dataEntrada}) — prazo legal para análise da AIA (180 dias) vencido.</p>
                    </div>
                    <button onClick={() => onNavigate('AIA — Intervenção Ambiental', p.id)}
                      className="bg-slate-800 hover:bg-slate-700 text-white text-[10px] px-2.5 py-1 rounded border border-slate-700 transition shrink-0 ml-3 cursor-pointer">
                      Abrir
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* Operacional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider text-slate-300">Controles Financeiros Rápidos</h3>
            <button onClick={() => onNavigate('Taxas / DAE / Restituição')} className="text-xs text-emerald-400 hover:underline">Ver tudo</button>
          </div>
          <div className="space-y-2 text-xs">
            <p className="text-slate-400">Verifique taxas não localizadas ou pendentes de reembolso na aba financeira. Para cada restituição, elabore declaração tributária no validador SEF.</p>
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
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider text-slate-300">Veículos (ASV) e SIAD</h3>
            <button onClick={() => onNavigate('ASV / Veículos')} className="text-xs text-emerald-400 hover:underline">Ver painel de frotas</button>
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
