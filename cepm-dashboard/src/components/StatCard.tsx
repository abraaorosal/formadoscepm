interface StatCardProps {
  title: string;
  value: string;
  emphasis?: string;
  caption?: string;
}

const StatCard = ({ title, value, emphasis, caption }: StatCardProps) => (
  <article className="stat-card">
    <header>
      <p className="stat-label">{title}</p>
      {emphasis && <span className="stat-emphasis">{emphasis}</span>}
    </header>
    <p className="stat-value">{value}</p>
    {caption && <p className="stat-caption">{caption}</p>}
  </article>
);

export default StatCard;
