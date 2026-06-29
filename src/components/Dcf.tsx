'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Process, DcfProcessData } from '../types';
import { FileSpreadsheet, Check, AlertCircle, Copy, Save, FileText, ChevronRight, Trash2 } from 'lucide-react';

interface DcfProps {
  activeProcessId: string | null;
  onNavigate: (tab: string, processId?: string) => void;
}

export const Dcf: React.FC<DcfProps> = ({ activeProcessId, onNavigate }) => {
  const { processes, updateProcess, deleteProcess, settings } = useApp();
  const [activeStep, setActiveStep] = useState<'entrada' | 'conferencia' | 'decisao' | 'finalizacao'>('entrada');
  
  const process = processes.find(p => p.id === activeProcessId && p.type === 'DCF');

  // Local component states synced with process data
  const [conferidoFormulario, setConferidoFormulario] = useState(false);
  const [conferidoArquivosDigitais, setConferidoArquivosDigitais] = useState(false);
  const [conferidoCadastroPlantio, setConferidoCadastroPlantio] = useState(false);
  const [conferidoDaeTaxaFlorestal, setConferidoDaeTaxaFlorestal] = useState(false);
  const [conferidoDaeExpediente, setConferidoDaeExpediente] = useState(false);
  const [conferidoComprovantes, setConferidoComprovantes] = useState(false);
  const [conferidoTermoCiencia, setConferidoTermoCiencia] = useState(false);
  const [conferidoPlanilhaColheita, setConferidoPlanilhaColheita] = useState(false);
  const [produtoDeclarado, setProdutoDeclarado] = useState('');
  const [volumeDeclarado, setVolumeDeclarado] = useState(0);
  const [correspondeTaxaVolume, setCorrespondeTaxaVolume] = useState(false);
  const [termoConcordanciaOutroProprietario, setTermoConcordanciaOutroProprietario] = useState(false);
  const [daeAnoAnterior, setDaeAnoAnterior] = useState(false);
  const [pagamentoSiteFazendaConfirmado, setPagamentoSiteFazendaConfirmado] = useState(false);

  const [despachoAceite, setDespachoAceite] = useState('');
  const [memorandoTecnico, setMemorandoTecnico] = useState('');
  const [despachoRecusa, setDespachoRecusa] = useState('');
  const [comunicacaoRecusa, setComunicacaoRecusa] = useState('');
  const [despachoSaldoSiam, setDespachoSaldoSiam] = useState('');
  const [despachoAvaliacaoDcf, setDespachoAvaliacaoDcf] = useState('');
  const [intimacaoEletronica, setIntimacaoEletronica] = useState('');

  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Sync state when process changes
  useEffect(() => {
    if (process && process.dcfData) {
      const d = process.dcfData;
      setConferidoFormulario(d.conferidoFormulario);
      setConferidoArquivosDigitais(d.conferidoArquivosDigitais);
      setConferidoCadastroPlantio(d.conferidoCadastroPlantio);
      setConferidoDaeTaxaFlorestal(d.conferidoDaeTaxaFlorestal);
      setConferidoDaeExpediente(d.conferidoDaeExpediente);
      setConferidoComprovantes(d.conferidoComprovantes);
      setConferidoTermoCiencia(d.conferidoTermoCiencia);
      setConferidoPlanilhaColheita(d.conferidoPlanilhaColheita);
      setProdutoDeclarado(d.produtoDeclarado || '');
      setVolumeDeclarado(d.volumeDeclarado || 0);
      setCorrespondeTaxaVolume(d.correspondeTaxaVolume);
      setTermoConcordanciaOutroProprietario(d.termoConcordanciaOutroProprietario);
      setDaeAnoAnterior(d.daeAnoAnterior);
      setPagamentoSiteFazendaConfirmado(d.pagamentoSiteFazendaConfirmado);

      setDespachoAceite(d.despachoAceite || '');
      setMemorandoTecnico(d.memorandoTecnico || '');
      setDespachoRecusa(d.despachoRecusa || '');
      setComunicacaoRecusa(d.comunicacaoRecusa || '');
      setDespachoSaldoSiam(d.despachoSaldoSiam || '');
      setDespachoAvaliacaoDcf(d.despachoAvaliacaoDcf || '');
      setIntimacaoEletronica(d.intimacaoEletronica || '');
    }
  }, [activeProcessId, process]);

  if (!process) {
    return (
      <div className="py-12 text-center text-slate-500">
        <FileSpreadsheet size={48} className="mx-auto text-slate-700 mb-3" />
        <h2 className="text-lg font-bold text-white">Nenhum Processo DCF Ativo</h2>
        <p className="text-sm mt-1">Selecione ou crie um processo de Declaração de Colheita e Florestas na Triagem.</p>
        <button 
          onClick={() => onNavigate('Entrada / Triagem')}
          className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-lg font-semibold transition"
        >
          Criar Novo Processo
        </button>
      </div>
    );
  }

  const isAflobio = settings.municipiosAflobioPecanha.includes(process.municipio);

  const handleSave = (silent = false) => {
    if (!activeProcessId) return;

    updateProcess(activeProcessId, {
      dcfData: {
        etapa: activeStep === 'entrada' ? 'Entrada' : activeStep === 'conferencia' ? 'Conferência' : activeStep === 'decisao' ? 'Apta' : 'Finalização',
        isApta: activeStep === 'decisao' ? true : activeStep === 'finalizacao' ? true : null,
        municipioAflobioPecanha: isAflobio,
        conferidoFormulario,
        conferidoArquivosDigitais,
        conferidoCadastroPlantio,
        conferidoDaeTaxaFlorestal,
        conferidoDaeExpediente,
        conferidoComprovantes,
        conferidoTermoCiencia,
        conferidoPlanilhaColheita,
        produtoDeclarado,
        volumeDeclarado,
        correspondeTaxaVolume,
        termoConcordanciaOutroProprietario,
        daeAnoAnterior,
        pagamentoSiteFazendaConfirmado,
        despachoAceite,
        memorandoTecnico,
        despachoRecusa,
        comunicacaoRecusa,
        despachoSaldoSiam,
        despachoAvaliacaoDcf,
        intimacaoEletronica
      }
    });

    if (!silent) {
      setFeedbackMsg('Dados DCF salvos com sucesso!');
      setTimeout(() => setFeedbackMsg(''), 2000);
    }
  };

  // Document builders
  const generateAptaTexts = () => {
    const dataStr = new Date().toLocaleDateString('pt-BR');
    
    const despacho = `Processo SEI: ${process.seiNumber}
Interessado: ${process.requerente}
Município: ${process.municipio}
Produto: ${produtoDeclarado} | Volume: ${volumeDeclarado}

DESPACHO DE ACEITE ADM — DCF

1. Em análise aos documentos de instrução da Declaração de Colheita e Florestas (DCF), constatou-se o atendimento das condicionantes formais, o recolhimento das respectivas taxas e o cadastro ativo do plantio.
2. Defiro a formalização do presente expediente. 
3. Nos termos da rotina de fluxos locais do IEF, encaminhe-se à análise e vistoria da equipe técnica para posterior homologação.

${settings.nomeUnidade}, ${dataStr}.
___________________________
${settings.servidorPadrao}`;

    const memo = `MEMORANDO Nº ____/${new Date().getFullYear()} - ${settings.nomeUnidade}

Para: Setor Técnico / NUREG Rio Doce
Assunto: Encaminhamento de processo de DCF para Homologação Técnica
Processo SEI: ${process.seiNumber}
Interessado: ${process.requerente}

1. Encaminhamos o processo administrativo de DCF acima indicado, devidamente triado e com despacho de aceite documental anexado.
2. Informa-se que o município ${process.municipio} ${isAflobio ? 'pertence à área de competência da AFLOBIO Peçanha. Encaminhar para o respectivo setor.' : 'será analisado localmente.'}
3. Solicita-se vistoria florestal e elaboração de parecer sobre a colheita declarada.

Atenciosamente,
___________________________
${settings.servidorPadrao}`;

    setDespachoAceite(despacho);
    setMemorandoTecnico(memo);
  };

  const generateRecusaTexts = () => {
    const dataStr = new Date().toLocaleDateString('pt-BR');

    const despacho = `Processo SEI: ${process.seiNumber}
Interessado: ${process.requerente}

DESPACHO DE RECUSA E INCOMPATIBILIDADE - DCF

1. Em análise preliminar documental do presente pedido de DCF, verificaram-se desconformidades críticas de instrução, tais como pendências no pagamento de taxas ou ausência de cadastro de plantio atualizado no SIAM.
2. Diante do exposto, indefiro a formalização do processo em sua forma atual. Notifique-se o declarante.

NAR Guanhães, ${dataStr}.
___________________________
${settings.servidorPadrao}`;

    const comun = `Prezado Senhor(a),
Comunicamos que sua Declaração de Colheita e Florestas (DCF) protocolada sob o número SEI ${process.seiNumber} não pôde ser aceita em razão das seguintes pendências:
- Ausência de comprovante de pagamento no site da Fazenda ou incoerência de taxas;
- Falta de termo de concordância do proprietário da terra (quando aplicável);
- Arquivos de shapefile/cadastro inexistentes ou corrompidos.

Favor protocolar nova solicitação com os documentos devidamente saneados.`;

    setDespachoRecusa(despacho);
    setComunicacaoRecusa(comun);
  };

  const generateFinalizacaoTexts = () => {
    const dataStr = new Date().toLocaleDateString('pt-BR');

    const saldo = `Processo SEI: ${process.seiNumber}
Interessado: ${process.requerente}

DESPACHO DE CADASTRO DE SALDO - SIAM/CAF

1. Tendo em vista a homologação técnica favorável do parecer de colheita, determino o lançamento e liberação do saldo de ${produtoDeclarado} (Volume: ${volumeDeclarado}) no Sistema SIAM/CAF da Fazenda para emissão de documentos de transporte florestal.
2. Atualize-se a planilha de controle de saldo local.

${settings.nomeUnidade}, ${dataStr}.
___________________________
Chefia do Núcleo - ${settings.chefiaNome}`;

    const avaliacao = `DESPACHO DE AVALIAÇÃO DCF/DAIA

1. Homologo a Declaração de Colheita e Florestas (DCF) sob o processo ${process.seiNumber}.
2. Arquivem-se os autos com as devidas baixas nas planilhas e encerramento do acompanhamento especial.`;

    const intimacao = `INTIMAÇÃO ELETRÔNICA - CIÊNCIA DCF

Fica o declarante ${process.requerente} cientificado de que a Declaração de Colheita e Florestas (DCF) sob o processo SEI ${process.seiNumber} foi devidamente homologada e o saldo florestal encontra-se disponível no sistema SIAM para movimentação legal.`;

    setDespachoSaldoSiam(saldo);
    setDespachoAvaliacaoDcf(avaliacao);
    setIntimacaoEletronica(intimacao);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado para a área de transferência!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2 py-0.5 rounded font-bold">DCF - Ativo</span>
            <h1 className="text-xl font-bold text-white">{process.seiNumber}</h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">Interessado: <span className="font-semibold text-slate-300">{process.requerente}</span> | Município: <span className="font-semibold text-slate-300">{process.municipio}</span></p>
        </div>

        <div className="flex items-center gap-2">
          {feedbackMsg && <span className="text-emerald-400 text-xs font-semibold mr-2">{feedbackMsg}</span>}
          <button 
            onClick={() => handleSave()}
            className="bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
          >
            <Save size={14} />
            Salvar Alterações
          </button>
          <button 
            onClick={() => {
              if (confirm('Deseja realmente EXCLUIR este processo? Esta ação é definitiva e apagará todos os dados locais deste feito.')) {
                deleteProcess(process.id);
                alert('Processo excluído com sucesso!');
                onNavigate('Painel');
              }
            }}
            className="bg-red-955/20 hover:bg-red-900/40 text-red-400 border border-red-800/30 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
          >
            <Trash2 size={14} />
            Excluir
          </button>
        </div>
      </div>

      {/* Triage alerts */}
      {isAflobio && (
        <div className="p-3 bg-amber-950/20 border border-amber-900/50 rounded-lg flex gap-3 text-amber-300 text-xs">
          <AlertCircle className="shrink-0 mt-0.5" size={16} />
          <div>
            <span className="font-bold">Regra de Triage (AFLOBIO Peçanha):</span>
            <p className="mt-0.5 text-slate-300">Este município pertence à abrangência técnica da AFLOBIO Peçanha para fins de DCF. Após o despacho de aceite documental, lembre-se de encaminhar o processo para a fila de Peçanha no SEI.</p>
          </div>
        </div>
      )}

      {/* Step Indicator bar */}
      <div className="grid grid-cols-4 gap-2 border-b border-slate-800 pb-4">
        <button
          onClick={() => setActiveStep('entrada')}
          className={`py-2 px-3 text-left rounded-lg border text-xs transition ${activeStep === 'entrada' ? 'bg-slate-900 border-emerald-500 text-emerald-400' : 'bg-slate-900/20 border-slate-800/80 text-slate-400 hover:border-slate-700'}`}
        >
          <div className="font-semibold text-[10px] uppercase">Passo 1</div>
          <div className="font-bold text-white mt-0.5">Entrada / Info</div>
        </button>

        <button
          onClick={() => setActiveStep('conferencia')}
          className={`py-2 px-3 text-left rounded-lg border text-xs transition ${activeStep === 'conferencia' ? 'bg-slate-900 border-emerald-500 text-emerald-400' : 'bg-slate-900/20 border-slate-800/80 text-slate-400 hover:border-slate-700'}`}
        >
          <div className="font-semibold text-[10px] uppercase">Passo 2</div>
          <div className="font-bold text-white mt-0.5">Conferência</div>
        </button>

        <button
          onClick={() => setActiveStep('decisao')}
          className={`py-2 px-3 text-left rounded-lg border text-xs transition ${activeStep === 'decisao' ? 'bg-slate-900 border-emerald-500 text-emerald-400' : 'bg-slate-900/20 border-slate-800/80 text-slate-400 hover:border-slate-700'}`}
        >
          <div className="font-semibold text-[10px] uppercase">Passo 3</div>
          <div className="font-bold text-white mt-0.5">Aceite / Recusa</div>
        </button>

        <button
          onClick={() => setActiveStep('finalizacao')}
          className={`py-2 px-3 text-left rounded-lg border text-xs transition ${activeStep === 'finalizacao' ? 'bg-slate-900 border-emerald-500 text-emerald-400' : 'bg-slate-900/20 border-slate-800/80 text-slate-400 hover:border-slate-700'}`}
        >
          <div className="font-semibold text-[10px] uppercase">Passo 4</div>
          <div className="font-bold text-white mt-0.5">Finalização</div>
        </button>
      </div>

      {/* Step Panels */}
      <div className="bg-slate-900/30 border border-slate-800 p-5 rounded-xl min-h-[300px]">
        {/* Step 1: Entrada / Info */}
        {activeStep === 'entrada' && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">Dados da Declaração</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">Produto Florestal Declarado</label>
                <input 
                  type="text" 
                  value={produtoDeclarado}
                  onChange={e => setProdutoDeclarado(e.target.value)}
                  placeholder="Ex: Eucalipto - Lenha / Madeira em tora"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Volume Estimado (m³ ou st)</label>
                <input 
                  type="number" 
                  value={volumeDeclarado}
                  onChange={e => setVolumeDeclarado(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                />
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <h4 className="font-semibold text-white">Instruções de Entrada:</h4>
              <p className="text-slate-400 leading-relaxed">As declarações de colheita de florestas plantadas vinculam o produtor a um cadastro de plantio já homologado no SIAM. Verifique se o talhão indicado no croqui corresponde às áreas declaradas de plantio comercial.</p>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
              <button 
                onClick={() => { handleSave(true); setActiveStep('conferencia'); }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
              >
                Prosseguir para Conferência
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Conferencia */}
        {activeStep === 'conferencia' && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">Itens de Conferência Administrativa (DCF)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 bg-slate-950 p-4 rounded-lg border border-slate-800">
                <h4 className="font-semibold text-white mb-2">Checklist de Peças Documentais</h4>
                
                {[
                  { label: 'Formulário DCF assinado', val: conferidoFormulario, set: setConferidoFormulario },
                  { label: 'Croqui / Arquivos digitais e Shapefile do talhão', val: conferidoArquivosDigitais, set: setConferidoArquivosDigitais },
                  { label: 'Cadastro de plantio ativo/homologado no SIAM', val: conferidoCadastroPlantio, set: setConferidoCadastroPlantio },
                  { label: 'DAE de taxa florestal quitado', val: conferidoDaeTaxaFlorestal, set: setConferidoDaeTaxaFlorestal },
                  { label: 'DAE de expediente quitado', val: conferidoDaeExpediente, set: setConferidoDaeExpediente },
                  { label: 'Comprovantes de arrecadação bancários anexos', val: conferidoComprovantes, set: setConferidoComprovantes },
                  { label: 'Termo de ciência e responsabilidade do declarante', val: conferidoTermoCiencia, set: setConferidoTermoCiencia },
                  { label: 'Planilha de rendimento da colheita por talhão', val: conferidoPlanilhaColheita, set: setConferidoPlanilhaColheita },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 py-0.5">
                    <input 
                      type="checkbox" 
                      id={`chk-${idx}`}
                      checked={item.val}
                      onChange={e => item.set(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-800 bg-slate-900 accent-emerald-500"
                    />
                    <label htmlFor={`chk-${idx}`} className="text-slate-300 cursor-pointer select-none">{item.label}</label>
                  </div>
                ))}
              </div>

              <div className="space-y-2 bg-slate-950 p-4 rounded-lg border border-slate-800">
                <h4 className="font-semibold text-white mb-2">Cruzamento de Dados e Validações</h4>
                
                {[
                  { label: 'Volume e produto correspondem ao DAE pago', val: correspondeTaxaVolume, set: setCorrespondeTaxaVolume },
                  { label: 'Termo de concordância assinado (se arrendamento/terceiros)', val: termoConcordanciaOutroProprietario, set: setTermoConcordanciaOutroProprietario },
                  { label: 'Consulta de DAEs anteriores para evitar reutilização', val: daeAnoAnterior, set: setDaeAnoAnterior },
                  { label: 'Confirmação de pagamento no site da SEF/Fazenda MG', val: pagamentoSiteFazendaConfirmado, set: setPagamentoSiteFazendaConfirmado },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 py-0.5">
                    <input 
                      type="checkbox" 
                      id={`valid-${idx}`}
                      checked={item.val}
                      onChange={e => item.set(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-800 bg-slate-900 accent-emerald-500"
                    />
                    <label htmlFor={`valid-${idx}`} className="text-slate-300 cursor-pointer select-none">{item.label}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between border-t border-slate-800 pt-4">
              <button 
                onClick={() => setActiveStep('entrada')}
                className="text-slate-400 hover:text-white"
              >
                Voltar
              </button>
              <button 
                onClick={() => { handleSave(true); setActiveStep('decisao'); }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
              >
                Definir Aceite ou Recusa
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Decisao Aceite / Recusa */}
        {activeStep === 'decisao' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Opção DCF Apta */}
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="font-bold text-emerald-400 uppercase tracking-wider">DCF Apta (Aceite)</h4>
                  <button 
                    onClick={generateAptaTexts}
                    className="bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded text-[10px]"
                  >
                    Gerar Documentos
                  </button>
                </div>
                
                {despachoAceite && (
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-400 text-[10px]">Minuta Despacho Aceite</span>
                        <button onClick={() => handleCopyToClipboard(despachoAceite)} className="text-sky-400 hover:underline flex items-center gap-1"><Copy size={10} /> Copiar</button>
                      </div>
                      <textarea value={despachoAceite} readOnly className="w-full h-24 bg-slate-900 border border-slate-850 rounded p-1.5 text-[10px] font-mono text-slate-300" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-400 text-[10px]">Minuta Memorando Técnico</span>
                        <button onClick={() => handleCopyToClipboard(memorandoTecnico)} className="text-sky-400 hover:underline flex items-center gap-1"><Copy size={10} /> Copiar</button>
                      </div>
                      <textarea value={memorandoTecnico} readOnly className="w-full h-24 bg-slate-900 border border-slate-850 rounded p-1.5 text-[10px] font-mono text-slate-300" />
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded border border-slate-850 text-slate-400 space-y-1">
                      <p className="font-semibold text-white text-[10px]">Próximas ações pós-aceite:</p>
                      <ul className="list-disc pl-4 space-y-0.5 text-[10px]">
                        <li>Lembrar de pesquisar cadastro de plantio relacionado;</li>
                        <li>Enviar para IEF/URFBio Rio Doce - NUREG;</li>
                        <li>Lançar na planilha de DCFs Ativas;</li>
                        <li>Concluir processo na unidade local.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Opção DCF Incompleta */}
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="font-bold text-red-400 uppercase tracking-wider">DCF Recusada / Incompleta</h4>
                  <button 
                    onClick={generateRecusaTexts}
                    className="bg-red-650/10 text-red-400 border border-red-500/20 px-2 py-1 rounded text-[10px]"
                  >
                    Gerar Recusa
                  </button>
                </div>

                {despachoRecusa && (
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-400 text-[10px]">Minuta Despacho Recusa</span>
                        <button onClick={() => handleCopyToClipboard(despachoRecusa)} className="text-sky-400 hover:underline flex items-center gap-1"><Copy size={10} /> Copiar</button>
                      </div>
                      <textarea value={despachoRecusa} readOnly className="w-full h-24 bg-slate-900 border border-slate-850 rounded p-1.5 text-[10px] font-mono text-slate-300" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-400 text-[10px]">Texto Notificação Declarante</span>
                        <button onClick={() => handleCopyToClipboard(comunicacaoRecusa)} className="text-sky-400 hover:underline flex items-center gap-1"><Copy size={10} /> Copiar</button>
                      </div>
                      <textarea value={comunicacaoRecusa} readOnly className="w-full h-24 bg-slate-900 border border-slate-850 rounded p-1.5 text-[10px] font-mono text-slate-300" />
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded border border-slate-850 text-slate-400">
                      <p className="font-semibold text-white text-[10px]">Próximas ações pós-recusa:</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Notificar o interessado via e-mail ou SEI, atualizar o registro na planilha de demandas indeferidas e concluir o processo na unidade.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between border-t border-slate-800 pt-4">
              <button 
                onClick={() => setActiveStep('conferencia')}
                className="text-slate-400 hover:text-white"
              >
                Voltar
              </button>
              <button 
                onClick={() => { handleSave(true); setActiveStep('finalizacao'); }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
              >
                Ir para Finalização da DCF
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Finalizacao */}
        {activeStep === 'finalizacao' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">Fechamento do Ciclo da DCF</h3>
              <button 
                onClick={generateFinalizacaoTexts}
                className="bg-emerald-650/15 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded text-xs font-semibold"
              >
                Gerar Despachos de Fechamento (SIAM/CAF)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-semibold">1. Lançar Saldo no SIAM</span>
                  <button onClick={() => handleCopyToClipboard(despachoSaldoSiam)} className="text-sky-400 hover:underline"><Copy size={10} /></button>
                </div>
                <textarea value={despachoSaldoSiam} readOnly className="w-full h-32 bg-slate-950 border border-slate-850 rounded p-1.5 font-mono text-[9px]" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-semibold">2. Homologar / Avaliar</span>
                  <button onClick={() => handleCopyToClipboard(despachoAvaliacaoDcf)} className="text-sky-400 hover:underline"><Copy size={10} /></button>
                </div>
                <textarea value={despachoAvaliacaoDcf} readOnly className="w-full h-32 bg-slate-950 border border-slate-850 rounded p-1.5 font-mono text-[9px]" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-semibold">3. Intimação Eletrônica (Ciência)</span>
                  <button onClick={() => handleCopyToClipboard(intimacaoEletronica)} className="text-sky-400 hover:underline"><Copy size={10} /></button>
                </div>
                <textarea value={intimacaoEletronica} readOnly className="w-full h-32 bg-slate-950 border border-slate-850 rounded p-1.5 font-mono text-[9px]" />
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
              <h4 className="font-semibold text-white">Checklist de encerramento da rotina:</h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="finish-dcf" 
                    checked={process.isFinalized}
                    onChange={e => updateProcess(process.id, { isFinalized: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-850 bg-slate-900 accent-emerald-500"
                  />
                  <label htmlFor="finish-dcf" className="text-slate-300 cursor-pointer">Marcar processo como concluído e arquivado</label>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="remove-special" 
                    checked={!process.emAcompanhamentoEspecial}
                    onChange={e => updateProcess(process.id, { emAcompanhamentoEspecial: !e.target.checked })}
                    className="w-4 h-4 rounded border-slate-850 bg-slate-900 accent-emerald-500"
                  />
                  <label htmlFor="remove-special" className="text-slate-300 cursor-pointer">Retirar do acompanhamento especial (fila ativa)</label>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Bloco Interno SEI:</span>
                  <select 
                    value={process.blocoInterno}
                    onChange={e => updateProcess(process.id, { blocoInterno: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-white"
                  >
                    <option value="">Selecione o bloco</option>
                    <option value="DCF finalizadas">DCF finalizadas</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-between border-t border-slate-800 pt-4">
              <button 
                onClick={() => setActiveStep('decisao')}
                className="text-slate-400 hover:text-white"
              >
                Voltar
              </button>
              <button 
                onClick={() => {
                  handleSave(true);
                  onNavigate('Painel');
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
              >
                Finalizar e Voltar ao Painel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
