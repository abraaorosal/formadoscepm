import { CommanderAggregate } from '../types';

interface CommanderLeaderboardProps {
  data: CommanderAggregate[];
}

const CommanderLeaderboard = ({ data }: CommanderLeaderboardProps) => {
  if (!data.length) {
    return <p className="panel-empty">Nenhum comandante encontrado para o filtro selecionado.</p>;
  }

  const top = [...data]
    .sort((a, b) => b.totalFormados - a.totalFormados)
    .slice(0, 5);

  return (
    <div className="leaderboard">
      <div className="panel-header">
        <h3>Comandantes em destaque</h3>
        <span>Totais de concluintes e taxa de aproveitamento</span>
      </div>
      <div className="leaderboard-cards">
        {top.map((item, index) => (
          <article key={item.comandante} className="leaderboard-card">
            <header className="leaderboard-card-header">
              <span className="leaderboard-rank-chip">#{index + 1}</span>
              <div className="leaderboard-card-title">
                <p className="leaderboard-name">{item.comandante}</p>
                <p className="leaderboard-caption">
                  {item.turmas} turmas • {item.totalIniciaram.toLocaleString('pt-BR')} iniciaram
                </p>
              </div>
            </header>
            <div className="leaderboard-card-metrics">
              <div className="leaderboard-metric-block">
                <p className="leaderboard-metric-label">Conclusão total</p>
                <p className="leaderboard-value">
                  {item.totalFormados.toLocaleString('pt-BR')} concluintes
                </p>
              </div>
              <div className="leaderboard-metric-block">
                <p className="leaderboard-metric-label">Outras forças</p>
                <p className="leaderboard-subvalue">
                  {item.totalConcluintesOutrasForcas.toLocaleString('pt-BR')} participantes
                </p>
                <p className="leaderboard-subvalue">
                  {item.totalIniciaram === 0
                    ? '0%'
                    : `${((item.totalFormados / item.totalIniciaram) * 100).toFixed(1)}% de aproveitamento`}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default CommanderLeaderboard;
