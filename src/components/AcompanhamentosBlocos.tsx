'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { FolderHeart, Archive, CheckSquare, Layers, FileSpreadsheet, ExternalLink, HelpCircle, RefreshCw } from 'lucide-react';

interface AcompanhamentosBlocosProps {
  onNavigate: (tab: string, processId?: string) => void;
}

export const AcompanhamentosBlocos: React.FC<AcompanhamentosBlocosProps> = ({ onNavigate }) => {
  const { processes } = useApp();

  // Local storage state for the monthly/daily checklists to ensure nothing is forgotten
  const [seiChecks, setSeiChecks] = useState({
    acompanhamentoEspecial: false,
    blocosAssinatura: false,
    controleProcessos: false,
    favoritos: false
  });

  const [spreadsheetChecks, setSpreadsheetChecks] = useState({
    dcfRioDoce: false,
    narAflobios: false,
    analisePaulo: false,
    gestaoAia: false,
    gestaoDcfSd: false,
    condicionantes: false,
    controleArquivo: false
  });

  const [routineChecks, setRoutineChecks] = useState({
    contaAgua: false,
    maloteQuinta: false,
    asvCompartilhada: false
  });

  // Load checks on mount
  useEffect(() => {
    try {
      const savedSei = localStorage.getItem('narflow_v4_chk_sei');
      const savedSpread = localStorage.getItem('narflow_v4_chk_spread');
      const savedRoutine = localStorage.getItem('narflow_v4_chk_routine');
      if (savedSei) setSeiChecks(JSON.parse(savedSei));
      if (savedSpread) setSpreadsheetChecks(JSON.parse(savedSpread));
      if (savedRoutine) setRoutineChecks(JSON.parse(savedRoutine));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save checks on change
  const saveChecks = (type: 'sei' | 'spread' | 'routine', data: any) => {
    localStorage.setItem(`narflow_v4_chk_${type}`, JSON.stringify(data));
  };

  const handleToggleSei = (key: keyof typeof seiChecks) => {
    const updated = { ...seiChecks, [key]: !seiChecks[key] };
    setSeiChecks(updated);
    saveChecks('sei', updated);
  };

  const handleToggleSpread = (key: keyof typeof spreadsheetChecks) => {
    const updated = { ...spreadsheetChecks, [key]: !spreadsheetChecks[key] };
    setSpreadsheetChecks(updated);
    saveChecks('spread', updated);
  };

  const handleToggleRoutine = (key: keyof typeof routineChecks) => {
    const updated = { ...routineChecks, [key]: !routineChecks[key] };
    setRoutineChecks(updated);
    saveChecks('routine', updated);
  };

  const handleResetChecklists = () => {
    if (confirm('Deseja realmente resetar todas as marcações do checklist?')) {
      const resetSei = { acompanhamentoEspecial: false, blocosAssinatura: false, controleProcessos: false, favoritos: false };
      const resetSpread = { dcfRioDoce: false, narAflobios: false, analisePaulo: false, gestaoAia: false, gestaoDcfSd: false, condicionantes: false, controleArquivo: false };
      const resetRoutine = { contaAgua: false, maloteQuinta: false, asvCompartilhada: false };
      
      setSeiChecks(resetSei);
      setSpreadsheetChecks(resetSpread);
      setRoutineChecks(resetRoutine);

      saveChecks('sei', resetSei);
      saveChecks('spread', resetSpread);
      saveChecks('routine', resetRoutine);
    }
  };

  // Group processes to show quick status
  const activeProcesses = processes.filter(p => !p.isFinalized);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Sincronização SEI & Planilhas</h1>
          <p className="text-slate-400 text-sm">Organizador de rotinas passo a passo para conferência no SEI e atualização das planilhas de controle local.</p>
        </div>

        <button
          onClick={handleResetChecklists}
          className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-semibold"
        >
          <RefreshCw size={12} />
          Resetar Checklist
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {/* Column 1: SEI Menus Verification */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-850 pb-2">
            <Layers className="text-sky-400 font-bold" size={16} />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">1. Verificar no SEI</h2>
          </div>

          <p className="text-slate-400 text-[11px]">Faça a checagem rotineira acessando os seguintes menus no SEI de sua unidade:</p>

          <div className="space-y-3">
            {/* Acompanhamento Especial */}
            <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg space-y-2">
              <div className="flex items-start gap-2.5">
                <input 
                  type="checkbox" 
                  id="chk-sei-acomp" 
                  checked={seiChecks.acompanhamentoEspecial}
                  onChange={() => handleToggleSei('acompanhamentoEspecial')}
                  className="w-4 h-4 rounded border-slate-800 bg-slate-900 accent-emerald-500 mt-0.5 cursor-pointer"
                />
                <div>
                  <label htmlFor="chk-sei-acomp" className="text-white font-bold cursor-pointer hover:text-emerald-400 transition">Menu: Acompanhamento Especial</label>
                  <p className="text-[10px] text-slate-450 mt-1">Monitore prazos de condicionantes ativas ou processos marcados em filas de acompanhamento do NAR.</p>
                </div>
              </div>
            </div>

            {/* Blocos */}
            <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg space-y-2">
              <div className="flex items-start gap-2.5">
                <input 
                  type="checkbox" 
                  id="chk-sei-blocos" 
                  checked={seiChecks.blocosAssinatura}
                  onChange={() => handleToggleSei('blocosAssinatura')}
                  className="w-4 h-4 rounded border-slate-800 bg-slate-900 accent-emerald-500 mt-0.5 cursor-pointer"
                />
                <div>
                  <label htmlFor="chk-sei-blocos" className="text-white font-bold cursor-pointer hover:text-emerald-400 transition">Menu: Blocos de Assinatura / Internos</label>
                  <p className="text-[10px] text-slate-450 mt-1">Conferir despachos pendentes para assinatura regional e processos em blocos de arquivamento organizados.</p>
                </div>
              </div>
            </div>

            {/* Controle de Processos */}
            <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg space-y-2">
              <div className="flex items-start gap-2.5">
                <input 
                  type="checkbox" 
                  id="chk-sei-control" 
                  checked={seiChecks.controleProcessos}
                  onChange={() => handleToggleSei('controleProcessos')}
                  className="w-4 h-4 rounded border-slate-800 bg-slate-900 accent-emerald-500 mt-0.5 cursor-pointer"
                />
                <div>
                  <label htmlFor="chk-sei-control" className="text-white font-bold cursor-pointer hover:text-emerald-400 transition">Menu: Controle de Processos</label>
                  <p className="text-[10px] text-slate-450 mt-1">Visualização das demandas recebidas na unidade, atribuições de técnicos e prazos em contagem de dias.</p>
                </div>
              </div>
            </div>

            {/* Favoritos */}
            <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg space-y-2">
              <div className="flex items-start gap-2.5">
                <input 
                  type="checkbox" 
                  id="chk-sei-favs" 
                  checked={seiChecks.favoritos}
                  onChange={() => handleToggleSei('favoritos')}
                  className="w-4 h-4 rounded border-slate-800 bg-slate-900 accent-emerald-500 mt-0.5 cursor-pointer"
                />
                <div>
                  <label htmlFor="chk-sei-favs" className="text-white font-bold cursor-pointer hover:text-emerald-400 transition">Menu: Favoritos (Modelos)</label>
                  <p className="text-[10px] text-slate-450 mt-1">Acesso rápido aos modelos favoritados de despachos, notificações e intimações mantidos no próprio SEI.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: 7 Spreadsheets Checklist */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-850 pb-2">
            <FileSpreadsheet className="text-emerald-400 font-bold" size={16} />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">2. Atualizar Planilhas</h2>
          </div>

          <p className="text-slate-400 text-[11px]">Sincronize as demandas com as 7 planilhas oficiais de controle local:</p>

          <div className="space-y-3">
            {/* Planilha 1 */}
            <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-lg flex items-start gap-2">
              <input 
                type="checkbox" 
                id="chk-sp-1" 
                checked={spreadsheetChecks.dcfRioDoce}
                onChange={() => handleToggleSpread('dcfRioDoce')}
                className="w-4 h-4 rounded border-slate-800 bg-slate-900 accent-emerald-500 mt-0.5 cursor-pointer"
              />
              <div className="flex-1">
                <label htmlFor="chk-sp-1" className="text-slate-200 font-bold cursor-pointer hover:text-emerald-400 transition">Planilha 1: DCF (Rio Doce)</label>
                <p className="text-[9px] text-slate-500 mt-0.5">Lançar DCFs ativas do regional. <strong className="text-red-400">Não inserir dados de DCFs recusadas.</strong></p>
              </div>
            </div>

            {/* Planilha 2 */}
            <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-lg flex items-start gap-2">
              <input 
                type="checkbox" 
                id="chk-sp-2" 
                checked={spreadsheetChecks.narAflobios}
                onChange={() => handleToggleSpread('narAflobios')}
                className="w-4 h-4 rounded border-slate-800 bg-slate-900 accent-emerald-500 mt-0.5 cursor-pointer"
              />
              <div className="flex-1">
                <label htmlFor="chk-sp-2" className="text-slate-200 font-bold cursor-pointer hover:text-emerald-400 transition">Planilha 2: Controle NAR e Aflobios</label>
                <p className="text-[9px] text-slate-500 mt-0.5">Planilha geral do NAR Guanhães. Inserir DCFs, SDs, IA, licenças de pesca, queimas, vistas etc.</p>
              </div>
            </div>

            {/* Planilha 3 */}
            <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-lg flex items-start gap-2">
              <input 
                type="checkbox" 
                id="chk-sp-3" 
                checked={spreadsheetChecks.analisePaulo}
                onChange={() => handleToggleSpread('analisePaulo')}
                className="w-4 h-4 rounded border-slate-800 bg-slate-900 accent-emerald-500 mt-0.5 cursor-pointer"
              />
              <div className="flex-1">
                <label htmlFor="chk-sp-3" className="text-slate-200 font-bold cursor-pointer hover:text-emerald-400 transition">Planilha 3: Processos análise Paulo</label>
                <p className="text-[9px] text-slate-500 mt-0.5">Registrar DCF e Simples Declaração (SD) encaminhados para análise técnica do Paulo.</p>
              </div>
            </div>

            {/* Planilha 4 */}
            <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-lg flex items-start gap-2">
              <input 
                type="checkbox" 
                id="chk-sp-4" 
                checked={spreadsheetChecks.gestaoAia}
                onChange={() => handleToggleSpread('gestaoAia')}
                className="w-4 h-4 rounded border-slate-800 bg-slate-900 accent-emerald-500 mt-0.5 cursor-pointer"
              />
              <div className="flex-1">
                <label htmlFor="chk-sp-4" className="text-slate-200 font-bold cursor-pointer hover:text-emerald-400 transition">Planilha 4: Gestão Processos AIA 2026</label>
                <p className="text-[9px] text-slate-500 mt-0.5">Manter ativos na aba "Processos Ativos" e mover concluídos para a respectiva aba do mês.</p>
              </div>
            </div>

            {/* Planilha 5 */}
            <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-lg flex items-start gap-2">
              <input 
                type="checkbox" 
                id="chk-sp-5" 
                checked={spreadsheetChecks.gestaoDcfSd}
                onChange={() => handleToggleSpread('gestaoDcfSd')}
                className="w-4 h-4 rounded border-slate-800 bg-slate-900 accent-emerald-500 mt-0.5 cursor-pointer"
              />
              <div className="flex-1">
                <label htmlFor="chk-sp-5" className="text-slate-200 font-bold cursor-pointer hover:text-emerald-400 transition">Planilha 5: Gestão DCF, SD e Queima</label>
                <p className="text-[9px] text-slate-500 mt-0.5">Soma quantitativa mensal de fechamento. Feito no início do mês, no período da tarde.</p>
              </div>
            </div>

            {/* Planilha 6 */}
            <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-lg flex items-start gap-2">
              <input 
                type="checkbox" 
                id="chk-sp-6" 
                checked={spreadsheetChecks.condicionantes}
                onChange={() => handleToggleSpread('condicionantes')}
                className="w-4 h-4 rounded border-slate-800 bg-slate-900 accent-emerald-500 mt-0.5 cursor-pointer"
              />
              <div className="flex-1">
                <label htmlFor="chk-sp-6" className="text-slate-200 font-bold cursor-pointer hover:text-emerald-400 transition">Planilha 6: Controle de Condicionantes</label>
                <p className="text-[9px] text-slate-500 mt-0.5">Prazos de compensações ambientais. Se estourado, informar ao Márcio para expedição de ofício.</p>
              </div>
            </div>

            {/* Planilha 7 */}
            <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-lg flex items-start gap-2">
              <input 
                type="checkbox" 
                id="chk-sp-7" 
                checked={spreadsheetChecks.controleArquivo}
                onChange={() => handleToggleSpread('controleArquivo')}
                className="w-4 h-4 rounded border-slate-800 bg-slate-900 accent-emerald-500 mt-0.5 cursor-pointer"
              />
              <div className="flex-1">
                <label htmlFor="chk-sp-7" className="text-slate-200 font-bold cursor-pointer hover:text-emerald-400 transition">Planilha 7: Controle Arquivo NAR</label>
                <p className="text-[9px] text-slate-500 mt-0.5">Guarda física. Aba 2 contém modelos de etiquetas de colagem das caixas.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Periodic Local Routines Checklist */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-850 pb-2">
            <CheckSquare className="text-sky-400 font-bold" size={16} />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">3. Rotinas e Datas</h2>
          </div>

          <p className="text-slate-400 text-[11px]">Tarefas periódicas essenciais do núcleo (NAF Guanhães):</p>

          <div className="space-y-3">
            {/* Conta de Agua */}
            <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg space-y-2">
              <div className="flex items-start gap-2.5">
                <input 
                  type="checkbox" 
                  id="chk-rt-agua" 
                  checked={routineChecks.contaAgua}
                  onChange={() => handleToggleRoutine('contaAgua')}
                  className="w-4 h-4 rounded border-slate-800 bg-slate-900 accent-emerald-500 mt-0.5 cursor-pointer"
                />
                <div>
                  <label htmlFor="chk-rt-agua" className="text-white font-bold cursor-pointer hover:text-emerald-400 transition">Enviar Conta de Água por E-mail</label>
                  <p className="text-[10px] text-slate-450 mt-1">Escaneada nos primeiros dias do mês e enviada para Samira. Guardar a física na gaveta.</p>
                </div>
              </div>
            </div>

            {/* Malote */}
            <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg space-y-2">
              <div className="flex items-start gap-2.5">
                <input 
                  type="checkbox" 
                  id="chk-rt-malote" 
                  checked={routineChecks.maloteQuinta}
                  onChange={() => handleToggleRoutine('maloteQuinta')}
                  className="w-4 h-4 rounded border-slate-800 bg-slate-900 accent-emerald-500 mt-0.5 cursor-pointer"
                />
                <div>
                  <label htmlFor="chk-rt-malote" className="text-white font-bold cursor-pointer hover:text-emerald-400 transition">Envio do Malote (Quinta-feira)</label>
                  <p className="text-[10px] text-slate-450 mt-1">Preparar guias dos Correios, selar caixas com lacres físicos e virar a placa de endereço.</p>
                </div>
              </div>
            </div>

            {/* ASVs e Assinatura */}
            <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg space-y-2">
              <div className="flex items-start gap-2.5">
                <input 
                  type="checkbox" 
                  id="chk-rt-asvs" 
                  checked={routineChecks.asvCompartilhada}
                  onChange={() => handleToggleRoutine('asvCompartilhada')}
                  className="w-4 h-4 rounded border-slate-800 bg-slate-900 accent-emerald-500 mt-0.5 cursor-pointer"
                />
                <div>
                  <label htmlFor="chk-rt-asvs" className="text-white font-bold cursor-pointer hover:text-emerald-400 transition">Guarda Compartilhada da ASV</label>
                  <p className="text-[10px] text-slate-450 mt-1">Print da tela final do SIAD assinado fisicamente pelo condutor, escaneado e salvo na pasta da Camila.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick workflow helper footer */}
      <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-xl text-xs space-y-2 text-slate-350">
        <h3 className="font-bold text-white text-sm flex items-center gap-1.5"><HelpCircle size={16} className="text-sky-400" /> Lembrança de Fechamento de Mês (1º dia útil)</h3>
        <p className="leading-relaxed">
          No primeiro dia útil do mês, execute o fechamento do quantitativo de processos do mês anterior. 
          Antes de fechar, garanta que as planilhas <strong className="text-white">DCF (Rio Doce)</strong> e <strong className="text-white">Controle Processos NAR e Aflobios</strong> estejam completamente atualizadas com todas as movimentações de entrada/saída ocorridas.
        </p>
      </div>

      {/* Local quick references of active processes inside the application */}
      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3 text-xs">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">Fila Interna Ativa do NAR-Flow ({activeProcesses.length} processos)</h2>
        <p className="text-slate-400">Confira abaixo os processos locais que estão em aberto para a triagem administrativa, distribuição técnica e análise interna do NAR:</p>
        
        {activeProcesses.length === 0 ? (
          <p className="text-slate-500 italic">Nenhum processo cadastrado na fila local de pendências.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeProcesses.map(p => (
              <div key={p.id} className="p-3 bg-slate-950 border border-slate-850 rounded-lg space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-white">{p.seiNumber}</span>
                  <span className="bg-slate-900 border border-slate-800 text-slate-400 px-1 rounded uppercase text-[9px] font-bold">{p.type}</span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">Requerente: <span className="text-white">{p.requerente}</span></p>
                <div className="flex justify-between text-[10px] pt-1.5 border-t border-slate-900">
                  <span className="text-amber-400 font-semibold truncate max-w-[140px]">{p.situacao}</span>
                  <button 
                    onClick={() => onNavigate(p.type === 'AIA' ? 'AIA — Intervenção Ambiental' : p.type === 'DCF' ? 'DCF' : 'Simples Declaração', p.id)}
                    className="text-sky-400 hover:underline font-bold"
                  >
                    Ver Passo a Passo
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
