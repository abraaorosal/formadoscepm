import { YearlyAggregate } from '../types';

interface YearlyBarChartProps {
  data: YearlyAggregate[];
}

const YearlyBarChart = ({ data }: YearlyBarChartProps) => {
  if (!data.length) {
    return <p className="panel-empty">Nenhum dado disponivel para exibir o grafico.</p>;
  }

  const sorted = [...data].sort((a, b) => a.ano - b.ano);
  const maxValue = Math.max(
    ...sorted.map((item) => Math.max(item.totalIniciaram, item.totalFormados)),
    1,
  );

  return (
    <div className="yearly-chart">
      <div className="panel-header">
        <h3>Evolucao anual</h3>
        <span>Comparativo entre ingressos e concluintes</span>
      </div>
      <div className="chart-grid">
        {sorted.map((item) => {
          const baseWidth = Math.round((item.totalIniciaram / maxValue) * 100);
          const formedWidth = Math.round((item.totalFormados / maxValue) * 100);
          const displayBaseWidth = Math.max(baseWidth, baseWidth > 0 ? 8 : 0);
          const displayFormedWidth = Math.max(formedWidth, formedWidth > 0 ? 8 : 0);
          const taxaConclusao =
            item.totalIniciaram === 0 ? 0 : (item.totalFormados / item.totalIniciaram) * 100;
          return (
            <div key={item.ano} className="chart-row">
              <div className="chart-label">
                <span className="chart-year">{item.ano}</span>
                <span className="chart-turmas">{item.turmas} turmas</span>
              </div>
              <div className="chart-bar-wrapper">
                <div className="chart-bar-layers">
                  <div className="chart-bar-base" style={{ width: `${displayBaseWidth}%` }} />
                  <div className="chart-bar" style={{ width: `${displayFormedWidth}%` }} />
                </div>
                <div className="chart-value">
                  <span className="chart-main-value">
                    {item.totalFormados.toLocaleString('pt-BR')} concluintes
                  </span>
                  <span className="chart-subvalue">
                    {item.totalIniciaram.toLocaleString('pt-BR')} iniciaram •{' '}
                    {item.totalConcluintesPmce.toLocaleString('pt-BR')} PMCE •{' '}
                    {item.totalConcluintesOutrasForcas.toLocaleString('pt-BR')} outras forcas •{' '}
                    {taxaConclusao.toFixed(1)}% de conclusao
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default YearlyBarChart;
