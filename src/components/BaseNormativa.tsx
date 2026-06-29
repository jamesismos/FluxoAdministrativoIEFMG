'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Normative } from '../types';
import { Scale, Plus, ExternalLink, Trash2, Search, Edit2 } from 'lucide-react';

export const BaseNormativa: React.FC = () => {
  const { normatives, addNormative, deleteNormative } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  // Add rule form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [norma, setNorma] = useState('');
  const [artigo, setArtigo] = useState('');
  const [resumoOperacional, setResumoOperacional] = useState('');
  const [link, setLink] = useState('');
  const [observacaoInterna, setObservacaoInterna] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !resumoOperacional) return;

    addNormative({
      titulo,
      norma,
      artigo,
      resumoOperacional,
      link,
      observacaoInterna,
      dataConferencia: new Date().toISOString().split('T')[0]
    });

    setTitulo('');
    setNorma('');
    setArtigo('');
    setResumoOperacional('');
    setLink('');
    setObservacaoInterna('');
    setShowAddForm(false);
    alert('Normativa jurídica adicionada!');
  };

  const filteredNormatives = normatives.filter(n => 
    n.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.resumoOperacional.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.norma.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Base Normativa Florestal e Ambiental</h1>
          <p className="text-slate-400 text-sm">Biblioteca local e editável de fundamentos jurídicos, decretos, resoluções e regulamentos operacionais aplicáveis ao IEF/MG.</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-semibold"
        >
          <Plus size={14} />
          {showAddForm ? 'Cancelar Cadastro' : 'Cadastrar Legislação'}
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl text-xs grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-slate-400 mb-1">Título da Norma *</label>
              <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-white" required />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-1">Resumo (Código/Lei)</label>
                <input type="text" value={norma} onChange={e => setNorma(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Artigo / Seção</label>
                <input type="text" value={artigo} onChange={e => setArtigo(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-white" />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Link de Acesso Externo</label>
              <input type="url" value={link} onChange={e => setLink(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-white" />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-slate-400 mb-1">Resumo Operacional (O que esta regra define?) *</label>
              <textarea value={resumoOperacional} onChange={e => setResumoOperacional(e.target.value)} className="w-full h-20 bg-slate-950 border border-slate-850 rounded p-2 text-white" required />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Observações Internas do NAR</label>
              <textarea value={observacaoInterna} onChange={e => setObservacaoInterna(e.target.value)} className="w-full h-16 bg-slate-950 border border-slate-850 rounded p-2 text-white" />
            </div>

            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded-md">Salvar Legislação</button>
          </div>
        </form>
      )}

      {/* Search and results grid */}
      <div className="space-y-4">
        <div className="flex bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 items-center gap-2 max-w-md">
          <Search className="text-slate-500 shrink-0" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-transparent text-xs text-white focus:outline-none w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNormatives.map(norm => (
            <div key={norm.id} className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl text-xs flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start border-b border-slate-800 pb-1.5">
                  <div className="flex items-center gap-2">
                    <Scale className="text-emerald-400 shrink-0" size={16} />
                    <strong className="text-white text-xs">{norm.titulo}</strong>
                  </div>
                  <button 
                    onClick={() => {
                      if (confirm('Deseja excluir esta normativa?')) deleteNormative(norm.id);
                    }}
                    className="text-slate-500 hover:text-red-400"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="text-slate-300 leading-relaxed space-y-1">
                  <p>{norm.resumoOperacional}</p>
                  {norm.observacaoInterna && (
                    <p className="text-slate-500 italic bg-slate-950 p-1.5 rounded border border-slate-850 mt-1">NAR Nota: {norm.observacaoInterna}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-850">
                <span>Última conferência: {norm.dataConferencia}</span>
                {norm.link && (
                  <a href={norm.link} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline flex items-center gap-1">
                    Ver Texto Integral <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
