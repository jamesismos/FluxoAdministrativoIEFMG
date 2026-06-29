'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Copy, FileText, Check } from 'lucide-react';

interface Template {
  name: string;
  category: 'AIA' | 'DCF' | 'Restituição' | 'Outros';
  body: string;
}

export const ModelosSEI: React.FC = () => {
  const { processes, settings } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'AIA' | 'DCF' | 'Restituição' | 'Outros' | 'Todos'>('Todos');
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);
  
  // Variable inputs
  const [selectedProcessId, setSelectedProcessId] = useState('');
  const [processoSei, setProcessoSei] = useState('1370.01.0023456/2026-89');
  const [interessado, setInteressado] = useState('Fazenda Santa Rita Ltda');
  const [municipio, setMunicipio] = useState('Guanhães');
  const [propriedade, setPropriedade] = useState('Fazenda Santa Rita');
  const [tipoIntervencao, setTipoIntervencao] = useState('Supressão de cobertura vegetal nativa para uso alternativo do solo');
  const [documentosPendentes, setDocumentosPendentes] = useState('Recibo SINAFLOR, Proposta de Medidas Compensatórias');
  const [servidor, setServidor] = useState(settings.servidorPadrao);
  const [unidade, setUnidade] = useState(settings.nomeUnidade);

  const templates: Template[] = [
    {
      name: 'Despacho de Aceite Documental AIA',
      category: 'AIA',
      body: `Processo SEI: {{processo_sei}}
Interessado: {{interessado}}
Intervenção Requerida: {{tipo_intervencao}}
Município: {{municipio}}

DESPACHO DE ACEITE DOCUMENTAL — INTERVENÇÃO AMBIENTAL

1. Após conferência formal da documentação regulamentar anexada aos autos sob o processo nº {{processo_sei}}, com fulcro na Resolução Conjunta SEMAD/IEF nº 3.102/2021, atesta-se a conformidade documental preliminar das peças.
2. Defiro a formalização do presente pedido de intervenção ambiental. Registre-se nas planilhas de controle local.
3. Encaminhe-se o feito à análise técnica do servidor designado para fins de vistoria de campo e elaboração do Parecer Técnico conclusivo.

{{unidade}}, {{data}}.
____________________________________
{{servidor}}
NAR Guanhães`
    },
    {
      name: 'Despacho de Recusa Documental AIA',
      category: 'AIA',
      body: `Processo SEI: {{processo_sei}}
Interessado: {{interessado}}

DESPACHO DE RECUSA E INSUFICIÊNCIA DE INSTRUÇÃO DOCUMENTAL

1. Realizada a conferência preliminar da documentação de instrução apresentada no âmbito do processo nº {{processo_sei}}, constatou-se a ausência e incompatibilidade dos seguintes elementos essenciais, conforme regulamento:
   - {{documentos_pendentes}}
2. Sendo assim, sob a égide da Resolução Conjunta SEMAD/IEF nº 3.102/2021, recuso a formalização administrativa imediata do pleito.
3. Intime-se o interessado para, no prazo peremptório de 30 (trinta) dias, sob pena de indeferimento tácito por inércia processual (conforme Lei Estadual nº 14.184/2002), proceder ao saneamento das referidas peças documentais.

{{unidade}}, {{data}}.
____________________________________
{{servidor}}
NAR Guanhães`
    },
    {
      name: 'Memorando de Análise Técnica AIA',
      category: 'AIA',
      body: `MEMORANDO Nº ____/{{ano}} - {{unidade}}

Para: Setor de Análise Técnica / Engenharia Florestal
Assunto: Solicitação de vistoria e parecer técnico - AIA
Processo SEI: {{processo_sei}}
Interessado: {{interessado}}

1. Encaminhamos o processo epigrafado, cuja formalização administrativa documental foi validada favoravelmente.
2. Solicita-se a inclusão do referido feito no cronograma de vistorias técnicas do núcleo para validação da intervenção requerida ({{tipo_intervencao}}) na propriedade {{propriedade}}, localizada no município de {{municipio}}.
3. Após o ato fiscal/técnico, anexar o competente Laudo e Parecer Técnico no SEI.

Atenciosamente,
____________________________________
{{servidor}}
{{unidade}}`
    },
    {
      name: 'Despacho de Informação Complementar',
      category: 'AIA',
      body: `Processo SEI: {{processo_sei}}

DESPACHO DE SOLICITAÇÃO DE INFORMAÇÃO COMPLEMENTAR

1. Após análise técnica detalhada das peças que instruem o processo nº {{processo_sei}}, constatou-se a necessidade de complementações de caráter técnico para a correta avaliação do feito:
   - {{documentos_pendentes}}
2. Fica o requerente intimado a apresentar os referidos estudos e esclarecimentos adicionais sob pena de arquivamento por inércia nos moldes do regulamento ambiental.

{{unidade}}, {{data}}.
____________________________________
Chefia do Núcleo - {{chefia_nome}}`
    },
    {
      name: 'Decisão de Deferimento de AIA',
      category: 'AIA',
      body: `DECISÃO DE DEFERIMENTO DE AUTORIZAÇÃO PARA INTERVENÇÃO AMBIENTAL

Processo SEI: {{processo_sei}}
Interessado: {{interessado}}

1. Tendo em vista o Parecer Técnico Favorável encartado nos autos, o qual atesta a viabilidade ambiental da atividade de {{tipo_intervencao}} na propriedade {{propriedade}}, município de {{municipio}}, e considerando o cumprimento integral das obrigações compensatórias e financeiras exigidas, DEFIRO a emissão da correspondente Autorização de Intervenção Ambiental (AIA).
2. O beneficiário deverá cumprir rigorosamente as condicionantes listadas na Autorização sob pena de aplicação de penalidades.

{{unidade}}, {{data}}.
____________________________________
Supervisão Regional / Chefia local`
    },
    {
      name: 'Despacho de Aceite DCF',
      category: 'DCF',
      body: `Processo SEI: {{processo_sei}}
Interessado: {{interessado}}

DESPACHO DE ACEITE ADMINISTRATIVO — DCF

1. Em análise documental das peças de instrução apresentadas na Declaração de Colheita e Florestas (DCF) sob o processo nº {{processo_sei}}, atesta-se a regularidade formal, incluindo a comprovação das taxas estaduais devidas.
2. Defiro o recebimento e trâmite do presente expediente. 
3. Encaminhe-se ao setor técnico / NUREG para homologação final.

{{unidade}}, {{data}}.
____________________________________
{{servidor}}`
    },
    {
      name: 'Despacho Cadastro Saldo SIAM/CAF',
      category: 'DCF',
      body: `Processo SEI: {{processo_sei}}
Interessado: {{interessado}}

DESPACHO DE LIBERAÇÃO DE SALDO FLORESTAL — SIAM

1. Amparado na homologação do Parecer Técnico Favorável de colheita florestal plantada referente ao processo SEI {{processo_sei}}, determino o imediato lançamento do saldo correspondente no Sistema SIAM em nome do declarante {{interessado}}, liberando os volumes para emissão das devidas guias de trânsito de carvão/madeira (CAF/SIAM).
2. Proceda-se à baixa do processo na planilha de acompanhamento ativo do NAR.

{{unidade}}, {{data}}.
____________________________________
Chefia do Núcleo - {{chefia_nome}}`
    },
    {
      name: 'Declaração Restituição Taxas (Res. 1914)',
      category: 'Restituição',
      body: `DECLARAÇÃO DE INEXISTÊNCIA DE FATO GERADOR — RESTITUIÇÃO TRIBUTÁRIA

Declara-se para os fins da Resolução Conjunta SEMAD/IEF nº 1.914/2013, que o Documento de Arrecadação Estadual - DAE nº {{documentos_pendentes}} emitido pelo interessado {{interessado}}, no valor de R$ ______ em data de __/__/____, NÃO foi utilizado em processos deste Núcleo de Apoio Regional Guanhães, restando verificado que não houve o consumo/fato gerador da taxa florestal ou de expediente correspondente. O interessado está habilitado a requerer a devolução perante a SEF-MG.

{{unidade}}, {{data}}.
____________________________________
{{servidor}}
${settings.nomeUnidade}`
    }
  ];

  // Fill fields from active process
  const handleProcessChange = (procId: string) => {
    setSelectedProcessId(procId);
    const proc = processes.find(p => p.id === procId);
    if (proc) {
      setProcessoSei(proc.seiNumber);
      setInteressado(proc.requerente);
      setMunicipio(proc.municipio);
      setPropriedade(proc.requerente); // fallback
      setTipoIntervencao(proc.type === 'AIA' ? (proc.aiaData?.intervencoes.join(', ') || 'Intervenção Geral') : proc.type);
    }
  };

  const getSubstitutedTemplate = (templateBody: string) => {
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const anoStr = new Date().getFullYear().toString();

    return templateBody
      .replace(/{{processo_sei}}/g, processoSei)
      .replace(/{{interessado}}/g, interessado)
      .replace(/{{municipio}}/g, municipio)
      .replace(/{{propriedade}}/g, propriedade)
      .replace(/{{tipo_intervencao}}/g, tipoIntervencao)
      .replace(/{{documentos_pendentes}}/g, documentosPendentes)
      .replace(/{{servidor}}/g, servidor)
      .replace(/{{unidade}}/g, unidade)
      .replace(/{{chefia_nome}}/g, settings.chefiaNome)
      .replace(/{{data}}/g, dataAtual)
      .replace(/{{ano}}/g, anoStr);
  };

  const filteredTemplates = templates.filter(t => selectedCategory === 'Todos' || t.category === selectedCategory);
  const activeTemplateBody = filteredTemplates[selectedTemplateIndex] 
    ? getSubstitutedTemplate(filteredTemplates[selectedTemplateIndex].body) 
    : '';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Biblioteca de Modelos SEI</h1>
        <p className="text-slate-400 text-sm">Gere minutas prontas de despachos, memorandos e certidões oficiais. Insira as variáveis abaixo e copie o resultado final direto para o SEI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Variable Inputs */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4 text-xs">
          <div className="border-b border-slate-800 pb-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-slate-350">Preenchimento de Variáveis</h2>
            <div className="mt-2">
              <label className="block text-slate-400 mb-1">Preencher a partir de um Processo Ativo</label>
              <select 
                value={selectedProcessId}
                onChange={e => handleProcessChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-white"
              >
                <option value="">Selecione um processo...</option>
                {processes.map(p => (
                  <option key={p.id} value={p.id}>{p.seiNumber} ({p.requerente.substring(0, 15)}...)</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-slate-400 mb-1">Processo SEI</label>
              <input type="text" value={processoSei} onChange={e => setProcessoSei(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded px-2 py-1 text-white font-mono" />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Interessado / Produtor</label>
              <input type="text" value={interessado} onChange={e => setInteressado(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded px-2 py-1 text-white" />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Município da Área</label>
              <input type="text" value={municipio} onChange={e => setMunicipio(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded px-2 py-1 text-white" />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Empreendimento / Propriedade</label>
              <input type="text" value={propriedade} onChange={e => setPropriedade(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded px-2 py-1 text-white" />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Intervenção / Atividade</label>
              <input type="text" value={tipoIntervencao} onChange={e => setTipoIntervencao(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded px-2 py-1 text-white" />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Pendências / Documentos extras (separados por vírgula)</label>
              <input type="text" value={documentosPendentes} onChange={e => setDocumentosPendentes(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded px-2 py-1 text-white" />
            </div>
          </div>
        </div>

        {/* Templates Selection & Display */}
        <div className="lg:col-span-2 space-y-4 text-xs">
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-3">
            {/* Category filter */}
            <div className="flex gap-2 border-b border-slate-800 pb-2">
              {(['Todos', 'AIA', 'DCF', 'Restituição', 'Outros'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setSelectedTemplateIndex(0); }}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold ${selectedCategory === cat ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-450 hover:bg-slate-800'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Template list */}
              <div className="md:col-span-1 border-r border-slate-800 pr-2 space-y-1 max-h-[300px] overflow-y-auto">
                {filteredTemplates.map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTemplateIndex(idx)}
                    className={`w-full text-left p-2 rounded text-[11px] block transition ${selectedTemplateIndex === idx ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:bg-slate-900'}`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>

              {/* Template Body Preview */}
              <div className="md:col-span-2 space-y-2">
                {filteredTemplates.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between">
                      <strong className="text-white">{filteredTemplates[selectedTemplateIndex].name}</strong>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(activeTemplateBody);
                          alert('Copiado para a área de transferência!');
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded flex items-center gap-1.5 transition font-semibold"
                      >
                        <Copy size={12} />
                        Copiar Minuta SEI
                      </button>
                    </div>

                    <textarea
                      readOnly
                      value={activeTemplateBody}
                      className="w-full h-80 bg-slate-950 border border-slate-850 rounded p-3 font-mono text-[10px] text-slate-300 focus:outline-none"
                    />
                  </>
                ) : (
                  <p className="text-slate-500 italic">Nenhum modelo disponível para esta categoria.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
