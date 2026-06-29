'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Process } from '../types';
import { FileText, Check, AlertCircle, Copy, Save } from 'lucide-react';

interface SimplesDeclaracaoProps {
  activeProcessId: string | null;
  onNavigate: (tab: string, processId?: string) => void;
}

export const SimplesDeclaracao: React.FC<SimplesDeclaracaoProps> = ({ activeProcessId, onNavigate }) => {
  const { processes, updateProcess, settings } = useApp();
  const [activeStep, setActiveStep] = useState<'conferencia' | 'finalizacao'>('conferencia');

  const process = processes.find(p => p.id === activeProcessId && p.type === 'Simples Declaração');

  // Local component states
  const [conferidoDocumentos, setConferidoDocumentos] = useState(false);
  const [memorandoTecnico, setMemorandoTecnico] = useState('');
  const [intimacaoEletronica, setIntimacaoEletronica] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Sync state when process changes
  useEffect(() => {
    if (process && process.simplesData) {
      setConferidoDocumentos(process.simplesData.conferidoDocumentos);
      setMemorandoTecnico(process.simplesData.memorandoTecnico || '');
      setIntimacaoEletronica(process.simplesData.intimacaoEletronica || '');
      
      if (process.simplesData.etapa === 'Finalização') {
        setActiveStep('finalizacao');
      } else {
        setActiveStep('conferencia');
      }
    }
  }, [activeProcessId, process]);

  if (!process) {
    return (
      <div className="py-12 text-center text-slate-500">
        <FileText size={48} className="mx-auto text-slate-700 mb-3" />
        <h2 className="text-lg font-bold text-white">Nenhuma Simples Declaração Ativa</h2>
        <p className="text-sm mt-1">Selecione ou crie um processo de Simples Declaração na Triagem.</p>
        <button 
          onClick={() => onNavigate('Entrada / Triagem')}
          className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-lg font-semibold transition"
        >
          Criar Novo Processo
        </button>
      </div>
    );
  }

  const handleSave = (silent = false) => {
    if (!activeProcessId) return;

    updateProcess(activeProcessId, {
      simplesData: {
        etapa: activeStep === 'conferencia' ? 'Conferência' : 'Finalização',
        conferidoDocumentos,
        memorandoTecnico,
        intimacaoEletronica
      }
    });

    if (!silent) {
      setFeedbackMsg('Dados Simples Declaração salvos!');
      setTimeout(() => setFeedbackMsg(''), 2000);
    }
  };

  const generateTexts = () => {
    const dataStr = new Date().toLocaleDateString('pt-BR');
    const ano = new Date().getFullYear();

    const memo = `MEMORANDO Nº ____/${ano} - ${settings.nomeUnidade}

Para: Equipe de Vistoria Técnica
Assunto: Solicitação de vistoria técnica - Simples Declaração
Processo SEI: ${process.seiNumber}
Interessado: ${process.requerente}

1. Encaminhamos o presente processo de Simples Declaração referente à atividade no município de ${process.municipio} para vistoria in loco.
2. Solicita-se a validação das coordenadas indicadas e lavratura do laudo de constatação de limites.

Atenciosamente,
___________________________
${settings.servidorPadrao}`;

    const intimacao = `INTIMAÇÃO ELETRÔNICA — CIÊNCIA DE SIMPLES DECLARAÇÃO

Fica o declarante ${process.requerente} intimado da conclusão da análise da Simples Declaração sob o processo SEI nº ${process.seiNumber}. A atividade declarada encontra-se devidamente registrada perante este NAR Guanhães, nos termos do Decreto Estadual nº 47.749/2019.`;

    setMemorandoTecnico(memo);
    setIntimacaoEletronica(intimacao);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado para a área de transferência!');
  };

  const isFinalizedButInSpecial = process.isFinalized && process.emAcompanhamentoEspecial;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2 py-0.5 rounded font-bold">Simples Declaração</span>
            <h1 className="text-xl font-bold text-white">{process.seiNumber}</h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">Interessado: <span className="font-semibold text-slate-300">{process.requerente}</span> | Município: <span className="font-semibold text-slate-300">{process.municipio}</span></p>
        </div>

        <div className="flex items-center gap-2">
          {feedbackMsg && <span className="text-emerald-400 text-xs font-semibold mr-2">{feedbackMsg}</span>}
          <button 
            onClick={() => handleSave()}
            className="bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
          >
            <Save size={14} />
            Salvar
          </button>
        </div>
      </div>

      {/* Warning constraint */}
      {isFinalizedButInSpecial && (
        <div className="p-3 bg-red-950/20 border border-red-900/50 rounded-lg flex gap-3 text-red-400 text-xs">
          <AlertCircle className="shrink-0 mt-0.5" size={16} />
          <div>
            <span className="font-bold">Violamento de Regra de Fluxo:</span>
            <p className="mt-0.5 text-slate-300">Processo finalizado não deve ficar em acompanhamento especial. Por favor, desmarque a opção "Acompanhamento Especial", insira em bloco interno e conclua o fluxo.</p>
          </div>
        </div>
      )}

      {/* Step Indicator bar */}
      <div className="flex gap-2 border-b border-slate-800 pb-4">
        <button
          onClick={() => setActiveStep('conferencia')}
          className={`py-2 px-3 rounded-lg border text-xs transition ${activeStep === 'conferencia' ? 'bg-slate-900 border-emerald-500 text-emerald-400' : 'bg-slate-900/20 border-slate-800/80 text-slate-400 hover:border-slate-700'}`}
        >
          Etapa 1: Entrada e Conferência
        </button>

        <button
          onClick={() => setActiveStep('finalizacao')}
          className={`py-2 px-3 rounded-lg border text-xs transition ${activeStep === 'finalizacao' ? 'bg-slate-900 border-emerald-500 text-emerald-400' : 'bg-slate-900/20 border-slate-800/80 text-slate-400 hover:border-slate-700'}`}
        >
          Etapa 2: Finalização e Intimação
        </button>
      </div>

      {/* Content */}
      <div className="bg-slate-900/30 border border-slate-800 p-5 rounded-xl text-xs space-y-4">
        {activeStep === 'conferencia' ? (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">Conferência Documental</h3>
            
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="chk-docs-simples" 
                  checked={conferidoDocumentos}
                  onChange={e => setConferidoDocumentos(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-800 bg-slate-900 accent-emerald-500"
                />
                <label htmlFor="chk-docs-simples" className="text-slate-300 font-semibold cursor-pointer">Documentos mínimos e formulário de Simples Declaração anexados e corretos</label>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <button 
                onClick={generateTexts}
                className="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-4 py-2 rounded-lg transition"
              >
                Gerar Textos Operacionais
              </button>
              
              {memorandoTecnico && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleCopyToClipboard(memorandoTecnico)}
                    className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3 py-1.5 rounded flex items-center gap-1.5 transition"
                  >
                    <Copy size={12} /> Copiar Memorando Técnico
                  </button>
                </div>
              )}
            </div>

            {memorandoTecnico && (
              <textarea 
                value={memorandoTecnico} 
                onChange={e => setMemorandoTecnico(e.target.value)}
                className="w-full h-40 bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-300 focus:outline-none" 
              />
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">Conclusão e Intimação de Ciência</h3>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-4">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="final-simples" 
                  checked={process.isFinalized}
                  onChange={e => updateProcess(process.id, { isFinalized: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-850 bg-slate-900 accent-emerald-500"
                />
                <label htmlFor="final-simples" className="text-slate-300 font-semibold cursor-pointer">Marcar processo como FINALIZADO</label>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="ac-special-simples" 
                  checked={process.emAcompanhamentoEspecial}
                  onChange={e => updateProcess(process.id, { emAcompanhamentoEspecial: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-850 bg-slate-900 accent-emerald-500"
                />
                <label htmlFor="ac-special-simples" className="text-slate-300 cursor-pointer">Manter em Acompanhamento Especial (Fila Ativa)</label>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">Mover para Bloco Interno SEI:</span>
                <select 
                  value={process.blocoInterno}
                  onChange={e => updateProcess(process.id, { blocoInterno: e.target.value })}
                  className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-white"
                >
                  <option value="">Nenhum bloco</option>
                  <option value="Simples Declaração finalizada">Simples Declaração finalizada</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <button 
                onClick={generateTexts}
                className="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-4 py-2 rounded-lg transition"
              >
                Gerar Intimação Ciência
              </button>
              
              {intimacaoEletronica && (
                <button 
                  onClick={() => handleCopyToClipboard(intimacaoEletronica)}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3 py-1.5 rounded flex items-center gap-1.5 transition"
                >
                  <Copy size={12} /> Copiar Intimação
                </button>
              )}
            </div>

            {intimacaoEletronica && (
              <textarea 
                value={intimacaoEletronica} 
                onChange={e => setIntimacaoEletronica(e.target.value)}
                className="w-full h-40 bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-300 focus:outline-none" 
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
