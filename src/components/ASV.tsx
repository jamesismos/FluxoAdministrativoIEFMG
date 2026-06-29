'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ASVRecord } from '../types';
import { Car, Clock, ShieldAlert, Plus, HelpCircle, Save, CheckSquare } from 'lucide-react';

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
      status: 'Aberta OK'
    });

    // Reset
    setPlaca('');
    setCondutor('');
    setDestino('');
    setQuilometragemSaida(0);
    setHorarioSaida('');
    setObservacao('');
    alert('ASV criada e marcada como "Aberta OK"!');
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
      status: 'Fechada',
    });

    setQuilometragemRetorno(0);
    setHorarioRetorno('');
    setActiveAsvId(null);
    alert('Viagem fechada e marcada como "Fechada"!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Controle de Veículos e Frota (ASV)</h1>
        <p className="text-slate-400 text-sm">Controle de saídas de veículos, registro de quilometragem e controle do fluxo de assinaturas e arquivamento das ASVs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step-by-Step SIAD Guide */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl text-xs space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <HelpCircle className="text-sky-400" size={16} />
            Fluxo da ASV (Passo a Passo)
          </h2>

          <div className="space-y-3 text-slate-350">
            <p className="text-slate-400">Instruções para controle físico e digital das ASVs de acordo com o NAF:</p>
            <ul className="list-decimal pl-4 space-y-2 text-slate-400">
              <li>
                <strong className="text-white">SIAD (pw3270):</strong> Acesse o terminal, navegue em <strong>Atendimento 06</strong> e abra/emita a ASV. 
                Marque no sistema como <strong className="text-amber-400 font-semibold">Aberta OK</strong>.
              </li>
              <li>
                <strong className="text-white">Retorno:</strong> Insira a quilometragem e o horário final da viagem. O status mudará para <strong className="text-blue-400 font-semibold">Fechada</strong>.
              </li>
              <li>
                <strong className="text-white">Impressão e Assinatura:</strong> Tire um print da tela de fechamento no SIAD e imprima-a para que os condutores assinem fisicamente.
              </li>
              <li>
                <strong className="text-white">Assinatura GOV / E-mail:</strong> Escaneie e envie o documento para a Samira por e-mail, ou envie por e-mail para a assinatura GOV. Marcar como <strong className="text-purple-400 font-semibold">Enviada p/ Assinatura GOV</strong>.
              </li>
              <li>
                <strong className="text-white">Arquivamento:</strong> Assim que retornar assinado, salve o documento na pasta compartilhada de ASVs do núcleo (criada pela Camila) organizada por ano e placa, e guarde a cópia física na 1ª gaveta do gaveteiro. Marque como <strong className="text-emerald-400 font-semibold">Arquivada (Pasta Camila)</strong>.
              </li>
            </ul>
          </div>
        </div>

        {/* Form Panel */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl text-xs space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Plus className="text-emerald-400" size={16} />
            Nova Saída de Veículo (Registrar no SIAD)
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
                className="w-full h-12 bg-slate-950 border border-slate-850 rounded p-2 text-white"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded-lg transition"
            >
              Abrir ASV (Aberta OK)
            </button>
          </form>
        </div>

        {/* ASV Active & Return Logs */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl text-xs space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Car className="text-emerald-400" size={16} />
            Fila de Controle de ASVs
          </h2>

          {asvRecords.length === 0 ? (
            <p className="text-slate-500 italic">Nenhum registro de veículo em trâmite local.</p>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
              {asvRecords.map(rec => (
                <div key={rec.id} className="p-3 bg-slate-950 border border-slate-850 rounded-lg space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <span className="font-mono font-bold text-white bg-slate-850 px-2 py-0.5 rounded border border-slate-800">{rec.placa}</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                      rec.status === 'Aberta OK' ? 'bg-amber-955/20 text-amber-400 border border-amber-800/30' : 
                      rec.status === 'Fechada' ? 'bg-blue-955/20 text-blue-400 border border-blue-800/30' :
                      rec.status === 'Enviada p/ Assinatura GOV' ? 'bg-purple-955/20 text-purple-400 border border-purple-800/30' :
                      'bg-emerald-955/20 text-emerald-400 border border-emerald-800/30'
                    }`}>
                      {rec.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-350 space-y-0.5">
                    <p>Condutor: <span className="font-semibold text-white">{rec.condutor}</span></p>
                    <p>Destino: <span className="font-semibold text-white">{rec.destino}</span></p>
                    <p>Saída: <span className="font-semibold text-slate-100">{rec.horarioSaida}</span> | Odômetro: <span className="font-semibold font-mono text-emerald-400">{rec.quilometragemSaida} km</span></p>
                    
                    {rec.quilometragemRetorno ? (
                      <p className="text-emerald-400">Retorno: <span className="font-semibold">{rec.horarioRetorno}</span> | Odômetro: <span className="font-semibold font-mono">{rec.quilometragemRetorno} km</span> (Total: {rec.quilometragemRetorno - rec.quilometragemSaida} km)</p>
                    ) : null}
                  </div>

                  {/* Flow control buttons */}
                  <div className="border-t border-slate-900 pt-2 space-y-2 mt-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-slate-500 font-bold uppercase">Fluxo da ASV:</span>
                      <div className="grid grid-cols-2 gap-1 text-[9px]">
                        <button
                          type="button"
                          onClick={() => updateASVRecord(rec.id, { status: 'Aberta OK' })}
                          className={`py-1 rounded text-center font-semibold transition cursor-pointer ${rec.status === 'Aberta OK' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-850'}`}
                        >
                          Aberta OK
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!rec.quilometragemRetorno) {
                              setActiveAsvId(rec.id);
                            } else {
                              updateASVRecord(rec.id, { status: 'Fechada' });
                            }
                          }}
                          className={`py-1 rounded text-center font-semibold transition cursor-pointer ${rec.status === 'Fechada' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-850'}`}
                        >
                          Fechada
                        </button>
                        <button
                          type="button"
                          onClick={() => updateASVRecord(rec.id, { status: 'Enviada p/ Assinatura GOV' })}
                          className={`py-1 rounded text-center font-semibold transition cursor-pointer ${rec.status === 'Enviada p/ Assinatura GOV' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-850'}`}
                        >
                          Assinatura GOV
                        </button>
                        <button
                          type="button"
                          onClick={() => updateASVRecord(rec.id, { status: 'Arquivada (Pasta Camila)' })}
                          className={`py-1 rounded text-center font-semibold transition cursor-pointer ${rec.status === 'Arquivada (Pasta Camila)' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-850'}`}
                        >
                          Pasta Camila
                        </button>
                      </div>
                    </div>

                    {activeAsvId === rec.id && (
                      <div className="bg-slate-900 p-2 rounded border border-slate-800 space-y-1.5 mt-1.5">
                        <span className="font-semibold text-[9px] text-white">Salvar Retorno (SIAD):</span>
                        <div className="grid grid-cols-2 gap-1">
                          <input 
                            type="number"
                            placeholder="km retorno"
                            onChange={e => setQuilometragemRetorno(Number(e.target.value))}
                            className="bg-slate-950 border border-slate-850 rounded px-1.5 py-1 text-[10px] text-white"
                          />
                          <input 
                            type="text"
                            placeholder="Horário (17:15)"
                            onChange={e => setHorarioRetorno(e.target.value)}
                            className="bg-slate-950 border border-slate-850 rounded px-1.5 py-1 text-[10px] text-white font-mono"
                          />
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleReturn(rec.id)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-1 rounded text-[10px] font-bold transition cursor-pointer"
                          >
                            Fechar Viagem
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveAsvId(null)}
                            className="bg-slate-850 text-slate-300 py-1 px-2 rounded text-[10px] hover:bg-slate-800"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
