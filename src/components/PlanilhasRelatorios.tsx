'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { Process } from '../types';
import { FileSpreadsheet, Download, Copy, Eye, FileText } from 'lucide-react';

export const PlanilhasRelatorios: React.FC = () => {
  const { processes } = useApp();

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        {/* Total stats */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-slate-350 border-b border-slate-850 pb-2">Volume de Trabalho</h2>
          
          <div className="space-y-3">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex justify-between items-center text-slate-300">
              <span>Fila Ativa de Processos:</span>
              <strong className="text-white text-sm">{active.length}</strong>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex justify-between items-center text-slate-300">
              <span>Processos Finalizados:</span>
              <strong className="text-emerald-400 text-sm">{finalized.length}</strong>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex justify-between items-center text-slate-300">
              <span>Total de Cadastros:</span>
              <strong className="text-white text-sm">{processes.length}</strong>
            </div>
          </div>
        </div>

        {/* Demand grouping */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-slate-350 border-b border-slate-850 pb-2">Demandas por Tipo</h2>
          
          <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
            {Object.keys(byType).length === 0 ? (
              <p className="text-slate-500 italic text-[11px]">Nenhum processo cadastrado.</p>
            ) : (
              Object.entries(byType).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center text-slate-300 border-b border-slate-900 pb-1">
                  <span>{type}:</span>
                  <strong className="text-white">{count}</strong>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Municipality grouping */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-slate-350 border-b border-slate-850 pb-2">Distribuição Territorial</h2>
          
          <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
            {Object.keys(byMunicipio).length === 0 ? (
              <p className="text-slate-500 italic text-[11px]">Nenhum processo cadastrado.</p>
            ) : (
              Object.entries(byMunicipio).map(([mun, count]) => (
                <div key={mun} className="flex justify-between items-center text-slate-300 border-b border-slate-900 pb-1">
                  <span>{mun}:</span>
                  <strong className="text-white">{count}</strong>
                </div>
              ))
            )}
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
                <th className="py-2 pl-2 text-right">Status</th>
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
                  <td className="py-2.5 pl-2 text-right">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${p.isFinalized ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'}`}>
                      {p.isFinalized ? 'Finalizado' : 'Ativo'}
                    </span>
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
