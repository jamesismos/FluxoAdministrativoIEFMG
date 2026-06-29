'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Process, ChecklistItem } from '../types';
import { FileText, Clipboard, Check, AlertCircle, RefreshCw, Copy, Save, CheckSquare, Trash2 } from 'lucide-react';

interface AiaProps {
  activeProcessId: string | null;
  onNavigate: (tab: string, processId?: string) => void;
}

export const Aia: React.FC<AiaProps> = ({ activeProcessId, onNavigate }) => {
  const { processes, updateProcess, deleteProcess, settings } = useApp();
  const [subTab, setSubTab] = useState<'geral' | 'docs' | 'checklist' | 'pendencias' | 'despacho' | 'memorando' | 'acompanhamento' | 'finalizacao'>('geral');

  // Load the current active process
  const process = processes.find(p => p.id === activeProcessId && p.type === 'AIA');

  // Local component states synced with process data
  const [empreendimento, setEmpreendimento] = useState('');
  const [intervencoes, setIntervencoes] = useState<string[]>([]);
  const [documentosColados, setDocumentosColados] = useState('');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [pendenciasText, setPendenciasText] = useState('');
  const [despachoGerado, setDespachoGerado] = useState('');
  const [memorandoGerado, setMemorandoGerado] = useState('');
  const [responsavelTecnico, setResponsavelTecnico] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Sync state when process changes
  useEffect(() => {
    if (process && process.aiaData) {
      setEmpreendimento(process.requerente || ''); // Default to interested party
      setIntervencoes(process.aiaData.intervencoes || []);
      setDocumentosColados(process.aiaData.documentosColados || '');
      setChecklist(process.aiaData.checklist || []);
      setPendenciasText(process.aiaData.pendenciasText || '');
      setDespachoGerado(process.aiaData.despachoGerado || '');
      setMemorandoGerado(process.aiaData.memorandoGerado || '');
      setResponsavelTecnico(process.responsavelInterno || '');
    }
  }, [activeProcessId, process]);

  if (!process) {
    return (
      <div className="py-12 text-center text-slate-500">
        <FileText size={48} className="mx-auto text-slate-700 mb-3" />
        <h2 className="text-lg font-bold text-white">Nenhum Processo AIA Ativo</h2>
        <p className="text-sm mt-1">Selecione ou crie um processo de Intervenção Ambiental na Triagem ou no Painel.</p>
        <button 
          onClick={() => onNavigate('Entrada / Triagem')}
          className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-lg font-semibold transition"
        >
          Criar Novo Processo
        </button>
      </div>
    );
  }

  // Intervention list options
  const aiaInterventionsList = [
    'Supressão de cobertura vegetal nativa para uso alternativo do solo',
    'Intervenção com supressão em APP',
    'Intervenção sem supressão em APP',
    'Supressão de sub-bosque nativo em áreas com florestas plantadas',
    'Manejo sustentável',
    'Destoca em área remanescente de supressão',
    'Corte ou aproveitamento de árvores isoladas nativas vivas',
    'Aproveitamento de material lenhoso'
  ];

  // Save the current state back to the context
  const handleSave = (silent = false) => {
    if (!activeProcessId) return;
    
    updateProcess(activeProcessId, {
      aiaData: {
        intervencoes,
        documentosColados,
        checklist,
        pendenciasText,
        despachoGerado,
        memorandoGerado
      }
    });

    if (!silent) {
      setFeedbackMsg('Dados salvos com sucesso!');
      setTimeout(() => setFeedbackMsg(''), 2000);
    }
  };

  // Run the SEI paste intelligent text parser
  const handleParseSEI = () => {
    if (!documentosColados.trim()) return;

    // Split text by lines
    const lines = documentosColados.split('\n');
    const parsedDocs: { title: string; number: string }[] = [];

    // Simple parser regex: looks for names and numbers in parentheses, e.g. "Projeto de Intervenção - PIA (141254799)"
    lines.forEach(line => {
      const match = line.match(/(.+?)\s*\((\d{7,10})\)/);
      if (match) {
        parsedDocs.push({
          title: match[1].trim(),
          number: match[2].trim()
        });
      }
    });

    if (parsedDocs.length === 0) {
      alert('Nenhum documento com número SEI entre parênteses foi detectado. Cole a árvore do SEI no formato "Nome do Doc (Número)".');
      return;
    }

    // Keyword matcher definitions
    const keywordMap: { keywords: string[]; itemIds: string[] }[] = [
      { keywords: ['requerimento', 'formulario', 'petição', 'solicitação'], itemIds: ['01'] },
      { keywords: ['identidade', 'cpf', 'rg', 'cnh', 'cnpj', 'identificação', 'endereço'], itemIds: ['02', '03'] },
      { keywords: ['procuração', 'procurador', 'mandato'], itemIds: ['04'] },
      { keywords: ['matrícula', 'posse', 'escritura', 'certidão de registro', 'imóvel', 'propriedade'], itemIds: ['05'] },
      { keywords: ['car', 'cadastro ambiental', 'recibo do car'], itemIds: ['06'] },
      { keywords: ['arrendamento', 'comodato', 'locação', 'parceria'], itemIds: ['07'] },
      { keywords: ['anuência', 'concordância', 'autorização proprietário'], itemIds: ['08'] },
      { keywords: ['planta', 'memorial', 'croqui', 'topográfica', 'desenho'], itemIds: ['09'] },
      { keywords: ['shapefile', 'kmz', 'kml', 'arquivo vetorial', 'digital vetorial', 'shapes'], itemIds: ['10'] },
      { keywords: ['pia', 'projeto de intervenção', 'projeto simplificado', 'pias', 'inventário florestal'], itemIds: ['11'] },
      { keywords: ['medida compensatória', 'compensação', 'termo de compromisso', 'ptrf', 'prada'], itemIds: ['12'] },
      { keywords: ['cerrado', 'lei 13.047'], itemIds: ['13'] },
      { keywords: ['expediente', 'dae expediente', 'taxa expediente'], itemIds: ['14'] },
      { keywords: ['taxa florestal', 'dae florestal', 'taxa de reposição'], itemIds: ['15'] },
      { keywords: ['fauna silvestre', 'fauna', 'inventariamento fauna', 'relatório de fauna'], itemIds: ['16'] },
      { keywords: ['resgate de fauna', 'salvamento', 'destinação de fauna'], itemIds: ['17'] },
      { keywords: ['caf', 'consumidores'], itemIds: ['18'] },
      { keywords: ['sinaflor', 'recibo sinaflor'], itemIds: ['19'] }
    ];

    // Go through our checklist and propose associations
    const updatedChecklist = checklist.map(item => {
      // Find matches for general items
      const mapMatch = keywordMap.find(m => m.itemIds.includes(item.id));
      if (mapMatch) {
        // Find if any parsed document matches keywords
        const matchingDoc = parsedDocs.find(doc => 
          mapMatch.keywords.some(kw => doc.title.toLowerCase().includes(kw))
        );

        if (matchingDoc) {
          return {
            ...item,
            status: 'SIM' as const,
            docVinculado: `${matchingDoc.title} (${matchingDoc.number})`,
            observacao: 'Sugerido e validado via parser SEI'
          };
        }
      }
      return item;
    });

    setChecklist(updatedChecklist);
    alert(`Parser executado! Encontrados ${parsedDocs.length} documentos. Sugestões inseridas no checklist.`);
  };

  // Generate pendencies text from unfulfilled items
  const handleGeneratePendencias = () => {
    const unfulfilled = checklist.filter(item => item.status === 'NÃO' || item.status === 'A VERIFICAR');
    if (unfulfilled.length === 0) {
      setPendenciasText('Nenhuma pendência encontrada. Todos os documentos necessários foram anexados.');
      return;
    }

    let text = `Após conferência preliminar da documentação apresentada para o processo SEI nº ${process.seiNumber}, em observância ao Decreto nº 47.749/2019 e à Resolução Conjunta SEMAD/IEF nº 3.102/2021, constatou-se a necessidade de saneamento e apresentação dos seguintes documentos/informações complementares:\n\n`;
    
    unfulfilled.forEach((item, index) => {
      text += `${index + 1}. [${item.id}] ${item.description}${item.fundamento ? ` (Fundamento: ${item.fundamento})` : ''};\n`;
    });

    text += `\nPrazo para resposta: 30 (trinta) dias, sob pena de indeferimento/arquivamento do feito nos termos da Lei Estadual nº 14.184/2002.`;
    setPendenciasText(text);
    setSubTab('pendencias');
  };

  // Generate dispatch text
  const handleGenerateDespacho = () => {
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const interventionsStr = intervencoes.join(', ');

    const text = `Processo SEI: ${process.seiNumber}
Interessado: ${process.requerente}
Intervenção Requerida: ${interventionsStr}
Município: ${process.municipio}

DESPACHO DE ACEITE E ENCAMINHAMENTO - NAR GUANHÃES

1. Realizada conferência preliminar formal em conformidade com as diretrizes da Resolução Conjunta SEMAD/IEF nº 3.102/2021. Constatou-se a presença das peças documentais mínimas obrigatórias para a regular instrução e formalização do processo.
2. Fica admitida a tramitação administrativa do feito, observando-se que a presente análise restringe-se aos aspectos meramente documentais de instrução, não vinculando, prejulgando ou substituindo a análise técnica de campo e de mérito a ser efetuada pela equipe competente.
3. Encaminhe-se à análise técnica do servidor ${responsavelTecnico} para vistoria in loco e elaboração do Parecer Técnico.

${settings.nomeUnidade}, ${dataAtual}.

__________________________________________
${settings.servidorPadrao}
Servidor Administrativo - ${settings.nomeUnidade}`;

    setDespachoGerado(text);
    setSubTab('despacho');
  };

  // Generate memorandum text
  const handleGenerateMemorando = () => {
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const ano = new Date().getFullYear();
    const interventionsStr = intervencoes.join(', ');

    const text = `MEMORANDO Nº ____/${ano} - ${settings.nomeUnidade}

Para: Setor Técnico / ${responsavelTecnico}
Assunto: Encaminhamento de processo para análise e parecer técnico de AIA
Processo SEI: ${process.seiNumber}
Interessado: ${process.requerente}
Intervenção: ${interventionsStr}
Município: ${process.municipio}

1. Encaminhamos para análise técnica o processo epigrafado, cuja triagem formal de documentos de instrução foi concluída favoravelmente (conforme Despacho de Aceite).
2. Solicita-se a realização de vistoria de campo e a emissão do competente Parecer Técnico Ambiental sobre a viabilidade da intervenção requerida.
3. Ponto de atenção/Orientação da Chefia (${settings.chefiaNome}): ${process.chefiaOrientacao || 'Sem anotações de dúvida cadastrada pela chefia.'}
4. Responsável pela condução da próxima etapa: ${responsavelTecnico}.

Atenciosamente,

__________________________________________
${settings.servidorPadrao}
${settings.nomeUnidade}`;

    setMemorandoGerado(text);
    setSubTab('memorando');
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado para a área de transferência!');
  };

  return (
    <div className="space-y-6">
      {/* Top action bar and title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2 py-0.5 rounded font-bold">AIA - Ativo</span>
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

      {/* Navigation tabs inside AIA */}
      <div className="flex flex-wrap gap-1 border-b border-slate-800 pb-px">
        <button 
          onClick={() => setSubTab('geral')}
          className={`px-3 py-2 text-xs font-semibold border-b-2 transition ${subTab === 'geral' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          A) Dados Gerais
        </button>
        <button 
          onClick={() => setSubTab('docs')}
          className={`px-3 py-2 text-xs font-semibold border-b-2 transition ${subTab === 'docs' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          B) Documentos SEI
        </button>
        <button 
          onClick={() => setSubTab('checklist')}
          className={`px-3 py-2 text-xs font-semibold border-b-2 transition ${subTab === 'checklist' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          C) Check-list
        </button>
        <button 
          onClick={() => setSubTab('pendencias')}
          className={`px-3 py-2 text-xs font-semibold border-b-2 transition ${subTab === 'pendencias' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          D) Pendências
        </button>
        <button 
          onClick={() => setSubTab('despacho')}
          className={`px-3 py-2 text-xs font-semibold border-b-2 transition ${subTab === 'despacho' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          E) Despacho Aceite
        </button>
        <button 
          onClick={() => setSubTab('memorando')}
          className={`px-3 py-2 text-xs font-semibold border-b-2 transition ${subTab === 'memorando' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          F) Memorando Técnico
        </button>
        <button 
          onClick={() => setSubTab('acompanhamento')}
          className={`px-3 py-2 text-xs font-semibold border-b-2 transition ${subTab === 'acompanhamento' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          G) Acompanhamento
        </button>
        <button 
          onClick={() => setSubTab('finalizacao')}
          className={`px-3 py-2 text-xs font-semibold border-b-2 transition ${subTab === 'finalizacao' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          H) Finalização
        </button>
      </div>

      {/* Tabs panels */}
      <div className="bg-slate-900/30 border border-slate-800/80 p-5 rounded-xl min-h-[300px]">
        {/* Tab A: Dados Gerais */}
        {subTab === 'geral' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">Tipos de Intervenção Requeridos</h3>
                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                  {aiaInterventionsList.map(int => (
                    <div key={int} className="flex items-start gap-2 py-1">
                      <input 
                        type="checkbox" 
                        id={int}
                        checked={intervencoes.includes(int)}
                        onChange={e => {
                          if (e.target.checked) setIntervencoes(prev => [...prev, int]);
                          else setIntervencoes(prev => prev.filter(item => item !== int));
                        }}
                        className="w-4 h-4 rounded border-slate-800 bg-slate-900 accent-emerald-500 mt-0.5"
                      />
                      <label htmlFor={int} className="text-xs text-slate-300 cursor-pointer select-none leading-tight">{int}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">Dados do Imóvel / Formalização</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Empreendimento / Fazenda</label>
                    <input 
                      type="text" 
                      value={empreendimento}
                      onChange={e => setEmpreendimento(e.target.value)}
                      placeholder="Nome da propriedade ou empreendimento"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Responsável Técnico Sugerido</label>
                    <input 
                      type="text"
                      value={responsavelTecnico}
                      onChange={e => setResponsavelTecnico(e.target.value)}
                      placeholder="Nome do técnico responsável"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-xs space-y-1 text-slate-300">
                    <p className="font-semibold text-white">Regras de Formalização IEF:</p>
                    <p>De acordo com o Decreto 47.749/19, intervenções que dependam de compensação ambiental de Mata Atlântica devem obrigatoriamente apresentar Proposta de Compensação detalhada (Estudo de Alternativa Locacional - APP).</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
              <button 
                onClick={() => { handleSave(true); setSubTab('docs'); }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
              >
                Salvar e Prosseguir
              </button>
            </div>
          </div>
        )}

        {/* Tab B: Documentos SEI */}
        {subTab === 'docs' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">Árvore de Documentos SEI</h3>
              <p className="text-slate-400 text-xs">Cole toda a listagem de arquivos gerada pelo SEI abaixo. O matcher inteligente irá extrair os números SEI e preencher as sugestões do check-list.</p>
            </div>

            <textarea 
              value={documentosColados}
              onChange={e => setDocumentosColados(e.target.value)}
              placeholder="Exemplo para colar:&#10;Requerimento de Intervenção (141254111)&#10;Identidade do Requerente (141254112)&#10;Planta Topográfica (141254115)&#10;Shapefile (.zip) (141254118)"
              className="w-full h-48 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
            />

            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <span className="text-slate-500 text-xs">O parser procura por padrões tipo "Nome do Documento (NÚMERO_SEI)"</span>
              <div className="flex gap-2">
                <button 
                  onClick={handleParseSEI}
                  className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition"
                >
                  <RefreshCw size={14} />
                  Processar e Matcher Inteligente
                </button>
                <button 
                  onClick={() => { handleSave(true); setSubTab('checklist'); }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
                >
                  Ir para Check-list
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab C: Check-list */}
        {subTab === 'checklist' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">Conferência Documental (Resolução 3102/2021)</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const allNA = checklist.map(item => ({ ...item, status: 'NÃO SE APLICA' as const }));
                    setChecklist(allNA);
                  }}
                  className="text-[10px] text-slate-400 hover:text-white"
                >
                  Marcar todos N/A
                </button>
                <button 
                  onClick={() => {
                    const allSIM = checklist.map(item => ({ ...item, status: 'SIM' as const }));
                    setChecklist(allSIM);
                  }}
                  className="text-[10px] text-slate-400 hover:text-white"
                >
                  Marcar todos SIM
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-[450px] overflow-y-auto pr-2">
              {checklist.map((item, idx) => (
                <div key={item.id} className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1 md:max-w-[60%]">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-800 text-slate-300 font-bold px-1.5 py-0.5 rounded text-[10px]">{item.id}</span>
                      <strong className="text-white text-xs">{item.description}</strong>
                    </div>
                    {item.fundamento && (
                      <p className="text-[10px] text-slate-400 italic">Fundamento: {item.fundamento}</p>
                    )}
                    {item.docVinculado && (
                      <p className="text-sky-400 font-semibold text-[10px]">Anexo SEI: {item.docVinculado}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Status selectors */}
                    <div className="flex rounded-lg overflow-hidden border border-slate-800">
                      {(['SIM', 'NÃO', 'A VERIFICAR', 'NÃO SE APLICA'] as const).map(st => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => {
                            const updated = [...checklist];
                            updated[idx].status = st;
                            setChecklist(updated);
                          }}
                          className={`px-2 py-1 text-[10px] font-bold transition ${item.status === st ? (st === 'SIM' ? 'bg-emerald-600 text-white' : st === 'NÃO' ? 'bg-red-600 text-white' : st === 'A VERIFICAR' ? 'bg-yellow-600 text-white' : 'bg-slate-700 text-white') : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
                        >
                          {st === 'NÃO SE APLICA' ? 'N/A' : st}
                        </button>
                      ))}
                    </div>

                    <input 
                      type="text" 
                      value={item.observacao}
                      onChange={e => {
                        const updated = [...checklist];
                        updated[idx].observacao = e.target.value;
                        setChecklist(updated);
                      }}
                      placeholder="Observação..."
                      className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[10px] text-slate-300 focus:outline-none focus:border-emerald-500 w-36"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between border-t border-slate-800 pt-4">
              <button 
                onClick={handleGeneratePendencias}
                className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1 transition"
              >
                <AlertCircle size={14} />
                Gerar Lista de Pendências
              </button>
              <button 
                onClick={() => { handleSave(true); setSubTab('pendencias'); }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
              >
                Salvar e Ver Pendências
              </button>
            </div>
          </div>
        )}

        {/* Tab D: Pendencias */}
        {subTab === 'pendencias' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">Minuta de Notificação de Pendências</h3>
                <p className="text-slate-400 text-xs">Texto pré-elaborado com todos os itens marcados como NÃO ou A VERIFICAR para envio ao interessado.</p>
              </div>
              <button 
                onClick={() => handleCopyToClipboard(pendenciasText)}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs px-3 py-1.5 rounded flex items-center gap-1.5 transition"
              >
                <Copy size={12} />
                Copiar Texto SEI
              </button>
            </div>

            <textarea 
              value={pendenciasText}
              onChange={e => setPendenciasText(e.target.value)}
              className="w-full h-64 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
            />

            <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
              <button 
                onClick={handleGenerateDespacho}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
              >
                Gerar Despacho de Aceite
              </button>
            </div>
          </div>
        )}

        {/* Tab E: Despacho */}
        {subTab === 'despacho' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">Despacho de Aceite Documental</h3>
                <p className="text-slate-400 text-xs">Decisão administrativa de formalização para ser colada no SEI.</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleGenerateDespacho}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded border border-slate-800"
                >
                  Regerar
                </button>
                <button 
                  onClick={() => handleCopyToClipboard(despachoGerado)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded flex items-center gap-1.5 transition"
                >
                  <Copy size={12} />
                  Copiar Texto SEI
                </button>
              </div>
            </div>

            <textarea 
              value={despachoGerado}
              onChange={e => setDespachoGerado(e.target.value)}
              className="w-full h-64 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
            />

            <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
              <button 
                onClick={handleGenerateMemorando}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
              >
                Gerar Memorando Técnico
              </button>
            </div>
          </div>
        )}

        {/* Tab F: Memorando */}
        {subTab === 'memorando' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">Memorando para Análise Técnica</h3>
                <p className="text-slate-400 text-xs">Encaminhamento interno para realização de vistoria e parecer.</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleGenerateMemorando}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded border border-slate-800"
                >
                  Regerar
                </button>
                <button 
                  onClick={() => handleCopyToClipboard(memorandoGerado)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded flex items-center gap-1.5 transition"
                >
                  <Copy size={12} />
                  Copiar Texto SEI
                </button>
              </div>
            </div>

            <textarea 
              value={memorandoGerado}
              onChange={e => setMemorandoGerado(e.target.value)}
              className="w-full h-64 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
            />

            <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
              <button 
                onClick={() => { handleSave(true); setSubTab('acompanhamento'); }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
              >
                Ir para Acompanhamento
              </button>
            </div>
          </div>
        )}

        {/* Tab G: Acompanhamento */}
        {subTab === 'acompanhamento' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">Configurações de Tramitação e Chefia</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
                <h4 className="font-semibold text-white">Validação da Chefia ({settings.chefiaNome})</h4>
                
                <div>
                  <label className="block text-slate-400 mb-1">Status de Validação</label>
                  <select 
                    value={process.validacaoChefia}
                    onChange={e => updateProcess(process.id, { validacaoChefia: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-white"
                  >
                    <option value="Não precisa">Não precisa</option>
                    <option value="Aguardando chefia">Aguardando chefia</option>
                    <option value="Validado pela chefia">Validado pela chefia</option>
                    <option value="Ajustar minuta">Ajustar minuta</option>
                    <option value="Encaminhar para Supervisão">Encaminhar para Supervisão</option>
                    <option value="Aguardando assinatura da Supervisão">Aguardando assinatura da Supervisão</option>
                    <option value="Retornou assinado">Retornou assinado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Orientação da Chefia / Notas Internas</label>
                  <textarea 
                    value={process.chefiaOrientacao}
                    onChange={e => updateProcess(process.id, { chefiaOrientacao: e.target.value })}
                    className="w-full h-20 bg-slate-900 border border-slate-800 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
                <h4 className="font-semibold text-white">Acompanhamento Especial</h4>
                
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="emAcomp"
                    checked={process.emAcompanhamentoEspecial}
                    onChange={e => updateProcess(process.id, { emAcompanhamentoEspecial: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-850 bg-slate-900 accent-emerald-500"
                  />
                  <label htmlFor="emAcomp" className="text-slate-300 font-semibold cursor-pointer">Manter em Acompanhamento Especial</label>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Aba / Tipo do Acompanhamento</label>
                  <input 
                    type="text"
                    value={process.acompanhamentoTipo}
                    onChange={e => updateProcess(process.id, { acompanhamentoTipo: e.target.value })}
                    placeholder="Ex: Intervenção Ambiental"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Situação de Acompanhamento</label>
                  <input 
                    type="text"
                    value={process.situacao}
                    onChange={e => updateProcess(process.id, { situacao: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Próxima Ação Planejada</label>
                  <input 
                    type="text"
                    value={process.proximaAcao}
                    onChange={e => updateProcess(process.id, { proximaAcao: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
              <button 
                onClick={() => { handleSave(true); setSubTab('finalizacao'); }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
              >
                Ir para Finalização
              </button>
            </div>
          </div>
        )}

        {/* Tab H: Finalizacao */}
        {subTab === 'finalizacao' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">Conclusão do Processo e Fechamento</h3>
            
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-4 text-xs">
              <p className="text-slate-400 leading-relaxed">Quando a análise técnica for concluída e a decisão final (deferimento, indeferimento ou arquivamento) for assinada pela Supervisão Regional, proceda com o arquivamento operacional no NAR:</p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="isFinalized"
                    checked={process.isFinalized}
                    onChange={e => updateProcess(process.id, { isFinalized: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-850 bg-slate-900 accent-emerald-500"
                  />
                  <label htmlFor="isFinalized" className="text-slate-300 font-semibold cursor-pointer">Processo Finalizado administrativamente</label>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Mover para Bloco Interno SEI</label>
                <select 
                  value={process.blocoInterno}
                  onChange={e => updateProcess(process.id, { blocoInterno: e.target.value })}
                  className="w-full md:w-1/2 bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-white"
                >
                  <option value="">Nenhum bloco selecionado</option>
                  <option value="Intervenção ambiental finalizada">Intervenção ambiental finalizada</option>
                  <option value="Indeferido tributário">Indeferido tributário</option>
                  <option value="Acompanhamento de medidas compensatórias">Acompanhamento de medidas compensatórias</option>
                  <option value="Outros">Outros</option>
                </select>
                <p className="text-[10px] text-slate-500 mt-1 italic">Conforme orientação da chefia: processos finalizados não devem ficar em Acompanhamento Especial. Remova da Fila Ativa e direcione a um bloco interno.</p>
              </div>

              <div className="bg-amber-950/20 border border-amber-900/50 p-3 rounded-lg text-amber-300 flex items-start gap-2">
                <AlertCircle className="shrink-0 mt-0.5" size={16} />
                <div>
                  <p className="font-semibold">Revisão de Fechamento Mensal</p>
                  <p className="text-[10px] text-slate-300 mt-0.5">Após marcar como finalizado e selecionar o bloco interno, o processo sairá da Fila do Painel de pendências urgentes e constará nos relatórios mensais de produtividade do NAR.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
              <button 
                onClick={() => {
                  handleSave(true);
                  onNavigate('Painel');
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
              >
                Concluir Fluxo e Voltar ao Painel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
