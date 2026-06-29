'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ASVRecord } from '../types';
import { Car, Clock, ShieldAlert, Plus, HelpCircle, Save } from 'lucide-react';

export const ASV: React.FC = () => {
  const { asvRecords, addASVRecord, updateASVRecord } = useApp();
  const [activeAsvId, setActiveAsvId] = useState<string | null>(null);

  // Form states
  const [placa, setPlaca] = useState('');
  const [condutor, setCondutor] = useState('');
  const [destino, setDestino] = useState('');
  const [tipoAtendimento, setTipoAtendimento] = useState<ASVRecord['tipoAtendimento']>('Tipo 1: Local/Intermunicipal');
  const [quilometragemSaida, setQuilometragemSaida] = useState(0);
  const [horarioSaida, setHorarioSaida] = useState('');
  const [observacao, setObservacao] = useState('');

  // Return updates
  const [quilometragemRetorno, setQuilometragemRetorno] = useState(0);
  const [horarioRetorno, setHorarioRetorno] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!placa || !condutor || !destino || quilometragemSaida <= 0 || !horarioSaida) {
      alert('Preencha os dados obrigatórios da saída.');
      return;
    }

    addASVRecord({
      placa,
      condutor,
      destino,
      tipoAtendimento,
      quilometragemSaida,
      horarioSaida,
      observacao,
      status: tipoAtendimento.includes('Oficina') ? 'Oficina' : 'Saída'
    });

    // Reset
    setPlaca('');
    setCondutor('');
    setDestino('');
    setQuilometragemSaida(0);
    setHorarioSaida('');
    setObservacao('');
    alert('Saída de Veículo registrada com sucesso!');
  };

  const handleReturn = (id: string) => {
    if (quilometragemRetorno <= 0 || !horarioRetorno) {
      alert('Preencha a quilometragem e o horário de retorno.');
      return;
    }

    const record = asvRecords.find(r => r.id === id);
    if (record && quilometragemRetorno <= record.quilometragemSaida) {
      alert('Erro: A quilometragem de retorno não pode ser menor ou igual à quilometragem de saída!');
      return;
    }

    updateASVRecord(id, {
      quilometragemRetorno,
      horarioRetorno,
      status: 'Retorno',
    });

    setQuilometragemRetorno(0);
    setHorarioRetorno('');
    setActiveAsvId(null);
    alert('Retorno registrado com sucesso no sistema local!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Controle de Veículos e Frota (ASV)</h1>
        <p className="text-slate-400 text-sm">Controle interno de saídas de veículos, registro de quilometragem e guia de integração com o sistema SIAD/pw3270.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step-by-Step SIAD Guide */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl text-xs space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <HelpCircle className="text-sky-400" size={16} />
            Guia Operacional SIAD / pw3270
          </h2>

          <div className="space-y-3 text-slate-350">
            <p className="text-slate-400">Rotina diária para emissão da Autorização de Saída de Veículo (ASV):</p>
            <ol className="list-decimal pl-4 space-y-2">
              <li>Abra o terminal <strong className="text-white">pw3270</strong> (Host de Acesso Estado);</li>
              <li>Acesse a aplicação <strong className="text-white">SIAD</strong> com seu usuário e senha;</li>
              <li>Navegue até a opção <strong className="text-white">Atendimento 06</strong> (Gestão de Transportes);</li>
              <li>Selecione <strong className="text-white">Atendimento sem Solicitação</strong> para saídas rápidas;</li>
              <li>Preencha a placa do veículo, motorista cadastrado, destino, odômetro inicial e finalidade.</li>
            </ol>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-2">
              <span className="font-semibold text-white block uppercase tracking-wider text-[9px]">Regras de Classificação:</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-400">
                <li><strong className="text-slate-300">Tipo 1 (Local):</strong> Demandas dentro da comarca de Guanhães ou municípios limítrofes do núcleo.</li>
                <li><strong className="text-slate-300">Tipo 2 (Viagem):</strong> Viagens de longa distância (Belo Horizonte, Governador Valadares, etc.).</li>
                <li><strong className="text-slate-305">Tipo 3 (Oficina):</strong> Veículo deixado para reparo. Abrir ASV Tipo 3 indicando a km de entrega à oficina. Na retirada, fechar e abrir ASV Tipo 1 para retorno à base.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form Panel */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl text-xs space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Plus className="text-emerald-400" size={16} />
            Nova Abertura de ASV (Saída)
          </h2>

          <form onSubmit={handleCreate} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-1">Placa Veículo *</label>
                <input 
                  type="text" 
                  value={placa}
                  onChange={e => setPlaca(e.target.value.toUpperCase())}
                  placeholder="Ex: HMG-1234 / RTA5C21"
                  className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-white font-mono uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Condutor / Servidor *</label>
                <input 
                  type="text" 
                  value={condutor}
                  onChange={e => setCondutor(e.target.value)}
                  placeholder="Nome do motorista"
                  className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Destino *</label>
              <input 
                type="text" 
                value={destino}
                onChange={e => setDestino(e.target.value)}
                placeholder="Ex: Carmésia - Vistoria Técnica"
                className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-1">Quilometragem Saída *</label>
                <input 
                  type="number" 
                  value={quilometragemSaida || ''}
                  onChange={e => setQuilometragemSaida(Number(e.target.value))}
                  placeholder="km inicial"
                  className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Horário Saída *</label>
                <input 
                  type="text" 
                  value={horarioSaida}
                  onChange={e => setHorarioSaida(e.target.value)}
                  placeholder="Ex: 08:30"
                  className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-white font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Tipo de Atendimento</label>
              <select 
                value={tipoAtendimento}
                onChange={e => setTipoAtendimento(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-white"
              >
                <option value="Tipo 1: Local/Intermunicipal">Tipo 1: Local/Intermunicipal</option>
                <option value="Tipo 2: Viagem">Tipo 2: Viagem</option>
                <option value="Tipo 3: Oficina/Manutenção">Tipo 3: Oficina/Manutenção</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Observações</label>
              <textarea 
                value={observacao}
                onChange={e => setObservacao(e.target.value)}
                className="w-full h-16 bg-slate-950 border border-slate-850 rounded p-2 text-white"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded-lg transition"
            >
              Registrar Saída
            </button>
          </form>
        </div>

        {/* ASV Active & Return Logs */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl text-xs space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Car className="text-emerald-400" size={16} />
            Fila Ativa de Viagens
          </h2>

          {asvRecords.length === 0 ? (
            <p className="text-slate-500 italic">Nenhuma viagem em andamento no registro local.</p>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[380px]">
              {asvRecords.map(rec => (
                <div key={rec.id} className="p-3 bg-slate-950 border border-slate-850 rounded-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-mono font-bold text-white bg-slate-850 px-2 py-0.5 rounded border border-slate-800">{rec.placa}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${rec.status === 'Saída' ? 'bg-amber-950 text-amber-400' : rec.status === 'Oficina' ? 'bg-red-950 text-red-400' : 'bg-emerald-950 text-emerald-400'}`}>
                      {rec.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-350 space-y-0.5">
                    <p>Condutor: <span className="font-semibold text-white">{rec.condutor}</span></p>
                    <p>Destino: <span className="font-semibold text-white">{rec.destino}</span></p>
                    <p>Saída: <span className="font-semibold text-slate-100">{rec.horarioSaida}</span> | Odômetro: <span className="font-semibold font-mono text-emerald-400">{rec.quilometragemSaida} km</span></p>
                    
                    {rec.status === 'Retorno' && (
                      <p className="text-emerald-400">Retorno: <span className="font-semibold">{rec.horarioRetorno}</span> | Odômetro: <span className="font-semibold font-mono">{rec.quilometragemRetorno} km</span> (Total: {rec.quilometragemRetorno! - rec.quilometragemSaida} km)</p>
                    )}
                  </div>

                  {rec.status !== 'Retorno' && (
                    <div className="border-t border-slate-800 pt-2 space-y-2 mt-2">
                      <p className="font-semibold text-[10px] text-slate-300">Registrar Retorno no Sistema:</p>
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="number"
                          placeholder="km retorno"
                          onChange={e => setQuilometragemRetorno(Number(e.target.value))}
                          className="bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-[10px] text-white"
                        />
                        <input 
                          type="text"
                          placeholder="Horário (Ex: 17:15)"
                          onChange={e => setHorarioRetorno(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-[10px] text-white font-mono"
                        />
                      </div>
                      <button
                        onClick={() => handleReturn(rec.id)}
                        className="w-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 py-1 rounded text-[10px] font-bold hover:bg-emerald-600 hover:text-white transition"
                      >
                        Confirmar Retorno
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
