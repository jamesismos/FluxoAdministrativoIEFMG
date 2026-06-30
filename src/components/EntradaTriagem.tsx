'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Process } from '../types';
import { PlusCircle, HelpCircle, AlertTriangle, ShieldCheck, CheckSquare, Info } from 'lucide-react';

interface EntradaTriagemProps {
  onNavigate: (tab: string, processId?: string) => void;
}

export const EntradaTriagem: React.FC<EntradaTriagemProps> = ({ onNavigate }) => {
  const { addProcess, settings } = useApp();
  const [seiNumber, setSeiNumber] = useState('');
  const [type, setType] = useState<Process['type']>('AIA');
  const [municipio, setMunicipio] = useState('');
  const [requerente, setRequerente] = useState('');
  const [dataEntrada, setDataEntrada] = useState(new Date().toISOString().split('T')[0]);
  const [unidadeAtual, setUnidadeAtual] = useState(settings.nomeUnidade);
  const [responsavelInterno, setResponsavelInterno] = useState(settings.servidorPadrao);
  const [situacao, setSituacao] = useState('Novo na Triagem');
  const [proximaAcao, setProximaAcao] = useState('Conferência preliminar da documentação');
  const [emAcompanhamentoEspecial, setEmAcompanhamentoEspecial] = useState(true);
  const [faseAtual, setFaseAtual] = useState<'inicio' | 'conferencia' | 'aceite' | 'finalizacao'>('inicio');

  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Checks and warnings
  const isGuanhaes = settings.municipiosGuanhaes.some(m => m.toLowerCase() === municipio.trim().toLowerCase());
  const isAflobio = settings.municipiosAflobioPecanha.some(m => m.toLowerCase() === municipio.trim().toLowerCase());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seiNumber || !municipio || !requerente) {
      setMessage({ text: 'Por favor, preencha todos os campos obrigatórios (*).', type: 'error' });
      return;
    }

    // Determine default suggestion values based on rules
    let finalProximaAcao = proximaAcao;
    let finalSituacao = situacao;

    if (type === 'DCF' && isAflobio) {
      finalProximaAcao = 'AFLOBIO Peçanha atende este município para DCF. Encaminhar no SEI.';
      finalSituacao = 'Aguardando envio para AFLOBIO Peçanha';
    } else if (type === 'DCF') {
      finalProximaAcao = 'Verificar taxas e colheitas / cadastrar saldo no SIAM';
    } else if (type === 'Simples Declaração') {
      finalProximaAcao = 'Conferir e emitir memorando técnico / encaminhar para vistoria se necessário';
    }

    // Adjust situacao/proximaAcao based on faseAtual for processes already in progress
    if (faseAtual === 'conferencia') {
      finalSituacao = 'Em conferência documental';
      finalProximaAcao = 'Concluir conferência e definir aceite ou recusa';
    } else if (faseAtual === 'aceite') {
      finalSituacao = 'Aceite realizado — aguardando análise técnica';
      finalProximaAcao = 'Acompanhar análise técnica / aguardar saldo SIAM';
    } else if (faseAtual === 'finalizacao') {
      finalSituacao = 'Em finalização — aguardando encerramento';
      finalProximaAcao = 'Concluir no SEI e arquivar em bloco interno';
    }

    // Build phase-aware nested data for DCF
    const extraDetails: Partial<Process> = {};
    if (type === 'DCF' && faseAtual !== 'inicio') {
      const af = settings.municipiosAflobioPecanha.some(m => m.toLowerCase() === municipio.trim().toLowerCase());
      const allChecked = faseAtual === 'aceite' || faseAtual === 'finalizacao';
      extraDetails.dcfData = {
        etapa: faseAtual === 'conferencia' ? 'Conferência' : faseAtual === 'aceite' ? 'Apta' : 'Finalização',
        isApta: allChecked ? true : null,
        municipioAflobioPecanha: af,
        conferidoFormulario: allChecked,
        conferidoArquivosDigitais: allChecked,
        conferidoCadastroPlantio: allChecked,
        conferidoDaeTaxaFlorestal: allChecked,
        conferidoDaeExpediente: allChecked,
        conferidoComprovantes: allChecked,
        conferidoTermoCiencia: allChecked,
        conferidoPlanilhaColheita: allChecked,
        produtoDeclarado: '',
        volumeDeclarado: 0,
        correspondeTaxaVolume: allChecked,
        termoConcordanciaOutroProprietario: false,
        daeAnoAnterior: false,
        pagamentoSiteFazendaConfirmado: allChecked,
        despachoAceite: '',
        memorandoTecnico: '',
        despachoRecusa: '',
        comunicacaoRecusa: '',
        despachoSaldoSiam: '',
        despachoAvaliacaoDcf: '',
        intimacaoEletronica: ''
      };
    } else if (type === 'Simples Declaração' && faseAtual !== 'inicio') {
      extraDetails.simplesData = {
        etapa: faseAtual === 'finalizacao' ? 'Finalização' : 'Conferência',
        conferidoDocumentos: faseAtual === 'finalizacao',
        memorandoTecnico: '',
        intimacaoEletronica: ''
      };
    }

    const createdId = addProcess(type, {
      seiNumber,
      municipio: municipio.trim(),
      requerente: requerente.trim(),
      dataEntrada,
      unidadeAtual,
      responsavelInterno,
      situacao: finalSituacao,
      proximaAcao: finalProximaAcao,
      emAcompanhamentoEspecial,
      validacaoChefia: type === 'AIA' || type === 'DCF' ? 'Aguardando chefia' : 'Não precisa',
      ...extraDetails
    });

    setMessage({ text: `Processo cadastrado com sucesso! ID: ${seiNumber}`, type: 'success' });
    
    // Reset form
    setSeiNumber('');
    setMunicipio('');
    setRequerente('');
    setFaseAtual('inicio');
    
    // Auto-navigate to the detailed view after 1.5 seconds
    setTimeout(() => {
      onNavigate(type === 'AIA' ? 'AIA — Intervenção Ambiental' : type === 'DCF' ? 'DCF' : 'Simples Declaração', createdId);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Entrada / Triagem de Demanda</h1>
        <p className="text-slate-400 text-sm">Cadastre rapidamente os dados do processo SEI para obter direcionamento imediato sobre a rotina administrativa correspondente.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form panel */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <PlusCircle className="text-emerald-400" size={18} />
            Novo Registro de Processo
          </h2>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-800' : 'bg-red-950/30 text-red-400 border border-red-800'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Número SEI *</label>
                <input 
                  type="text" 
                  value={seiNumber}
                  onChange={e => {
                    const val = e.target.value;
                    setSeiNumber(val);
                    const clean = val.trim();
                    if (clean.startsWith('2300')) {
                      setType('AIA');
                    } else if (clean.startsWith('2100')) {
                      if (type === 'AIA') {
                        setType('DCF');
                      }
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Demanda *</label>
                <select 
                  value={type}
                  onChange={e => setType(e.target.value as Process['type'])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="AIA">AIA — Intervenção Ambiental</option>
                  <option value="DCF">DCF — Declaração de Colheita e Florestas</option>
                  <option value="Simples Declaração">Simples Declaração</option>
                  <option value="Restituição">Restituição de Taxas</option>
                  <option value="Vista/Cópia">Pedido de Vista / Cópia</option>
                  <option value="ASV">ASV / Autorização</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
            </div>

            {/* Phase selector — only for types with structured flow */}
            {(type === 'AIA' || type === 'DCF' || type === 'Simples Declaração') && (
              <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Em que fase o processo já está? *</label>
                <select
                  value={faseAtual}
                  onChange={e => setFaseAtual(e.target.value as typeof faseAtual)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="inicio">Início — processo novo, ainda na triagem</option>
                  <option value="conferencia">Em conferência documental (já recebi, ainda conferindo)</option>
                  {type === 'DCF' && <option value="aceite">Aceite já realizado — aguardando análise técnica</option>}
                  <option value="finalizacao">Em finalização — aguardando encerramento no SEI</option>
                </select>
                {faseAtual !== 'inicio' && (
                  <div className="flex items-start gap-2 text-amber-400 text-[11px]">
                    <Info size={12} className="shrink-0 mt-0.5" />
                    <span>As etapas anteriores serão marcadas automaticamente como concluídas.</span>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Interessado / Requerente *</label>
                <input 
                  type="text" 
                  value={requerente}
                  onChange={e => setRequerente(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Município da Intervenção *</label>
                <input 
                  type="text" 
                  value={municipio}
                  onChange={e => setMunicipio(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  list="municipios-suggestions"
                  required
                />
                <datalist id="municipios-suggestions">
                  {settings.municipiosGuanhaes.map(m => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Data de Entrada</label>
                <input 
                  type="date" 
                  value={dataEntrada}
                  onChange={e => setDataEntrada(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Responsável Interno</label>
                <input 
                  type="text" 
                  value={responsavelInterno}
                  onChange={e => setResponsavelInterno(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Unidade Local</label>
                <input 
                  type="text" 
                  value={unidadeAtual}
                  onChange={e => setUnidadeAtual(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Situação Inicial</label>
                <input 
                  type="text" 
                  value={situacao}
                  onChange={e => setSituacao(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Próxima Ação Sugerida</label>
                <input 
                  type="text" 
                  value={proximaAcao}
                  onChange={e => setProximaAcao(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input 
                type="checkbox" 
                id="acompanhamento" 
                checked={emAcompanhamentoEspecial}
                onChange={e => setEmAcompanhamentoEspecial(e.target.checked)}
                className="w-4 h-4 rounded border-slate-800 bg-slate-950 accent-emerald-500"
              />
              <label htmlFor="acompanhamento" className="text-xs text-slate-300 font-medium select-none cursor-pointer">
                Lançar automaticamente em Acompanhamento Especial
              </label>
            </div>

            <div className="flex justify-end pt-3">
              <button 
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm px-5 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-emerald-950/20 transition"
              >
                Cadastrar e Abrir Fluxo
              </button>
            </div>
          </form>
        </div>

        {/* Real-time triage assistant panel */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <HelpCircle className="text-sky-400" size={18} />
            Direcionamento de Fluxo
          </h2>

          <div className="space-y-4 text-xs">
            {municipio === '' ? (
              <p className="text-slate-400 italic">Digite o nome de um município para conferir regras territoriais.</p>
            ) : (
              <div className="space-y-3">
                {/* Rule 1: Guanhaes check */}
                {isGuanhaes ? (
                  <div className="p-3 bg-emerald-950/20 border border-emerald-900/50 rounded-lg flex gap-3 text-emerald-300">
                    <ShieldCheck className="text-emerald-400 shrink-0" size={18} />
                    <div>
                      <p className="font-semibold">NAR Guanhães</p>
                      <p className="text-[11px] text-slate-300 mt-0.5">O município pertence à abrangência direta do NAR Guanhães.</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-red-950/20 border border-red-900/50 rounded-lg flex gap-3 text-red-400">
                    <AlertTriangle className="text-red-400 shrink-0" size={18} />
                    <div>
                      <p className="font-semibold">Fora do NAR Guanhães</p>
                      <p className="text-[11px] text-slate-300 mt-0.5">Atenção! Este município não pertence ao NAR Guanhães. Verifique se deve encaminhar a outra unidade.</p>
                    </div>
                  </div>
                )}

                {/* Rule 2: AFLOBIO check for DCF */}
                {type === 'DCF' && (
                  <>
                    {isAflobio ? (
                      <div className="p-3 bg-amber-950/20 border border-amber-900/50 rounded-lg flex gap-3 text-amber-300">
                        <AlertTriangle className="text-amber-400 shrink-0" size={18} />
                        <div>
                          <p className="font-semibold text-amber-400">AFLOBIO Peçanha</p>
                          <p className="text-[11px] text-slate-300 mt-0.5">Atenção: Para DCF deste município, a análise técnica é realizada pela AFLOBIO Peçanha. Encaminhe o processo após formalização.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-emerald-950/20 border border-emerald-900/50 rounded-lg flex gap-3 text-emerald-300">
                        <ShieldCheck className="text-emerald-400 shrink-0" size={18} />
                        <div>
                          <p className="font-semibold">Atendimento Local</p>
                          <p className="text-[11px] text-slate-300 mt-0.5">A DCF deste município é de atendimento e análise técnica do próprio NAR Guanhães.</p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Rule 3: Simples Declaracao check */}
                {type === 'Simples Declaração' && (
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex gap-3 text-slate-300">
                    <CheckSquare className="text-sky-400 shrink-0" size={18} />
                    <div>
                      <p className="font-semibold text-white">Simples Declaração</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Lembrete: Toda Simples Declaração é analisada localmente pelo NAR em todos os municípios da circunscrição.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Static rules reminder */}
            <div className="border-t border-slate-800 pt-3 mt-2 space-y-2 text-slate-400">
              <p className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">Rotinas Gerais de Triage:</p>
              <ul className="list-disc pl-4 space-y-1 text-slate-400 leading-relaxed">
                <li><strong className="text-slate-300">AIA:</strong> Conferência preliminar no prazo de 5 dias e envio para Chefia validar a formalização.</li>
                <li><strong className="text-slate-300">NUREG:</strong> Caso necessite de apoio normativo ou compensações em unidades de conservação estaduais, enviar consulta técnica para o NUREG (URFBio Rio Doce).</li>
                <li><strong className="text-slate-300">LGPD:</strong> Jamais registre o CPF, RG ou dados bancários do interessado nas anotações gerais ou planilhas locais. Limite os dados aos campos estruturados e número do processo SEI.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
