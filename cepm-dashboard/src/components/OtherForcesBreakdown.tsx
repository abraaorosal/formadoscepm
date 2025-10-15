import { CSSProperties } from 'react';
import { OtherForcesTotals } from '../types';

interface OtherForcesBreakdownProps {
  totals: OtherForcesTotals;
  totalConcluintes: number;
  historicTotals: OtherForcesTotals;
  historicTotal: number;
}

const LABELS: Record<keyof OtherForcesTotals, string> = {
  exercito: 'Exercito',
  aeronautica: 'Aeronautica',
  pmam: 'PMAM',
  pmrr: 'PMRR',
  pmdf: 'PMDF',
  pmpi: 'PMPI',
  pmsc: 'PMSC',
  pmms: 'PMMS',
  pmac: 'PMAC',
  pmpa: 'PMPA',
  pmto: 'PMTO',
  pmma: 'PMMA',
  pmrn: 'PMRN',
  pmpb: 'PMPB',
  pmmt: 'PMMT',
  pmal: 'PMAL',
  pmsp: 'PMSP',
  pmrs: 'PMRS',
  pmpe: 'PMPE',
  pmro: 'PMRO',
  bmce: 'BMCE',
  prf: 'PRF',
  policiaPenalCe: 'Policia Penal CE',
  guardaMunicipal: 'Guarda Municipal',
};

const OtherForcesBreakdown = ({
  totals,
  totalConcluintes,
  historicTotals,
  historicTotal,
}: OtherForcesBreakdownProps) => {
  const entries = Object.entries(totals)
    .map(([key, value]) => [key as keyof OtherForcesTotals, value] as const)
    .sort((a, b) => b[1] - a[1])
    .filter(([, value]) => value > 0);

  if (totalConcluintes === 0) {
    return (
      <div className="other-forces">
        <div className="panel-header">
          <h3>Outras forcas concludentes</h3>
          <span>Nenhum registro no filtro atual</span>
        </div>
        <p className="panel-empty">Selecione outro recorte para visualizar a distribuicao.</p>
      </div>
    );
  }

  return (
    <div className="other-forces">
      <div className="panel-header">
        <h3>Outras forcas concludentes</h3>
        <span>
          {totalConcluintes.toLocaleString('pt-BR')} no recorte •{' '}
          {historicTotal.toLocaleString('pt-BR')} no historico
        </span>
      </div>
      <ul className="other-forces-list">
        {entries.map(([key, value]) => {
          const share = totalConcluintes === 0 ? 0 : (value / totalConcluintes) * 100;
          const historicValue = historicTotals[key] ?? 0;
          const style = {
            '--progress-ratio': Math.min(share / 100, 1),
          } as CSSProperties;

          return (
            <li key={key} style={style}>
              <div className="other-force-content">
                <p className="other-force-name">{LABELS[key]}</p>
                <p className="other-force-caption">
                  {value.toLocaleString('pt-BR')} no recorte •{' '}
                  {historicValue.toLocaleString('pt-BR')} no historico
                </p>
              </div>
              <span className="other-force-share">{share.toFixed(1)}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default OtherForcesBreakdown;
