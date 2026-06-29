export interface ChecklistItem {
  id: string;
  category: 'Geral' | 'Uso Alternativo' | 'APP' | 'Sub-bosque' | 'Manejo' | 'Destoca' | 'Árvores Isoladas' | 'Aproveitamento';
  description: string;
  status: 'SIM' | 'NÃO' | 'NÃO SE APLICA' | 'A VERIFICAR';
  docVinculado: string;
  observacao: string;
  fundamento?: string;
}

export interface AiaProcessData {
  intervencoes: string[];
  documentosColados: string;
  checklist: ChecklistItem[];
  pendenciasText: string;
  despachoGerado: string;
  memorandoGerado: string;
}

export interface DcfProcessData {
  etapa: 'Entrada' | 'Conferência' | 'Apta' | 'Recusada' | 'Finalização';
  isApta: boolean | null;
  municipioAflobioPecanha: boolean;
  
  // Checklist items
  conferidoFormulario: boolean;
  conferidoArquivosDigitais: boolean;
  conferidoCadastroPlantio: boolean;
  conferidoDaeTaxaFlorestal: boolean;
  conferidoDaeExpediente: boolean;
  conferidoComprovantes: boolean;
  conferidoTermoCiencia: boolean;
  conferidoPlanilhaColheita: boolean;
  produtoDeclarado: string;
  volumeDeclarado: number;
  correspondeTaxaVolume: boolean;
  termoConcordanciaOutroProprietario: boolean;
  daeAnoAnterior: boolean;
  pagamentoSiteFazendaConfirmado: boolean;
  
  // Outputs
  despachoAceite: string;
  memorandoTecnico: string;
  despachoRecusa: string;
  comunicacaoRecusa: string;
  despachoSaldoSiam: string;
  despachoAvaliacaoDcf: string;
  intimacaoEletronica: string;
}

export interface SimplesProcessData {
  etapa: 'Entrada' | 'Conferência' | 'Finalização';
  conferidoDocumentos: boolean;
  memorandoTecnico: string;
  intimacaoEletronica: string;
}

export interface Process {
  id: string;
  seiNumber: string;
  type: 'AIA' | 'DCF' | 'Simples Declaração' | 'Restituição' | 'Vista/Cópia' | 'ASV' | 'Outros';
  municipio: string;
  requerente: string;
  dataEntrada: string;
  unidadeAtual: string;
  responsavelInterno: string;
  situacao: string;
  proximaAcao: string;
  
  // Validação da chefia (Márcio IEF)
  validacaoChefia: 'Não precisa' | 'Aguardando chefia' | 'Validado pela chefia' | 'Ajustar minuta' | 'Encaminhar para Supervisão' | 'Aguardando assinatura da Supervisão' | 'Retornou assinado';
  chefiaOrientacao: string;
  chefiaDataValidacao?: string;
  chefiaResponsavelProximaAcao?: string;

  // Flow status
  isFinalized: boolean;
  emAcompanhamentoEspecial: boolean;
  acompanhamentoTipo: string;
  blocoInterno: string;
  createdAt: string;

  // Nested structures
  aiaData?: AiaProcessData;
  dcfData?: DcfProcessData;
  simplesData?: SimplesProcessData;
}

export interface ASVRecord {
  id: string;
  placa: string;
  condutor: string;
  destino: string;
  tipoAtendimento: 'Tipo 1: Local/Intermunicipal' | 'Tipo 2: Viagem' | 'Tipo 3: Oficina/Manutenção';
  quilometragemSaida: number;
  horarioSaida: string;
  quilometragemRetorno?: number;
  horarioRetorno?: string;
  observacao: string;
  status: 'Saída' | 'Retorno' | 'Oficina';
  createdAt: string;
}

export interface TaxaRecord {
  id: string;
  numeroDAE: string;
  tipoTaxa: 'Expediente' | 'Florestal' | 'Reposição' | 'Outra';
  valor: number;
  dataEmissao: string;
  comprovanteAnexo: boolean;
  processoVinculado: string;
  situacao: 'Pago' | 'Não localizado' | 'Usado em outro processo' | 'Passível de restituição' | 'Indeferir' | 'A verificar';
  
  // Checklist
  daeAnexado: boolean;
  comprovanteAnexado: boolean;
  usadoOutroProcesso: boolean;
  fatoGerador: boolean;
  cabeDeclaracao: boolean;
  encaminharSEF: boolean;

  // Minutas
  minutaDeclaracao: string;
  minutaIndeferimento: string;
  oficioInteressado: string;
  anotacaoPlanilha: string;
  createdAt: string;
}

export interface Normative {
  id: string;
  titulo: string;
  norma: string;
  artigo: string;
  resumoOperacional: string;
  link: string;
  observacaoInterna: string;
  dataConferencia: string;
}

export interface SystemSettings {
  nomeUnidade: string;
  servidorPadrao: string;
  chefiaNome: string;
  chefiaUnidade: string;
  chefiaFuncao: string;
  chefiaModelosValidation: string[];
  chefiaObservacoesPadrao: string;
  municipiosGuanhaes: string[];
  municipiosAflobioPecanha: string[];
  responsaveisTecnicos: string[];
}
