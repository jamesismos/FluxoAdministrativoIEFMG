'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Calendar, Mail, FileText, Gift, Award, Copy, CheckSquare } from 'lucide-react';

export const RotinasTarefas: React.FC = () => {
  const { settings } = useApp();

  const iefBillingData = {
    cnpj: '18.746.164/0001-28',
    razaoSocial: 'Instituto Estadual de Florestas',
    endereco: 'Rodovia Papa João Paulo II, 4143 Edifício Minas 1º Andar- Serra Verde',
    cep: '31630-900',
    cidade: 'Belo Horizonte - MG'
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado para a área de transferência!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Rotinas e Tarefas Diárias</h1>
        <p className="text-slate-400 text-sm">Cronograma de obrigações fixas, rotinas operacionais locais e dados institucionais de faturamento do IEF.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
        {/* Obrigações com data fixa */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-850 pb-2 uppercase tracking-wider text-slate-350">
            <Calendar className="text-emerald-400" size={16} />
            Cronograma do Mês e Datas Limite
          </h2>

          <div className="space-y-3">
            {/* Fechamento */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">1º Dia Útil do Mês: Fechamento Mensal</span>
                <span className="bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded text-[9px] font-bold">Mensal</span>
              </div>
              <p className="text-slate-400">Realizar o fechamento consolidado dos processos do mês anterior. Verifique se as 7 planilhas do núcleo estão atualizadas e coerentes para facilitar esse fechamento.</p>
            </div>

            {/* Conta de água */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">Primeiros dias do mês: Conta de Água</span>
                <span className="bg-blue-950 text-blue-400 px-1.5 py-0.5 rounded text-[9px] font-bold">Início do Mês</span>
              </div>
              <p className="text-slate-400">Assim que a conta de água chegar:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-400">
                <li>Efetuar o escaneamento físico da conta;</li>
                <li>Enviar por e-mail para a Samira (<strong className="text-slate-200">samira.alves@meioambiente.mg.gov.br</strong>);</li>
                <li>Guardar a via física original no envelope correspondente na gaveta.</li>
              </ul>
            </div>

            {/* Envio de malote */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">Quinta-feira: Envio de Malotes</span>
                <span className="bg-purple-950 text-purple-400 px-1.5 py-0.5 rounded text-[9px] font-bold">Semanal</span>
              </div>
              <p className="text-slate-400">Coleta dos Correios ocorre no período da tarde no NAR:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-400">
                <li>Preencher a planilha de guias do malote;</li>
                <li>Imprimir <strong className="text-slate-200">duas cópias</strong> para acompanhar os documentos;</li>
                <li>Pegar os lacres plásticos na penúltima gaveta do gaveteiro para lacrar o malote;</li>
                <li><strong className="text-amber-400 font-semibold">Importante:</strong> Virar a plaquinha de endereço que fica do lado de fora do malote.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Patrimônio e Orçamentos */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-850 pb-2 uppercase tracking-wider text-slate-350">
            <Gift className="text-emerald-400" size={16} />
            Patrimônio, Orçamentos e Notas Fiscais
          </h2>

          <div className="space-y-4">
            {/* Patrimônio */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-1">
              <span className="font-bold text-white block">Controle do Patrimônio</span>
              <p className="text-slate-400 mt-1">A gestão patrimonial é de responsabilidade da Diene (NAF). No NAR Guanhães, mantemos duas planilhas auxiliares (uma do núcleo e outra do parque). Modifique as planilhas à medida que novos itens chegam ou saem. A conferência física ocorre anualmente, com auxílio do André.</p>
            </div>

            {/* Faturamento e Nota Fiscal */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-2">
              <span className="font-bold text-white block">Dados do IEF para Orçamentos e Notas Fiscais</span>
              <p className="text-slate-400">Ao solicitar orçamentos ou emitir notas fiscais, verifique se constam todos os dados abaixo:</p>
              
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800 space-y-1.5 font-mono text-[10px] text-slate-300">
                <p className="flex justify-between"><span>CNPJ:</span> <span className="text-white">{iefBillingData.cnpj}</span></p>
                <p className="flex justify-between"><span>Razão Social:</span> <span className="text-white">{iefBillingData.razaoSocial}</span></p>
                <p className="flex justify-between"><span>Endereço:</span> <span className="text-white truncate max-w-[280px]" title={iefBillingData.endereco}>{iefBillingData.endereco}</span></p>
                <p className="flex justify-between"><span>CEP:</span> <span className="text-white">{iefBillingData.cep}</span></p>
                <p className="flex justify-between"><span>Cidade:</span> <span className="text-white">{iefBillingData.cidade}</span></p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleCopyText(`${iefBillingData.razaoSocial}\nCNPJ: ${iefBillingData.cnpj}\nEndereço: ${iefBillingData.endereco}\nCEP: ${iefBillingData.cep}\nBelo Horizonte`)}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1 rounded text-[10px] font-semibold flex items-center gap-1 transition"
                >
                  <Copy size={10} /> Copiar Dados Completos
                </button>
              </div>

              <div className="p-2 bg-amber-950/20 border border-amber-900/50 rounded text-amber-300 text-[10px] flex gap-1.5 items-start">
                <Clock className="shrink-0 mt-0.5" size={13} />
                <p>Após o pagamento, lembre-se de solicitar o carimbo de "recebemos" na nota fiscal física antes de inseri-la no respectivo processo no SEI.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
