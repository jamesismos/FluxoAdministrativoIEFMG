'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { Process } from '../types';
import { FileSpreadsheet, Download, Copy, Eye, FileText, Trash2 } from 'lucide-react';

export const PlanilhasRelatorios: React.FC = () => {
  const { processes, deleteProcess } = useApp();

  // Helper groupings
  const byType = processes.reduce((acc, p) => {
    acc[p.type] = (acc[p.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const byMunicipio = processes.reduce((acc, p) => {
    acc[p.municipio] = (acc[p.municipio] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const byStatus = processes.reduce((acc, p) => {
    acc[p.situacao] = (acc[p.situacao] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const active = processes.filter(p => !p.isFinalized);
  const finalized = processes.filter(p => p.isFinalized);

  // CSV Export Helper
  const handleExportCSV = () => {
    if (processes.length === 0) return;
    
    // Headers
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'ID;Processo SEI;Tipo;Requerente;Municipio;Situacao;Validador Chefia;Finalizado;Acompanhamento Especial\r\n';
    
    processes.forEach(p => {
      csvContent += `${p.id};"${p.seiNumber}";${p.type};"${p.requerente}";"${p.municipio}";"${p.situacao}";"${p.validacaoChefia}";${p.isFinalized ? 'SIM' : 'NAO'};${p.emAcompanhamentoEspecial ? 'SIM' : 'NAO'}\r\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `narflow_relatorio_fechamento_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy Markdown summary
  const handleCopyMarkdown = () => {
    const dataStr = new Date().toLocaleDateString('pt-BR');
    let md = `# RELATÓRIO OPERACIONAL - NAR FLOW (${dataStr})\n\n`;
    
    md += `## RESUMO DOS EXPEDIENTES\n`;
    md += `- **Processos Ativos em Tramitação:** ${active.length}\n`;
    md += `- **Processos Concluídos/Arquivados:** ${finalized.length}\n`;
    md += `- **Total Geral de Demandas Cadastradas:** ${processes.length}\n\n`;

    md += `### QUANTITATIVOS POR TIPO DE DEMANDA\n`;
    Object.entries(byType).forEach(([type, count]) => {
      md += `- **${type}:** ${count} processo(s)\n`;
    });
    
    md += `\n### DISTRIBUIÇÃO POR MUNICÍPIO\n`;
    Object.entries(byMunicipio).forEach(([mun, count]) => {
      md += `- **${mun}:** ${count} demanda(s)\n`;
    });

    md += `\n\n*Relatório gerado automaticamente via NAR Flow - Assistente Administrativo IEF.*`;

    navigator.clipboard.writeText(md);
    alert('Relatório formatado em Markdown copiado com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Planilhas & Relatórios</h1>
          <p className="text-slate-400 text-sm">Gere estatísticas de produtividade local, consolidações mensais e baixe arquivos tabulares para relatórios corporativos.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-semibold"
          >
            <Copy size={14} />
            Copiar Relatório MD
          </button>
          <button
            onClick={handleExportCSV}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-semibold"
          >
            <Download size={14} />
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Planilha 1 */}
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-lg space-y-2">
          <div className="flex items-center justify-between border-b border-slate-850 pb-1">
            <strong className="text-white">1. PLANILHA DE DCF (RIO DOCE)</strong>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">DCF</span>
          </div>
          <p className="text-slate-400">Controla todas as DCFs do regional. Preencher para cada DCF protocolada seguindo a organização proposta.</p>
          <div className="bg-red-950/20 border border-red-900/30 p-2 rounded text-[10px] text-red-400">
            <strong>Diretriz:</strong> Não inserir dados de DCFs recusadas.
          </div>
        </div>

        {/* Planilha 2 */}
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-lg space-y-2">
          <div className="flex items-center justify-between border-b border-slate-850 pb-1">
            <strong className="text-white">2. Controle Processos NAR e Aflobios</strong>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Geral</span>
          </div>
          <p className="text-slate-400">Controla toda a demanda executada no NAR Guanhães (DCFs, Simples declarações, intervenção ambiental, cadastro de senha, emissão de carteira de pesca, queima controlada, pedido de restituição e pedido de vista).</p>
        </div>

        {/* Planilha 3 */}
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-lg space-y-2">
          <div className="flex items-center justify-between border-b border-slate-850 pb-1">
            <strong className="text-white">3. Processos para análise do Paulo</strong>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Distribuição</span>
          </div>
          <p className="text-slate-400">Registrar as DCFs e Simples Declarações que forem encaminhadas diretamente para a análise do Paulo.</p>
        </div>

        {/* Planilha 4 */}
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-lg space-y-2">
          <div className="flex items-center justify-between border-b border-slate-850 pb-1">
            <strong className="text-white">4. Gestão processos AIA 2026</strong>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">AIA</span>
          </div>
          <p className="text-slate-400">Inserir todos os processos de intervenção ambiental do regional.</p>
          <div className="bg-slate-950 p-2 rounded text-[10px] text-slate-400">
            Abas: <strong>"Processos Ativos"</strong> (protocolados) | <strong>Abas mensais</strong> (inserir processos finalizados naquele mês).
          </div>
        </div>

        {/* Planilha 5 */}
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-lg space-y-2">
          <div className="flex items-center justify-between border-b border-slate-850 pb-1">
            <strong className="text-white">5. Gestão DCF, SD e Queima – 2026</strong>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Soma Mensal</span>
          </div>
          <p className="text-slate-400">Soma quantitativa de processos de DCF, simples declaração e queima controlada de cada mês.</p>
          <div className="bg-slate-950 p-2 rounded text-[10px] text-slate-400">
            <strong>Prazo:</strong> Preencher no início do mês seguinte, obrigatoriamente no período da tarde.
          </div>
        </div>

        {/* Planilha 6 */}
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-lg space-y-2">
          <div className="flex items-center justify-between border-b border-slate-850 pb-1">
            <strong className="text-white">6. Controle de Condicionantes _ NARGuanhães</strong>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Compensações</span>
          </div>
          <p className="text-slate-400">Inserir os processos de intervenção ambiental que tenham compensações a cumprir.</p>
          <div className="bg-amber-950/20 border border-amber-900/30 p-2 rounded text-[10px] text-amber-400">
            Acompanhar prazos. Se não cumpridos, informar ao Márcio para expedição de ofício. Colocar fluxo em <strong>"ACOMPANHAMENTO DE MEDIDAS COMPENSATÓRIAS"</strong>.
          </div>
        </div>

        {/* Planilha 7 */}
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-lg space-y-2 col-span-1 md:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-850 pb-1">
            <strong className="text-white">7. Controle arquivo NAR Guanhães</strong>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Arquivo Físico</span>
          </div>
          <p className="text-slate-400">Consulta de processos físicos arquivados localmente. Ao receber processo físico de outra unidade, registre aqui e arquive na respectiva caixa.</p>
          <div className="bg-sky-950/20 border border-sky-900/30 p-2 rounded text-[10px] text-sky-400">
            <strong>Aba Planilha 2:</strong> Contém o modelo para impressão e colagem identificadora nas novas caixas de arquivo.
          </div>
        </div>
      </div>

      {/* Database review table */}
      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3 text-xs">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">Base de Dados Local Completa</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[9px] tracking-wider">
                <th className="py-2 pr-2">Processo SEI</th>
                <th className="py-2 px-2">Tipo</th>
                <th className="py-2 px-2">Requerente</th>
                <th className="py-2 px-2">Município</th>
                <th className="py-2 px-2">Situação Atual</th>
                <th className="py-2 px-2 text-right">Status</th>
                <th className="py-2 pl-2 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {processes.map(p => (
                <tr key={p.id} className="hover:bg-slate-950/20">
                  <td className="py-2.5 pr-2 font-mono text-slate-100">{p.seiNumber}</td>
                  <td className="py-2.5 px-2"><span className="bg-slate-850 border border-slate-800 text-slate-400 px-1 rounded uppercase text-[9px]">{p.type}</span></td>
                  <td className="py-2.5 px-2 text-slate-300">{p.requerente}</td>
                  <td className="py-2.5 px-2 text-slate-300">{p.municipio}</td>
                  <td className="py-2.5 px-2 text-slate-400">{p.situacao}</td>
                  <td className="py-2.5 px-2 text-right">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${p.isFinalized ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'}`}>
                      {p.isFinalized ? 'Finalizado' : 'Ativo'}
                    </span>
                  </td>
                  <td className="py-2.5 pl-2 text-right">
                    <button 
                      onClick={() => {
                        if (confirm('Deseja realmente EXCLUIR este processo?')) {
                          deleteProcess(p.id);
                          alert('Processo excluído com sucesso!');
                        }
                      }}
                      className="text-slate-500 hover:text-red-400 p-1"
                      title="Excluir"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
