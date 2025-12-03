export interface OtherForcesBreakdown {
  exercito: number;
  aeronautica: number;
  pmam: number;
  pmrr: number;
  pmdf: number;
  pmpi: number;
  pmsc: number;
  pmms: number;
  pmac: number;
  pmpa: number;
  pmto: number;
  pmma: number;
  pmrn: number;
  pmpb: number;
  pmmt: number;
  pmal: number;
  pmsp: number;
  pmrs: number;
  pmpe: number;
  pmro: number;
  bmce: number;
  prf: number;
  policiaPenalCe: number;
  guardaMunicipal: number;
}

export interface GraduateRecord {
  ano: number;
  turmas: string;
  turmaNoAno: string;
  sequenciaHistorica: string;
  boletimConvocacao: string;
  totalIniciaram: number;
  totalConcluintesPmce: number;
  detalheOutrasForcas: OtherForcesBreakdown;
  totalConcluintesOutrasForcas: number;
  totalNaoConcluintesOutrasForcas: number;
  observacaoNaoConcluintes: string;
  numeroDeFormados: number;
  estado: string;
  cidades: string;
  pais: string;
  comandante: string;
}

export type OtherForcesTotals = Record<keyof OtherForcesBreakdown, number>;

export interface YearlyAggregate {
  ano: number;
  totalFormados: number;
  turmas: number;
  totalIniciaram: number;
  totalConcluintesPmce: number;
  totalConcluintesOutrasForcas: number;
}

export interface CommanderAggregate {
  comandante: string;
  turmas: number;
  totalFormados: number;
  totalIniciaram: number;
  totalConcluintesOutrasForcas: number;
}
