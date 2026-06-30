'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Calendar, Mail, FileText, Gift, Award, Copy, CheckSquare, ChevronDown, ChevronUp } from 'lucide-react';

const emailTemplates = [
  {
    id: 'cafe',
    titulo: 'Solicitação de Café',
    destinatario: 'Diene (NAF)',
    assunto: 'Solicitação de Café — IEF NAR Guanhães',
    corpo: `Prezada Diene, bom dia.

Ícaro e Paulo informaram que irão a Governador Valadares, e comuniquei a eles que faria a solicitação para trazerem os pacotes de café para o núcleo.

Dessa forma, solicito, por gentileza, a disponibilização dos pacotes de café.

Atenciosamente,
James Oliveira
IEF NAR GUANHÃES`
  },
  {
    id: 'sistema_decisoes',
    titulo: 'Encaminhar ao Sistema de Decisões',
    destinatario: 'Sara — sara.oliveira@meioambiente.mg.gov.br',
    assunto: 'SISTEMA DE DECISÕES',
    corpo: `Prezada Sara,

Bom dia!

Gentileza encaminhar processo [NÚMERO SEI] ao sistema de decisões.

Publicação Diário Executivo, [DATA], Fls [FOLHAS] ([NÚMERO DO DOCUMENTO]).

Devidamente encaminhado ao NUREG RIO DOCE.

Cordialmente,
James Oliveira
IEF NAR GUANHÃES`
  },
  {
    id: 'asv_singular',
    titulo: 'ASV para Assinatura — 1 documento',
    destinatario: 'Camila / responsável atual',
    assunto: 'ASV — Autorização de Uso de Veículo para Assinatura',
    corpo: `Prezado(a),

Encaminho, em anexo, o documento referente à ASV – Autorização de Uso de Veículo, para leitura e assinatura.

Solicito, por gentileza, que a assinatura seja realizada por meio do gov.br e que o arquivo seja devolvido devidamente assinado.

Após o retorno, o documento será arquivado na pasta compartilhada do núcleo, conforme procedimento padrão de controle e registro das ASVs.

Em caso de dúvidas ou dificuldades no processo de assinatura, fico à disposição para auxiliar.

Agradeço a colaboração de todos.

Atenciosamente,
James Oliveira
Assistente Administrativo IEF/MGS`
  },
  {
    id: 'asv_plural',
    titulo: 'ASV para Assinatura — múltiplos documentos',
    destinatario: 'Camila / responsável atual',
    assunto: 'ASVs — Autorizações de Uso de Veículo para Assinatura',
    corpo: `Prezado(a),

Encaminho, em anexo, os documentos referentes à ASV – Autorização de Uso de Veículo, para leitura e assinatura.

Solicito, por gentileza, que a assinatura seja realizada por meio do gov.br e que os arquivos sejam devolvidos devidamente assinados.

Após o retorno, os documentos serão arquivados na pasta compartilhada do núcleo, conforme procedimento padrão de controle e registro das ASVs.

Em caso de dúvidas ou dificuldades no processo de assinatura, fico à disposição para auxiliar.

Agradeço a colaboração de todos.

Atenciosamente,
James Oliveira
Assistente Administrativo IEF/MGS`
  },
  {
    id: 'siad_problema',
    titulo: 'Problema no SIAD — Solicitar abertura de ASV',
    destinatario: 'Diene (NAF) — quando Camila está de férias',
    assunto: 'Solicitação de Abertura/Fechamento de ASV — Problema no SIAD',
    corpo: `Prezada Diene, bom dia!

Devido a problemas em meu usuário do SIAD, venho por meio deste solicitar que abra e feche uma ASV para mim, por gentileza.

[INFORMAR: Data, veículo (placa), motorista, horário de saída e retorno, km saída e retorno, destino]

Att.,
James Oliveira
IEF NAR GUANHÃES`
  },
  {
    id: 'conta_agua',
    titulo: 'Envio Conta de Água',
    destinatario: 'Samira (samira.alves@meioambiente.mg.gov.br)',
    assunto: 'Conta de Água — IEF NAR GUANHÃES/MG',
    corpo: `Prezada Samira,

Segue em anexo conta de água IEF NAR GUANHÃES/MG VENCIMENTO [DATA DE VENCIMENTO].

Gentilmente,
James Oliveira
Aux. Administrativo MGS/IEF`
  }
];

export const RotinasTarefas: React.FC = () => {
  const { settings } = useApp();
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null);

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

      {/* Email Templates */}
      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2 uppercase tracking-wider">
          <Mail className="text-sky-400" size={16} />
          Modelos de E-mail Rápidos
        </h2>

        <div className="space-y-2 text-xs">
          {emailTemplates.map(tpl => (
            <div key={tpl.id} className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedEmail(expandedEmail === tpl.id ? null : tpl.id)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-900/50 transition"
              >
                <div>
                  <span className="font-bold text-white">{tpl.titulo}</span>
                  <span className="text-slate-500 ml-2">→ {tpl.destinatario}</span>
                </div>
                {expandedEmail === tpl.id ? <ChevronUp size={14} className="text-slate-400 shrink-0" /> : <ChevronDown size={14} className="text-slate-400 shrink-0" />}
              </button>

              {expandedEmail === tpl.id && (
                <div className="px-4 pb-4 space-y-3 border-t border-slate-800">
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="text-slate-400">Assunto:</span>
                    <span className="font-mono text-slate-200 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[11px]">{tpl.assunto}</span>
                    <button
                      onClick={() => handleCopyText(tpl.assunto)}
                      className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px]"
                    >
                      <Copy size={10} /> copiar assunto
                    </button>
                  </div>

                  <pre className="bg-slate-900 border border-slate-800 rounded p-3 text-slate-300 text-[11px] whitespace-pre-wrap font-sans leading-relaxed">
                    {tpl.corpo}
                  </pre>

                  <button
                    onClick={() => handleCopyText(tpl.corpo)}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded text-[10px] font-semibold flex items-center gap-1.5 transition"
                  >
                    <Copy size={10} /> Copiar corpo do e-mail
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-slate-600 text-[10px]">Os campos entre colchetes devem ser preenchidos antes de enviar.</p>
      </div>
    </div>
  );
};
