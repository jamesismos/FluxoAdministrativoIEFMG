'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Save, Download, Upload, RefreshCw } from 'lucide-react';

export const Configuracoes: React.FC = () => {
  const { settings, updateSettings, exportData, importData, resetAllData } = useApp();

  // Local settings states
  const [nomeUnidade, setNomeUnidade] = useState(settings.nomeUnidade);
  const [servidorPadrao, setServidorPadrao] = useState(settings.servidorPadrao);
  const [chefiaNome, setChefiaNome] = useState(settings.chefiaNome);
  const [chefiaUnidade, setChefiaUnidade] = useState(settings.chefiaUnidade);
  const [chefiaFuncao, setChefiaFuncao] = useState(settings.chefiaFuncao);
  const [chefiaObservacoesPadrao, setChefiaObservacoesPadrao] = useState(settings.chefiaObservacoesPadrao);
  
  const [importJsonText, setImportJsonText] = useState('');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    updateSettings({
      nomeUnidade,
      servidorPadrao,
      chefiaNome,
      chefiaUnidade,
      chefiaFuncao,
      chefiaObservacoesPadrao
    });

    alert('Configurações atualizadas localmente!');
  };

  const handleExport = () => {
    const dataStr = exportData();
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataUri);
    downloadAnchor.setAttribute('download', `narflow_backup_${new Date().toISOString().substring(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

  const handleImport = () => {
    if (!importJsonText.trim()) return;
    const success = importData(importJsonText);
    if (success) {
      alert('Dados importados com sucesso! Recarregando configurações...');
      window.location.reload();
    } else {
      alert('Falha na importação. Verifique a sintaxe JSON.');
    }
  };

  const handleReset = () => {
    if (confirm('ATENÇÃO: Isso apagará TODOS os registros locais (processos, saídas, DAEs) e redefinirá os padrões de fábrica. Deseja prosseguir?')) {
      resetAllData();
      alert('Base de dados limpa. Recarregando...');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Configurações Gerais do Sistema</h1>
        <p className="text-slate-400 text-sm">Ajuste os parâmetros operacionais locais, configure os dados da Chefia do Núcleo e realize backups.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form settings */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4 text-xs">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-850 pb-2">
            <Settings className="text-emerald-400" size={16} />
            Parâmetros Gerais da Unidade e Servidores
          </h2>

          <form onSubmit={handleSaveSettings} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Nome da Unidade Local</label>
                <input type="text" value={nomeUnidade} onChange={e => setNomeUnidade(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-white" />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nome do Servidor Padrão</label>
                <input type="text" value={servidorPadrao} onChange={e => setServidorPadrao(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-white" />
              </div>
            </div>

            <div className="border-t border-slate-850 pt-3">
              <h3 className="font-bold text-slate-350 mb-2 uppercase tracking-wider text-[10px]">Chefia do Núcleo (Validador Geral)</h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Nome Chefia</label>
                  <input type="text" value={chefiaNome} onChange={e => setChefiaNome(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Unidade Chefia</label>
                  <input type="text" value={chefiaUnidade} onChange={e => setChefiaUnidade(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Função / Cargo</label>
                  <input type="text" value={chefiaFuncao} onChange={e => setChefiaFuncao(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-white" />
                </div>
              </div>
              <div className="mt-2">
                <label className="block text-slate-400 mb-1">Orientação Padrão da Chefia</label>
                <textarea value={chefiaObservacoesPadrao} onChange={e => setChefiaObservacoesPadrao(e.target.value)} className="w-full h-16 bg-slate-950 border border-slate-850 rounded p-2 text-white" />
              </div>
            </div>



            <div className="flex justify-end pt-2">
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-1 transition">
                <Save size={14} />
                Salvar Configurações
              </button>
            </div>
          </form>
        </div>

        {/* Database & backup panels */}
        <div className="space-y-4 text-xs">
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-slate-350 border-b border-slate-850 pb-2">Backup de Segurança</h2>
            
            <p className="text-slate-400">Todo o fluxo administrativo é armazenado localmente em seu navegador. Baixe a base de dados em formato JSON para fins de backup físico.</p>
            <button 
              onClick={handleExport}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 border border-slate-700 transition"
            >
              <Download size={14} />
              Exportar Banco de Dados (JSON)
            </button>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-slate-350 border-b border-slate-850 pb-2">Restaurar Banco de Dados</h2>
            
            <textarea 
              value={importJsonText}
              onChange={e => setImportJsonText(e.target.value)}
              className="w-full h-24 bg-slate-955 border border-slate-850 rounded p-2 font-mono text-[9px] focus:outline-none"
            />
            <button 
              onClick={handleImport}
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 transition"
            >
              <Upload size={14} />
              Importar Backup JSON
            </button>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-slate-350 border-b border-slate-850 pb-2">Redefinição total</h2>
            <button 
              onClick={handleReset}
              className="w-full bg-red-950/20 hover:bg-red-900/40 text-red-400 border border-red-800/20 font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition"
            >
              <RefreshCw size={14} />
              Redefinir Dados Locais
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
