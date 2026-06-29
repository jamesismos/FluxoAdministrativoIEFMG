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

  const handleGenerateTexts = (dae: TaxaRecord) => {
    const dataStr = new Date().toLocaleDateString('pt-BR');
    
    const minuta = `DECLARAÇÃO DE DEVOLUÇÃO TRIBUTÁRIA / RESTITUIÇÃO

1. Declara-se, para os fins de instrução de restituição nos termos da Resolução Conjunta SEMAD/IEF nº 1.914/2013, que o DAE nº ${dae.numeroDAE} (Valor: R$ ${dae.valor}) emitido em ${dae.dataEmissao} correspondente à Taxa de ${dae.tipoTaxa}:
   - NÃO foi utilizado para formalização de processo no âmbito do NAR Guanhães;
   - NÃO gerou o fato gerador da atividade administrativa requerida;
   - Encontra-se passível de restituição de valores.
2. Encaminhe-se à Secretaria de Estado de Fazenda (SEF) para as devidas providências de reembolso financeiro.

${settings.nomeUnidade}, ${dataStr}.`;

    const indef = `DESPACHO DE INDEFERIMENTO DE RESTITUIÇÃO

Processo SEI: ${dae.processoVinculado}
DAE: ${dae.numeroDAE}

1. Trata-se de solicitação de restituição da taxa de ${dae.tipoTaxa}.
2. INDEFIRO o pleito, tendo em vista que a análise do processo SEI nº ${dae.processoVinculado} já foi iniciada/realizada (fato gerador consumado), ou constatou-se que o referido DAE já foi vinculado e exaurido em outra formalização ambiental.

NAR Guanhães, ${dataStr}.`;

    const ofi = `OFÍCIO Nº ____/${new Date().getFullYear()} - ${settings.nomeUnidade}

Ao Interessado,
Assunto: Resposta ao pedido de restituição de taxa - DAE nº ${dae.numeroDAE}

Prezado(a) Senhor(a),
Informamos que seu pedido de restituição de taxas foi analisado perante este Núcleo de Apoio Regional de Guanhães. Nos termos da legislação vigente, o pedido foi classificado como: ${dae.situacao}. 
${dae.situacao === 'Passível de restituição' ? 'Os autos foram encaminhados à SEF-MG para processamento do depósito.' : 'O pedido foi indeferido por fato gerador consumado.'}

Atenciosamente,
___________________________
${settings.servidorPadrao}`;

    const plan = `[PLANILHA ANOTAÇÃO]: DAE: ${dae.numeroDAE} | Tipo: ${dae.tipoTaxa} | Valor: ${dae.valor} | Situação: ${dae.situacao} | Data de Análise: ${dataStr}.`;

    updateTaxaRecord(dae.id, {
      minutaDeclaracao: minuta,
      minutaIndeferimento: indef,
      oficioInteressado: ofi,
      anotacaoPlanilha: plan
    });

    alert('Documentos operacionais gerados!');
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado para a área de transferência!');
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
                placeholder="Ex: 002.3456789.23"
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
                  placeholder="Número SEI"
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
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <h3 className="font-bold text-white">Análise do DAE: {activeDae.numeroDAE}</h3>
                  <p className="text-slate-400 text-[10px]">Utilize os botões abaixo para gerar e copiar as minutas de despacho.</p>
                </div>
                <button 
                  onClick={() => handleGenerateTexts(activeDae)}
                  className="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-3 py-1 rounded transition"
                >
                  Elaborar Minutas SEI
                </button>
              </div>

              {activeDae.minutaDeclaracao && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-300">Minuta de Devolução (Res. 1914)</span>
                      <button onClick={() => handleCopyToClipboard(activeDae.minutaDeclaracao)} className="text-sky-400 hover:underline"><Copy size={11} /></button>
                    </div>
                    <textarea readOnly value={activeDae.minutaDeclaracao} className="w-full h-32 bg-slate-950 border border-slate-850 rounded p-1.5 font-mono text-[9px]" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-300">Minuta de Indeferimento</span>
                      <button onClick={() => handleCopyToClipboard(activeDae.minutaIndeferimento)} className="text-sky-400 hover:underline"><Copy size={11} /></button>
                    </div>
                    <textarea readOnly value={activeDae.minutaIndeferimento} className="w-full h-32 bg-slate-950 border border-slate-850 rounded p-1.5 font-mono text-[9px]" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-300">Ofício ao Interessado</span>
                      <button onClick={() => handleCopyToClipboard(activeDae.oficioInteressado)} className="text-sky-400 hover:underline"><Copy size={11} /></button>
                    </div>
                    <textarea readOnly value={activeDae.oficioInteressado} className="w-full h-32 bg-slate-950 border border-slate-850 rounded p-1.5 font-mono text-[9px]" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-300">Anotação Planilha Local</span>
                      <button onClick={() => handleCopyToClipboard(activeDae.anotacaoPlanilha)} className="text-sky-400 hover:underline"><Copy size={11} /></button>
                    </div>
                    <textarea readOnly value={activeDae.anotacaoPlanilha} className="w-full h-32 bg-slate-950 border border-slate-850 rounded p-1.5 font-mono text-[9px]" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
