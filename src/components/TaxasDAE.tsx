'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TaxaRecord } from '../types';
import { DollarSign, Copy, Plus, FileText, CheckCircle, HelpCircle } from 'lucide-react';

export const TaxasDAE: React.FC = () => {
  const { taxaRecords, addTaxaRecord, updateTaxaRecord, settings } = useApp();
  const [activeDaeId, setActiveDaeId] = useState<string | null>(null);

  // Form fields
  const [numeroDAE, setNumeroDAE] = useState('');
  const [tipoTaxa, setTipoTaxa] = useState<TaxaRecord['tipoTaxa']>('Expediente');
  const [valor, setValor] = useState(0);
  const [dataEmissao, setDataEmissao] = useState(new Date().toISOString().split('T')[0]);
  const [comprovanteAnexo, setComprovanteAnexo] = useState(true);
  const [processoVinculado, setProcessoVinculado] = useState('');
  const [situacao, setSituacao] = useState<TaxaRecord['situacao']>('A verificar');

  // Checklist
  const [daeAnexado, setDaeAnexado] = useState(true);
  const [comprovanteAnexado, setComprovanteAnexado] = useState(true);
  const [usadoOutroProcesso, setUsadoOutroProcesso] = useState(false);
  const [fatoGerador, setFatoGerador] = useState(false);
  const [cabeDeclaracao, setCabeDeclaracao] = useState(false);
  const [encaminharSEF, setEncaminharSEF] = useState(false);

  const activeDae = taxaRecords.find(t => t.id === activeDaeId);

  const handleAddDae = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numeroDAE || valor <= 0) return;

    addTaxaRecord({
      numeroDAE,
      tipoTaxa,
      valor,
      dataEmissao,
      comprovanteAnexo,
      processoVinculado,
      situacao,
      daeAnexado,
      comprovanteAnexado,
      usadoOutroProcesso,
      fatoGerador,
      cabeDeclaracao,
      encaminharSEF,
      minutaDeclaracao: '',
      minutaIndeferimento: '',
      oficioInteressado: '',
      anotacaoPlanilha: ''
    });

    setNumeroDAE('');
    setValor(0);
    setProcessoVinculado('');
    alert('DAE cadastrado com sucesso!');
  };



  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Gestão Financeira: Taxas, DAEs e Restituições</h1>
        <p className="text-slate-400 text-sm">Controle de pagamentos de DAEs, taxas florestais e análise de pleitos de restituição conforme Resolução SEMAD/IEF nº 1.914/2013.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form panel */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4 text-xs">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Plus className="text-emerald-400" size={16} />
            Cadastrar Pagamento DAE
          </h2>

          <form onSubmit={handleAddDae} className="space-y-3">
            <div>
              <label className="block text-slate-400 mb-1">Número DAE *</label>
              <input 
                type="text" 
                value={numeroDAE}
                onChange={e => setNumeroDAE(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-white font-mono"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-1">Tipo de Taxa</label>
                <select 
                  value={tipoTaxa}
                  onChange={e => setTipoTaxa(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-white"
                >
                  <option value="Expediente">Expediente</option>
                  <option value="Florestal">Florestal</option>
                  <option value="Reposição">Reposição</option>
                  <option value="Outra">Outra</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Valor (R$) *</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={valor}
                  onChange={e => setValor(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-1">Data Emissão</label>
                <input 
                  type="date" 
                  value={dataEmissao}
                  onChange={e => setDataEmissao(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Processo SEI</label>
                <input 
                  type="text" 
                  value={processoVinculado}
                  onChange={e => setProcessoVinculado(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Situação / Diagnóstico</label>
              <select 
                value={situacao}
                onChange={e => setSituacao(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-white"
              >
                <option value="A verificar">A verificar</option>
                <option value="Pago">Pago / Homologado</option>
                <option value="Não localizado">Não localizado</option>
                <option value="Usado em outro processo">Usado em outro processo</option>
                <option value="Passível de restituição">Passível de restituição (Sem fato gerador)</option>
                <option value="Indeferir">Indeferir pleito</option>
              </select>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-1">
              <span className="font-semibold text-white">Checklist de Validação Tributária:</span>
              <div className="space-y-1.5 mt-1.5">
                <label className="flex items-center gap-2"><input type="checkbox" checked={daeAnexado} onChange={e => setDaeAnexado(e.target.checked)} className="w-3.5 h-3.5 rounded bg-slate-900 accent-emerald-500" /> DAE anexado no SEI?</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={comprovanteAnexado} onChange={e => setComprovanteAnexado(e.target.checked)} className="w-3.5 h-3.5 rounded bg-slate-900 accent-emerald-500" /> Comprovante bancário anexo?</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={usadoOutroProcesso} onChange={e => setUsadoOutroProcesso(e.target.checked)} className="w-3.5 h-3.5 rounded bg-slate-900 accent-emerald-500" /> DAE já utilizado em outro feito?</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={fatoGerador} onChange={e => setFatoGerador(e.target.checked)} className="w-3.5 h-3.5 rounded bg-slate-900 accent-emerald-500" /> Houve consumo/fato gerador?</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={cabeDeclaracao} onChange={e => setCabeDeclaracao(e.target.checked)} className="w-3.5 h-3.5 rounded bg-slate-900 accent-emerald-500" /> Cabe emissão de Declaração IEF?</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={encaminharSEF} onChange={e => setEncaminharSEF(e.target.checked)} className="w-3.5 h-3.5 rounded bg-slate-900 accent-emerald-500" /> Encaminhar à SEF-MG?</label>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded-lg transition"
            >
              Registrar DAE
            </button>
          </form>
        </div>

        {/* Database list and detailed texts panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">Registros de Arrecadação</h2>
            
            {taxaRecords.length === 0 ? (
              <p className="text-slate-500 text-xs italic">Nenhum DAE cadastrado até o momento.</p>
            ) : (
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                {taxaRecords.map(dae => (
                  <div 
                    key={dae.id}
                    onClick={() => setActiveDaeId(dae.id)}
                    className={`p-2.5 rounded border text-xs cursor-pointer flex justify-between items-center transition ${activeDaeId === dae.id ? 'bg-slate-900 border-emerald-500' : 'bg-slate-950 border-slate-800/80 hover:bg-slate-900'}`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-white font-mono">{dae.numeroDAE}</strong>
                        <span className="bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded text-[9px] uppercase">{dae.tipoTaxa}</span>
                      </div>
                      <p className="text-slate-400 text-[10px]">Processo: {dae.processoVinculado || 'Sem vínculo'} | Data: {dae.dataEmissao}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <strong className="text-emerald-400">R$ {dae.valor.toFixed(2)}</strong>
                      <div className="text-[9px]"><span className={`px-1 rounded ${dae.situacao === 'Pago' ? 'bg-emerald-950 text-emerald-400' : dae.situacao === 'Passível de restituição' ? 'bg-indigo-950 text-indigo-400' : 'bg-amber-950 text-amber-400'}`}>{dae.situacao}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details / Document Generation */}
          {activeDae && (
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4 text-xs">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="font-bold text-white text-sm">Procedimento SEI para DAE: {activeDae.numeroDAE}</h3>
                <p className="text-slate-400 text-[10px]">Orientações para lavratura da restituição ou indeferimento no SEI.</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-3">
                <p className="text-slate-300 font-semibold">Instruções de Processo Administrativo:</p>
                <div className="bg-slate-900/60 p-3.5 rounded border border-slate-800 text-slate-400 space-y-2">
                  <p><strong>Para Restituição Deferida:</strong> DENTRO DO SEI HÁ MODELO PARA Declaração de Devolução Tributária - Res. 1914 (fica em favoritos). Complete as informações do DAE nº {activeDae.numeroDAE} (Valor: R$ {activeDae.valor.toFixed(2)}) e do interessado correspondente ao processo {activeDae.processoVinculado}.</p>
                  <p><strong>Para Restituição Indeferida:</strong> DENTRO DO SEI HÁ MODELO PARA Despacho de Indeferimento de Restituição (fica em favoritos) e modelo de <strong>Ofício de Notificação de Indeferimento</strong>.</p>
                  <p><strong>Planilha Local:</strong> Lembre-se de lançar a demanda no <strong>Controle Processos NAR e Aflobios</strong> para o acompanhamento estatístico mensal.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
