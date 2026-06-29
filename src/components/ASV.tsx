'use client';

import React, { useState, useEffect } from 'react';
import { HelpCircle, FileText, Save, Info } from 'lucide-react';

export const ASV: React.FC = () => {
  const [notes, setNotes] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Load saved notes on mount
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem('narflow_v4_asv_notes');
      if (savedNotes) {
        setNotes(savedNotes);
      }
    } catch (e) {
      console.error('Erro ao carregar anotações de ASV', e);
    }
  }, []);

  const handleSaveNotes = () => {
    try {
      localStorage.setItem('narflow_v4_asv_notes', notes);
      setFeedbackMsg('Anotações salvas com sucesso!');
      setTimeout(() => setFeedbackMsg(''), 2000);
    } catch (e) {
      console.error('Erro ao salvar anotações de ASV', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Fluxo de Emissão de ASV</h1>
        <p className="text-slate-400 text-sm">Instruções operacionais para trâmite de Autorização de Saída de Veículo (ASV) e controle de pendências locais.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {/* Step-by-Step SIAD Guide */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4 lg:col-span-2">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <HelpCircle className="text-sky-400" size={16} />
            Passo a Passo Operacional (SIAD e Arquivo)
          </h2>

          <div className="space-y-4 text-slate-350 text-xs leading-relaxed">
            <div className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-slate-850 flex items-center justify-center font-bold text-white shrink-0 text-[10px]">1</span>
              <div>
                <strong className="text-slate-200 block text-xs">Abertura no SIAD:</strong>
                Acesse o terminal <strong className="text-white">pw3270</strong> e entre na aplicação <strong className="text-white">SIAD</strong>. 
                Navegue no menu <strong className="text-white">Atendimento 06</strong> (Gestão de Transportes) e abra a ASV como <strong className="text-slate-200">"Atendimento sem Solicitação"</strong>. 
                Informe a placa, condutor cadastrado, destino e odômetro inicial.
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-slate-850 flex items-center justify-center font-bold text-white shrink-0 text-[10px]">2</span>
              <div>
                <strong className="text-slate-200 block text-xs">Retorno e Assinatura Física:</strong>
                No retorno do veículo, insira o odômetro final e feche a viagem no SIAD. 
                Tire um print da tela de fechamento no sistema, imprima o comprovante e colha a **assinatura física** do condutor no documento impresso.
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-slate-850 flex items-center justify-center font-bold text-white shrink-0 text-[10px]">3</span>
              <div>
                <strong className="text-slate-200 block text-xs">Envio por E-mail (Assinatura GOV / Samira):</strong>
                Escaneie o documento assinado. Envie por e-mail para a **Samira** (`samira.alves@meioambiente.mg.gov.br`) ou encaminhe via e-mail corporativo para assinatura eletrônica do Governo (Assinatura GOV).
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-slate-850 flex items-center justify-center font-bold text-white shrink-0 text-[10px]">4</span>
              <div>
                <strong className="text-slate-200 block text-xs">Arquivamento Digital e Físico:</strong>
                Assim que receber a ASV assinada digitalmente, salve o arquivo PDF na **pasta compartilhada do núcleo (criada pela Camila)**, devidamente catalogado por placa e ano. 
                A cópia física impressa e assinada deve ser guardada no envelope de controle que fica na **1ª gaveta do gaveteiro**.
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2 text-slate-400 mt-4">
            <span className="font-semibold text-white block uppercase tracking-wider text-[9px] flex items-center gap-1.5"><Info size={12} className="text-sky-400" /> Classificação de Atendimento (SIAD):</span>
            <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
              <li><strong className="text-slate-300">Tipo 1 (Local/Intermunicipal):</strong> Deslocamentos internos e comarcas limítrofes do núcleo.</li>
              <li><strong className="text-slate-300">Tipo 2 (Viagem):</strong> Viagens de longa distância fora da área de abrangência imediata.</li>
              <li><strong className="text-slate-300">Tipo 3 (Oficina/Manutenção):</strong> Entrada do veículo em oficina. Indicar km de entrega. Na retirada, feche e abra uma Tipo 1 para retorno à base.</li>
            </ul>
          </div>
        </div>

        {/* Notepad Panel */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <FileText className="text-emerald-400" size={16} />
            Anotações de Pendências (ASVs)
          </h2>

          <div className="space-y-3">
            <p className="text-slate-400 text-[11px]">Utilize este espaço para anotar as pendências administrativas de viagens (ex: "falta enviar e-mail da ASV X", "aguardando assinatura do condutor do carro Y", etc.):</p>
            
            <textarea 
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Digite aqui as pendências das ASVs..."
              className="w-full h-72 bg-slate-950 border border-slate-800 rounded-lg p-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-sans text-xs resize-none"
            />

            <div className="flex items-center justify-between">
              {feedbackMsg ? (
                <span className="text-emerald-400 text-[10px] font-semibold">{feedbackMsg}</span>
              ) : <span />}
              
              <button
                onClick={handleSaveNotes}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <Save size={12} />
                Salvar Anotações
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
