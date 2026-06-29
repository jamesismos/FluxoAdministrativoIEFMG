'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Process } from '../types';
import { UserCheck, Copy, CheckSquare, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';

interface ValidacaoChefiaProps {
  onNavigate: (tab: string, processId?: string) => void;
}

export const ValidacaoChefia: React.FC<ValidacaoChefiaProps> = ({ onNavigate }) => {
  const { processes, updateProcess, settings } = useApp();
  const [activeProcessId, setActiveProcessId] = useState<string | null>(null);
  const [textModelOutput, setTextModelOutput] = useState('');

  const activeProcess = processes.find(p => p.id === activeProcessId);

  // Filter processes that are relevant for the Chefia queue (waiting chefia, adjust template, waiting signature)
  const chefiaQueue = processes.filter(p => 
    p.validacaoChefia === 'Aguardando chefia' || 
    p.validacaoChefia === 'Ajustar minuta' || 
    p.validacaoChefia === 'Aguardando assinatura da Supervisão'
  );

  const handleUpdateStatus = (id: string, status: Process['validacaoChefia'], orientacao = '') => {
    updateProcess(id, { 
      validacaoChefia: status,
      ...(orientacao ? { chefiaOrientacao: orientacao } : {})
    });
    alert(`Status atualizado para: ${status}`);
  };

  const generateChefiaTexts = (type: 1 | 2 | 3 | 4 | 5) => {
    if (!activeProcess) return;
    
    let text = '';
    switch(type) {
      case 1:
        text = `Processo SEI: ${activeProcess.seiNumber}\nAnotação interna:\n"Processo aguardando validação da chefia do núcleo quanto à continuidade da tramitação."`;
        break;
      case 2:
        text = `Processo SEI: ${activeProcess.seiNumber}\nValidação para formalização:\n"Após conferência preliminar, processo validado pela chefia do núcleo para formalização e encaminhamento à análise técnica."`;
        break;
      case 3:
        text = `Processo SEI: ${activeProcess.seiNumber}\nMinuta para decisão:\n"Processo com parecer técnico concluído. Elaborar minuta de decisão e encaminhar para assinatura da Supervisão."`;
        break;
      case 4:
        text = `Processo SEI: ${activeProcess.seiNumber}\nFechamento mensal:\n"Processo com previsão de finalização no mês corrente. Inserir na planilha Gestão Processos AIA, aba do mês correspondente."`;
        break;
      case 5:
        text = `Processo SEI: ${activeProcess.seiNumber}\nProcesso finalizado:\n"Processo finalizado. Atualizar planilha, inserir em bloco interno, retirar do acompanhamento especial e concluir na unidade."`;
        break;
    }
    setTextModelOutput(text);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado para a área de transferência!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Validação da Chefia (Fila do {settings.chefiaNome})</h1>
        <p className="text-slate-400 text-sm">Controle de autorizações, minutas pendentes de revisão e encaminhamentos coordenados pela chefia local do NAR Guanhães.</p>
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fila do Marcio table */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4 text-xs">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-850 pb-2">
            <UserCheck className="text-emerald-400" size={16} />
            Processos Aguardando Validação Administrativa
          </h2>

          {chefiaQueue.length === 0 ? (
            <div className="py-6 text-center text-slate-550">
              <CheckCircle2 size={32} className="mx-auto text-emerald-500/40 mb-2" />
              <p>Nenhum processo pendente na fila do {settings.chefiaNome} hoje!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[9px] tracking-wider">
                    <th className="py-2 pr-2">Processo / SEI</th>
                    <th className="py-2 px-2">Tipo</th>
                    <th className="py-2 px-2">Situação Atual</th>
                    <th className="py-2 px-2">Validacao Chefia</th>
                    <th className="py-2 pl-2 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {chefiaQueue.map(p => (
                    <tr 
                      key={p.id}
                      onClick={() => setActiveProcessId(p.id)}
                      className={`hover:bg-slate-950/40 cursor-pointer transition ${activeProcessId === p.id ? 'bg-slate-900/60 font-semibold' : ''}`}
                    >
                      <td className="py-3 pr-2 font-mono text-slate-100">{p.seiNumber}<p className="text-[10px] text-slate-450 font-sans mt-0.5">{p.requerente}</p></td>
                      <td className="py-3 px-2"><span className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 text-[9px] uppercase">{p.type}</span></td>
                      <td className="py-3 px-2 text-slate-350">{p.situacao.substring(0, 30)}...</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${p.validacaoChefia === 'Aguardando chefia' ? 'bg-amber-950 text-amber-400' : p.validacaoChefia === 'Ajustar minuta' ? 'bg-red-950 text-red-400' : 'bg-blue-950 text-blue-400'}`}>
                          {p.validacaoChefia}
                        </span>
                      </td>
                      <td className="py-3 pl-2 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate(p.type === 'AIA' ? 'AIA — Intervenção Ambiental' : p.type === 'DCF' ? 'DCF' : 'Simples Declaração', p.id);
                          }}
                          className="bg-slate-850 hover:bg-slate-800 text-white text-[10px] px-2 py-1 rounded"
                        >
                          Detalhes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Selected process detail & text generator */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4 text-xs">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-slate-350 border-b border-slate-850 pb-2">
            Ações e Minutas do Chefe
          </h2>

          {activeProcess ? (
            <div className="space-y-4">
              <div className="bg-slate-950 p-3 rounded border border-slate-850 space-y-1.5">
                <p className="font-semibold text-white">{activeProcess.seiNumber}</p>
                <p className="text-slate-450 text-[10px]">Interessado: {activeProcess.requerente}</p>
                <p className="text-slate-300">Orientação Atual: <span className="italic text-slate-400">{activeProcess.chefiaOrientacao || 'Nenhuma cadastrada'}</span></p>
              </div>

              {/* Status Update Actions */}
              <div className="space-y-2">
                <span className="font-semibold text-slate-400 block text-[10px] uppercase">Alterar Validação:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => handleUpdateStatus(activeProcess.id, 'Validado pela chefia', 'Liberado para formalização.')}
                    className="bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/30 py-1.5 rounded font-bold"
                  >
                    Marcar Validado
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(activeProcess.id, 'Ajustar minuta', 'Necessário refazer o despacho de recusa.')}
                    className="bg-red-950 hover:bg-red-900 text-red-400 border border-red-800/30 py-1.5 rounded font-bold"
                  >
                    Precisa Ajustes
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(activeProcess.id, 'Aguardando assinatura da Supervisão')}
                    className="bg-blue-950 hover:bg-blue-900 text-blue-400 border border-blue-800/30 py-1.5 rounded font-bold text-[10px]"
                  >
                    Enviar p/ Assinatura
                  </button>
                  <button 
                    onClick={() => {
                      updateProcess(activeProcess.id, { emAcompanhamentoEspecial: true, acompanhamentoTipo: 'Fila Mensal' });
                      alert('Anotação de planilha mensal gerada!');
                    }}
                    className="bg-purple-950 hover:bg-purple-900 text-purple-400 border border-purple-800/30 py-1.5 rounded font-bold text-[10px]"
                  >
                    Notificar Planilha
                  </button>
                </div>
              </div>

              {/* Chefia standard texts */}
              <div className="space-y-2 border-t border-slate-850 pt-3">
                <span className="font-semibold text-slate-400 block text-[10px] uppercase">Modelos de Textos da Chefia:</span>
                <div className="flex flex-wrap gap-1">
                  {[
                    { label: 'Anotação', val: 1 },
                    { label: 'Formalização', val: 2 },
                    { label: 'Minuta Decisão', val: 3 },
                    { label: 'Fechamento', val: 4 },
                    { label: 'Conclusão', val: 5 }
                  ].map(item => (
                    <button
                      key={item.val}
                      onClick={() => generateChefiaTexts(item.val as any)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded text-[10px]"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {textModelOutput && (
                  <div className="space-y-1.5 mt-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400">Texto Gerado:</span>
                      <button onClick={() => handleCopyToClipboard(textModelOutput)} className="text-sky-400 hover:underline">Copiar</button>
                    </div>
                    <textarea 
                      readOnly 
                      value={textModelOutput} 
                      className="w-full h-24 bg-slate-950 border border-slate-850 rounded p-2 font-mono text-[10px] text-slate-350"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-slate-500 italic">Selecione um processo na tabela ao lado para gerenciar as ações da chefia.</p>
          )}
        </div>
      </div>
    </div>
  );
};
