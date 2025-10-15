import { GraduateRecord } from '../types';

interface GraduatesTableProps {
  records: GraduateRecord[];
}

const GraduatesTable = ({ records }: GraduatesTableProps) => {
  if (!records.length) {
    return <p className="panel-empty">Nenhuma turma encontrada com os filtros atuais.</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Ano</th>
            <th>Seq. CEPM</th>
            <th>Turma (ano)</th>
            <th>BCG de convocacao</th>
            <th>Iniciaram</th>
            <th>Conclusao PMCE</th>
            <th>Conclusao outras forcas</th>
            <th>Outras forcas que nao concluiram</th>
            <th>Total de formados</th>
            <th>Cidade</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={`${record.ano}-${record.turmas}-${index}`}>
              <td>{record.ano}</td>
              <td>{record.turmas}</td>
              <td>{record.turmaNoAno}</td>
              <td>{record.boletimConvocacao || '—'}</td>
              <td>{record.totalIniciaram.toLocaleString('pt-BR')}</td>
              <td>{record.totalConcluintesPmce.toLocaleString('pt-BR')}</td>
              <td>{record.totalConcluintesOutrasForcas.toLocaleString('pt-BR')}</td>
              <td title={record.observacaoNaoConcluintes || undefined}>
                {record.totalNaoConcluintesOutrasForcas.toLocaleString('pt-BR')}
              </td>
              <td>{record.numeroDeFormados.toLocaleString('pt-BR')}</td>
              <td>{record.cidades}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GraduatesTable;
