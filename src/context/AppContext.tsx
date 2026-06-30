'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Process, ASVRecord, TaxaRecord, Normative, SystemSettings, ChecklistItem, AiaProcessData, DcfProcessData, SimplesProcessData } from '../types';

interface AppContextType {
  processes: Process[];
  asvRecords: ASVRecord[];
  taxaRecords: TaxaRecord[];
  normatives: Normative[];
  settings: SystemSettings;
  addProcess: (type: Process['type'], details: Partial<Process>) => string;
  updateProcess: (id: string, details: Partial<Process>) => void;
  deleteProcess: (id: string) => void;
  addASVRecord: (record: Omit<ASVRecord, 'id' | 'createdAt'>) => void;
  updateASVRecord: (id: string, record: Partial<ASVRecord>) => void;
  addTaxaRecord: (record: Omit<TaxaRecord, 'id' | 'createdAt'>) => void;
  updateTaxaRecord: (id: string, record: Partial<TaxaRecord>) => void;
  addNormative: (normative: Omit<Normative, 'id'>) => void;
  updateNormative: (id: string, normative: Partial<Normative>) => void;
  deleteNormative: (id: string) => void;
  updateSettings: (settings: Partial<SystemSettings>) => void;
  exportData: () => string;
  importData: (jsonString: string) => boolean;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialMunicipalitiesGuanhaes = [
  'Guanhães', 'Carmésia', 'Divinolândia de Minas', 'Dores de Guanhães', 'Materlândia',
  'Paulistas', 'Sabinópolis', 'Senhora do Porto', 'Virginópolis', 'Cantagalo',
  'Coroaci', 'Gonzaga', 'Nacip Raydan', 'Peçanha', 'Santa Efigênia de Minas',
  'São João Evangelista', 'São Pedro do Suaçuí', 'Sardoá', 'Virgolândia', 'Ferros',
  'Passabém', 'Santo Antônio do Rio Abaixo', 'São José do Jacuri', 'São Sebastião do Rio Preto'
];

const initialMunicipalitiesAflobio = [
  'Coroaci', 'Virgolândia', 'Peçanha', 'Cantagalo', 'São João Evangelista',
  'São Pedro do Suaçuí', 'São José do Jacuri', 'Virginópolis'
];

const initialNormatives: Normative[] = [
  {
    id: 'n1',
    titulo: 'Decreto Estadual nº 47.749/2019',
    norma: 'Decreto nº 47.749',
    artigo: 'Geral',
    resumoOperacional: 'Regula os processos de autorização para intervenção ambiental e a produção florestal no Estado de Minas Gerais.',
    link: 'https://www.almg.gov.br/legislacao-consulte/decreto-47749-2019',
    observacaoInterna: 'Norma chave para o processo de AIA e ASV.',
    dataConferencia: '2026-06-29'
  },
  {
    id: 'n2',
    titulo: 'Resolução Conjunta SEMAD/IEF nº 3.102/2021',
    norma: 'Resolução 3.102/2021',
    artigo: 'Art. 2º ao 10',
    resumoOperacional: 'Define a documentação e os estudos necessários para a instrução dos processos de intervenção ambiental em MG.',
    link: 'https://www.legisweb.com.br/legislacao/?id=422474',
    observacaoInterna: 'Define o checklist exato para formalização documental de intervenções ambientais.',
    dataConferencia: '2026-06-29'
  },
  {
    id: 'n3',
    titulo: 'Lei Federal nº 12.651/2012',
    norma: 'Código Florestal',
    artigo: 'Art. 3º e 4º',
    resumoOperacional: 'Legislação nacional sobre a proteção da vegetação nativa, Áreas de Preservação Permanente (APP) e Reserva Legal.',
    link: 'https://www.planalto.gov.br/ccivil_03/_ato2012-2015/2012/lei/l12651.htm',
    observacaoInterna: 'Base jurídica para intervenções em APP e recomposição.',
    dataConferencia: '2026-06-29'
  },
  {
    id: 'n4',
    titulo: 'Resolução Conjunta SEMAD/IEF nº 1.914/2013',
    norma: 'Resolução 1.914/2013',
    artigo: 'Geral',
    resumoOperacional: 'Dispõe sobre os procedimentos para restituição de Taxa de Expediente e de Taxa Florestal.',
    link: 'https://www.almg.gov.br',
    observacaoInterna: 'Aplica-se ao fluxo de restituição de taxas e DAEs pagos e não utilizados.',
    dataConferencia: '2026-06-29'
  },
  {
    id: 'n5',
    titulo: 'Lei Estadual nº 14.184/2002',
    norma: 'Lei nº 14.184',
    artigo: 'Geral',
    resumoOperacional: 'Dispõe sobre o processo administrativo no âmbito da Administração Pública Estadual de Minas Gerais.',
    link: 'https://www.almg.gov.br',
    observacaoInterna: 'Determina os prazos para diligência (geralmente 30 dias) e direito a recursos.',
    dataConferencia: '2026-06-29'
  }
];

const initialSettings: SystemSettings = {
  nomeUnidade: 'IEF/NAR Guanhães',
  servidorPadrao: 'James',
  chefiaNome: 'Márcio',
  chefiaUnidade: 'IEF/NAR Guanhães',
  chefiaFuncao: 'Validação administrativa / chefia local',
  chefiaModelosValidation: [
    'Aguardando chefia',
    'Validado pela chefia',
    'Ajustar minuta',
    'Encaminhar para Supervisão'
  ],
  chefiaObservacoesPadrao: 'Orientação geral: conferir se shapes e CAR batem com limites da propriedade no cadastro do SIAM.',
  municipiosGuanhaes: initialMunicipalitiesGuanhaes,
  municipiosAflobioPecanha: initialMunicipalitiesAflobio
};

const defaultAiaChecklist = (): ChecklistItem[] => [
  { id: '01', category: 'Geral', description: 'Requerimento para intervenção ambiental assinado', status: 'A VERIFICAR', docVinculado: '', observacao: '', fundamento: 'Res. 3102/2021, Art. 4º, I' },
  { id: '02', category: 'Geral', description: 'Identificação do responsável/empreendedor e comprovante de endereço', status: 'A VERIFICAR', docVinculado: '', observacao: '', fundamento: 'Res. 3102/2021, Art. 4º, II' },
  { id: '03', category: 'Geral', description: 'Identificação do proprietário/possuidor e comprovante de endereço', status: 'A VERIFICAR', docVinculado: '', observacao: '', fundamento: 'Res. 3102/2021, Art. 4º, III' },
  { id: '04', category: 'Geral', description: 'Procuração (quando for o caso)', status: 'NÃO SE APLICA', docVinculado: '', observacao: '', fundamento: 'Procedimento padrão SEI' },
  { id: '05', category: 'Geral', description: 'Documento de comprovação da posse ou propriedade do imóvel', status: 'A VERIFICAR', docVinculado: '', observacao: '', fundamento: 'Res. 3102/2021, Art. 4º, IV' },
  { id: '06', category: 'Geral', description: 'Recibo de inscrição no Cadastro Ambiental Rural (CAR) ativo', status: 'A VERIFICAR', docVinculado: '', observacao: '', fundamento: 'Lei 12.651/2012, Art. 29' },
  { id: '07', category: 'Geral', description: 'Contrato/Anuência quando o requerente não for o proprietário', status: 'NÃO SE APLICA', docVinculado: '', observacao: '' },
  { id: '08', category: 'Geral', description: 'Carta de anuência dos demais proprietários (se condomínio)', status: 'NÃO SE APLICA', docVinculado: '', observacao: '' },
  { id: '09', category: 'Geral', description: 'Planta topográfica ou Croqui com coordenadas da área do imóvel', status: 'A VERIFICAR', docVinculado: '', observacao: '', fundamento: 'Áreas > 10ha necessitam planta topográfica com ART' },
  { id: '10', category: 'Geral', description: 'Arquivos digitais vetoriais de localização (.KMZ / Shapefile)', status: 'A VERIFICAR', docVinculado: '', observacao: '', fundamento: 'Intervenções exigem shapefile em SIRGAS 2000' },
  { id: '11', category: 'Geral', description: 'Projeto de Intervenção Ambiental (PIA) ou Simplificado (PIAS)', status: 'A VERIFICAR', docVinculado: '', observacao: '', fundamento: 'Res. 3102/2021, Anexo I ao VI' },
  { id: '12', category: 'Geral', description: 'Proposta de Medidas Compensatórias (quando cabível)', status: 'A VERIFICAR', docVinculado: '', observacao: '', fundamento: 'Decreto 47.749/2019, Art. 36' },
  { id: '13', category: 'Geral', description: 'Projeto de compensação florestal Lei 13.047/1998 (se bioma Cerrado)', status: 'NÃO SE APLICA', docVinculado: '', observacao: '' },
  { id: '14', category: 'Geral', description: 'DAE devidamente pago - Taxa de Expediente', status: 'A VERIFICAR', docVinculado: '', observacao: '', fundamento: 'Lei de taxas estaduais' },
  { id: '15', category: 'Geral', description: 'DAE devidamente pago - Taxa Florestal (se houver aproveitamento)', status: 'A VERIFICAR', docVinculado: '', observacao: '' },
  { id: '16', category: 'Geral', description: 'Estudos e relatórios de fauna silvestre (inventariamento)', status: 'NÃO SE APLICA', docVinculado: '', observacao: '', fundamento: 'Exigido se supressão acima de determinado limite em Mata Atlântica' },
  { id: '17', category: 'Geral', description: 'Autorizações de resgate, salvamento e destinação de fauna', status: 'NÃO SE APLICA', docVinculado: '', observacao: '' },
  { id: '18', category: 'Geral', description: 'Comprovante de Cadastro no CAF (Cadastro de Consumidores de Matéria-Prima)', status: 'NÃO SE APLICA', docVinculado: '', observacao: '' },
  { id: '19', category: 'Geral', description: 'Recibo do SINAFLOR (quando couber)', status: 'A VERIFICAR', docVinculado: '', observacao: '' }
];

const initialProcesses = (): Process[] => [];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [asvRecords, setAsvRecords] = useState<ASVRecord[]>([]);
  const [taxaRecords, setTaxaRecords] = useState<TaxaRecord[]>([]);
  const [normatives, setNormatives] = useState<Normative[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(initialSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    try {
      const storedProcesses = localStorage.getItem('narflow_v4_processes');
      const storedAsv = localStorage.getItem('narflow_v4_asv');
      const storedTaxas = localStorage.getItem('narflow_v4_taxas');
      const storedNormatives = localStorage.getItem('narflow_v4_normatives');
      const storedSettings = localStorage.getItem('narflow_v4_settings');

      if (storedProcesses) {
        const parsed = JSON.parse(storedProcesses) as Process[];
        const filtered = parsed.filter(
          p => p.id !== 'p1' &&
               p.id !== 'p2' &&
               !p.requerente.toLowerCase().includes('santa rita') &&
               !p.requerente.toLowerCase().includes('geraldo')
        );
        setProcesses(filtered);
      } else {
        setProcesses(initialProcesses());
      }

      if (storedAsv) setAsvRecords(JSON.parse(storedAsv));
      else setAsvRecords([]);

      if (storedTaxas) setTaxaRecords(JSON.parse(storedTaxas));
      else setTaxaRecords([]);

      if (storedNormatives) setNormatives(JSON.parse(storedNormatives));
      else setNormatives(initialNormatives);

      if (storedSettings) setSettings(JSON.parse(storedSettings));
      else setSettings(initialSettings);
    } catch (e) {
      console.error('Error loading data from localStorage', e);
    }
    setIsLoaded(true);
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('narflow_v4_processes', JSON.stringify(processes));
  }, [processes, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('narflow_v4_asv', JSON.stringify(asvRecords));
  }, [asvRecords, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('narflow_v4_taxas', JSON.stringify(taxaRecords));
  }, [taxaRecords, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('narflow_v4_normatives', JSON.stringify(normatives));
  }, [normatives, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('narflow_v4_settings', JSON.stringify(settings));
  }, [settings, isLoaded]);

  // Methods
  const addProcess = (type: Process['type'], details: Partial<Process>) => {
    const id = 'proc_' + Math.random().toString(36).substr(2, 9);

    let aiaData: AiaProcessData | undefined;
    let dcfData: DcfProcessData | undefined;
    let simplesData: SimplesProcessData | undefined;

    if (type === 'AIA') {
      aiaData = {
        intervencoes: [],
        documentosColados: '',
        checklist: defaultAiaChecklist(),
        pendenciasText: '',
        despachoGerado: '',
        memorandoGerado: '',
        contagemDCMG: 0,
        pendenciasNotificadas: false,
        despachoInstrucaoCriado: false,
        memorandoAnalistaCriado: false,
        encaminhadoAnalise: false,
        analiseTecnicaConcluida: false,
        despachoFinalCriado: false,
        encaminhadoSistemaDecisoes: false,
        sinaflorAtualizado: false
      };
    } else if (type === 'DCF') {
      const af = settings.municipiosAflobioPecanha.includes(details.municipio || '');
      dcfData = {
        etapa: 'Entrada',
        isApta: null,
        municipioAflobioPecanha: af,
        conferidoFormulario: false,
        conferidoArquivosDigitais: false,
        conferidoCadastroPlantio: false,
        conferidoDaeTaxaFlorestal: false,
        conferidoDaeExpediente: false,
        conferidoComprovantes: false,
        conferidoTermoCiencia: false,
        conferidoPlanilhaColheita: false,
        produtoDeclarado: '',
        volumeDeclarado: 0,
        correspondeTaxaVolume: false,
        termoConcordanciaOutroProprietario: false,
        daeAnoAnterior: false,
        pagamentoSiteFazendaConfirmado: false,
        despachoAceite: '',
        memorandoTecnico: '',
        despachoRecusa: '',
        comunicacaoRecusa: '',
        despachoSaldoSiam: '',
        despachoAvaliacaoDcf: '',
        intimacaoEletronica: ''
      };
    } else if (type === 'Simples Declaração') {
      simplesData = {
        etapa: 'Entrada',
        conferidoDocumentos: false,
        memorandoTecnico: '',
        intimacaoEletronica: ''
      };
    }

    const isAflobioPecanha = type === 'DCF' && settings.municipiosAflobioPecanha.includes(details.municipio || '');
    const isNarGuanhaes = settings.municipiosGuanhaes.includes(details.municipio || '');

    let sugAcao = details.proximaAcao || 'Realizar triagem e conferência documental';
    if (type === 'DCF' && isAflobioPecanha) {
      sugAcao = 'AFLOBIO Peçanha atende este município para DCF. Encaminhar.';
    }

    const newProc: Process = {
      id,
      seiNumber: details.seiNumber || '',
      type,
      municipio: details.municipio || '',
      requerente: details.requerente || '',
      dataEntrada: details.dataEntrada || new Date().toISOString().split('T')[0],
      unidadeAtual: details.unidadeAtual || settings.nomeUnidade,
      responsavelInterno: details.responsavelInterno || settings.servidorPadrao,
      situacao: details.situacao || 'Criado / Novo na Triagem',
      proximaAcao: sugAcao,
      validacaoChefia: details.validacaoChefia || 'Não precisa',
      chefiaOrientacao: details.chefiaOrientacao || '',
      isFinalized: false,
      emAcompanhamentoEspecial: details.emAcompanhamentoEspecial ?? true,
      acompanhamentoTipo: details.acompanhamentoTipo || (type === 'AIA' ? 'Intervenção Ambiental' : type === 'DCF' ? 'DCFs Ativas' : type === 'Simples Declaração' ? 'Simples Declarações em análise' : 'Outros'),
      blocoInterno: '',
      createdAt: new Date().toISOString(),
      aiaData,
      dcfData,
      simplesData,
      ...details
    };

    setProcesses(prev => [newProc, ...prev]);
    return id;
  };

  const updateProcess = (id: string, details: Partial<Process>) => {
    setProcesses(prev => prev.map(p => {
      if (p.id !== id) return p;
      const updated = { ...p, ...details };
      if (details.isFinalized === true) {
        updated.emAcompanhamentoEspecial = false;
      }
      return updated;
    }));
  };

  const deleteProcess = (id: string) => {
    setProcesses(prev => prev.filter(p => p.id !== id));
  };

  const addASVRecord = (record: Omit<ASVRecord, 'id' | 'createdAt'>) => {
    const newRecord: ASVRecord = {
      id: 'asv_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      ...record
    };
    setAsvRecords(prev => [newRecord, ...prev]);
  };

  const updateASVRecord = (id: string, record: Partial<ASVRecord>) => {
    setAsvRecords(prev => prev.map(r => r.id === id ? { ...r, ...record } : r));
  };

  const addTaxaRecord = (record: Omit<TaxaRecord, 'id' | 'createdAt'>) => {
    const newRecord: TaxaRecord = {
      id: 'tax_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      ...record
    };
    setTaxaRecords(prev => [newRecord, ...prev]);
  };

  const updateTaxaRecord = (id: string, record: Partial<TaxaRecord>) => {
    setTaxaRecords(prev => prev.map(r => r.id === id ? { ...r, ...record } : r));
  };

  const addNormative = (normative: Omit<Normative, 'id'>) => {
    const newNorm: Normative = {
      id: 'norm_' + Math.random().toString(36).substr(2, 9),
      ...normative
    };
    setNormatives(prev => [...prev, newNorm]);
  };

  const updateNormative = (id: string, normative: Partial<Normative>) => {
    setNormatives(prev => prev.map(n => n.id === id ? { ...n, ...normative } : n));
  };

  const deleteNormative = (id: string) => {
    setNormatives(prev => prev.filter(n => n.id !== id));
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const exportData = () => {
    const data = { processes, asvRecords, taxaRecords, normatives, settings };
    return JSON.stringify(data, null, 2);
  };

  const importData = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.processes) setProcesses(data.processes);
      if (data.asvRecords) setAsvRecords(data.asvRecords);
      if (data.taxaRecords) setTaxaRecords(data.taxaRecords);
      if (data.normatives) setNormatives(data.normatives);
      if (data.settings) setSettings(data.settings);
      return true;
    } catch (e) {
      console.error('Invalid JSON for import', e);
      return false;
    }
  };

  const resetAllData = () => {
    setProcesses(initialProcesses());
    setAsvRecords([]);
    setTaxaRecords([]);
    setNormatives(initialNormatives);
    setSettings(initialSettings);
  };

  return (
    <AppContext.Provider value={{
      processes,
      asvRecords,
      taxaRecords,
      normatives,
      settings,
      addProcess,
      updateProcess,
      deleteProcess,
      addASVRecord,
      updateASVRecord,
      addTaxaRecord,
      updateTaxaRecord,
      addNormative,
      updateNormative,
      deleteNormative,
      updateSettings,
      exportData,
      importData,
      resetAllData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
