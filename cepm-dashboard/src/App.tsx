import { useMemo, useState } from 'react';
import dataset from './data/graduates.json';
import Filters from './components/Filters';
import StatCard from './components/StatCard';
import YearlyBarChart from './components/YearlyBarChart';
import GraduatesTable from './components/GraduatesTable';
import OtherForcesBreakdown from './components/OtherForcesBreakdown';
import {
  GraduateRecord,
  OtherForcesTotals,
  YearlyAggregate,
} from './types';
import raioEmblem from './assets/raio.png';
import './App.css';

const initialRecords: GraduateRecord[] = (dataset as GraduateRecord[]).map((item) => ({
  ...item,
  turmas: item.turmas.trim(),
  turmaNoAno: item.turmaNoAno.trim(),
  sequenciaHistorica: item.sequenciaHistorica.trim(),
  boletimConvocacao: item.boletimConvocacao.trim(),
  estado: item.estado.trim(),
  cidades: item.cidades.trim(),
  pais: item.pais.trim(),
  comandante: item.comandante.trim(),
  observacaoNaoConcluintes: item.observacaoNaoConcluintes.trim(),
}));

const OTHER_FORCES_KEYS = Object.keys(initialRecords[0]?.detalheOutrasForcas ?? {}) as Array<
  keyof GraduateRecord['detalheOutrasForcas']
>;

const createEmptyBreakdown = (): OtherForcesTotals =>
  OTHER_FORCES_KEYS.reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {} as OtherForcesTotals);

const computeTotals = (recordsList: GraduateRecord[]) => {
  const totals = {
    totalFormados: 0,
    totalIniciaram: 0,
    totalConcluintesPmce: 0,
    totalConcluintesOutrasForcas: 0,
    totalNaoConcluintesOutrasForcas: 0,
    detalheOutrasForcas: createEmptyBreakdown(),
  };

  recordsList.forEach((record) => {
    totals.totalFormados += record.numeroDeFormados;
    totals.totalIniciaram += record.totalIniciaram;
    totals.totalConcluintesPmce += record.totalConcluintesPmce;
    totals.totalConcluintesOutrasForcas += record.totalConcluintesOutrasForcas;
    totals.totalNaoConcluintesOutrasForcas += record.totalNaoConcluintesOutrasForcas;

    OTHER_FORCES_KEYS.forEach((key) => {
      totals.detalheOutrasForcas[key] += record.detalheOutrasForcas[key];
    });
  });

  return totals;
};

type BaseTotals = ReturnType<typeof computeTotals>;

interface TotalsSummary extends BaseTotals {
  mediaFormados: number;
  mediaIniciaram: number;
  taxaConclusao: number;
  maiorTurma: GraduateRecord | undefined;
  cidadesAtendidas: number;
}

const App = () => {
  const records = initialRecords;
  const [yearFilter, setYearFilter] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(records.map((item) => item.ano)));
    return uniqueYears.sort((a, b) => a - b);
  }, [records]);

  const globalTotals = useMemo(() => {
    const baseTotals = computeTotals(records);
    const totalTurmas = records.length;
    const yearsList = years;
    const firstYear = yearsList[0] ?? null;
    const lastYear = yearsList.length ? yearsList[yearsList.length - 1] : null;
    const uniqueCities = new Set(records.map((item) => item.cidades));

    return {
      ...baseTotals,
      totalTurmas,
      firstYear,
      lastYear,
      cidades: uniqueCities.size,
    };
  }, [records, years]);

  const filteredRecords = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return records.filter((record) => {
      const matchesYear = yearFilter === 'all' || record.ano === yearFilter;

      if (term.length === 0) {
        return matchesYear;
      }

      const normalized = [
        record.turmas,
        record.cidades,
        String(record.ano),
      ]
        .join(' ')
        .toLowerCase();

      const matchesSearch = normalized.includes(term);
      return matchesYear && matchesSearch;
    });
  }, [records, yearFilter, searchTerm]);

  const coverage = useMemo(() => {
    if (globalTotals.totalTurmas === 0) {
      return 0;
    }

    return Math.round((filteredRecords.length / globalTotals.totalTurmas) * 100);
  }, [filteredRecords.length, globalTotals.totalTurmas]);

  const filteredTotals = useMemo<TotalsSummary>(() => {
    if (!filteredRecords.length) {
      return {
        ...computeTotals([]),
        mediaFormados: 0,
        mediaIniciaram: 0,
        taxaConclusao: 0,
        maiorTurma: undefined,
        cidadesAtendidas: 0,
      };
    }

    const baseTotals = computeTotals(filteredRecords);
    const maiorTurma = filteredRecords.reduce((best, item) => {
      if (!best) {
        return item;
      }

      if (item.totalIniciaram > best.totalIniciaram) {
        return item;
      }

      if (
        item.totalIniciaram === best.totalIniciaram &&
        item.numeroDeFormados > best.numeroDeFormados
      ) {
        return item;
      }

      return best;
    });

    const mediaFormados = baseTotals.totalFormados / filteredRecords.length;
    const mediaIniciaram = baseTotals.totalIniciaram / filteredRecords.length;
    const taxaConclusao =
      baseTotals.totalIniciaram === 0 ? 0 : baseTotals.totalFormados / baseTotals.totalIniciaram;
    const cidadesAtendidas = new Set(filteredRecords.map((item) => item.cidades)).size;

    return {
      ...baseTotals,
      mediaFormados,
      mediaIniciaram,
      taxaConclusao,
      maiorTurma,
      cidadesAtendidas,
    };
  }, [filteredRecords]);

  const yearlyAggregates = useMemo<YearlyAggregate[]>(() => {
    const aggregator = new Map<
      number,
      {
        totalFormados: number;
        turmas: number;
        totalIniciaram: number;
        totalConcluintesPmce: number;
        totalConcluintesOutrasForcas: number;
      }
    >();

    filteredRecords.forEach((record) => {
      const current =
        aggregator.get(record.ano) ?? {
          totalFormados: 0,
          turmas: 0,
          totalIniciaram: 0,
          totalConcluintesPmce: 0,
          totalConcluintesOutrasForcas: 0,
        };
      current.totalFormados += record.numeroDeFormados;
      current.totalIniciaram += record.totalIniciaram;
      current.totalConcluintesPmce += record.totalConcluintesPmce;
      current.totalConcluintesOutrasForcas += record.totalConcluintesOutrasForcas;
      current.turmas += 1;
      aggregator.set(record.ano, current);
    });

    return Array.from(aggregator.entries()).map(([ano, value]) => ({
      ano,
      totalFormados: value.totalFormados,
      turmas: value.turmas,
      totalIniciaram: value.totalIniciaram,
      totalConcluintesPmce: value.totalConcluintesPmce,
      totalConcluintesOutrasForcas: value.totalConcluintesOutrasForcas,
    }));
  }, [filteredRecords]);

  const tableRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      if (a.ano === b.ano) {
        return a.turmas.localeCompare(b.turmas, 'pt-BR');
      }
      return b.ano - a.ano;
    });
  }, [filteredRecords]);

  const showFilteredTotals = filteredRecords.length > 0;
  const firstYearLabel = globalTotals.firstYear ? String(globalTotals.firstYear) : '...';

  const resetFilters = () => {
    setYearFilter('all');
    setSearchTerm('');
  };

  return (
    <div className="app-container">
      <header className="page-header">
        <div className="header-brand">
          <img src={raioEmblem} alt="Emblema RAIO" className="header-logo" />
          <div>
            <p className="subtitle">CEPM / RAIO</p>
            <h1>Historico de formados</h1>
            <p className="description">
              Visualize a evolucao das turmas do Centro de Ensino e Pesquisa em Motopatrulhamento -
              RAIO desde {firstYearLabel}.
            </p>
          </div>
        </div>
        <div className="header-meta">
          <span>{globalTotals.totalTurmas} turmas</span>
          <span>{globalTotals.totalFormados.toLocaleString('pt-BR')} formados</span>
        </div>
      </header>

      <Filters
        years={years}
        selectedYear={yearFilter}
        searchTerm={searchTerm}
        onYearChange={setYearFilter}
        onSearchChange={setSearchTerm}
        onReset={resetFilters}
      />

      <section className="stats-grid">
        <StatCard
          title="Concluintes no recorte"
          value={filteredTotals.totalFormados.toLocaleString('pt-BR')}
          emphasis={`${coverage}% da base`}
          caption={`Turmas consideradas: ${filteredRecords.length.toLocaleString('pt-BR')} de ${globalTotals.totalTurmas}`}
        />
        <StatCard
          title="Participantes que iniciaram"
          value={filteredTotals.totalIniciaram.toLocaleString('pt-BR')}
          caption={`Historico: ${globalTotals.totalIniciaram.toLocaleString('pt-BR')} ingressos`}
        />
        <StatCard
          title="Conclusão — PMCE"
          value={filteredTotals.totalConcluintesPmce.toLocaleString('pt-BR')}
          caption={`Historico: ${globalTotals.totalConcluintesPmce.toLocaleString('pt-BR')} policiais`}
        />
        <StatCard
          title="Conclusão — outras forças"
          value={filteredTotals.totalConcluintesOutrasForcas.toLocaleString('pt-BR')}
          caption={`Historico: ${globalTotals.totalConcluintesOutrasForcas.toLocaleString('pt-BR')} profissionais`}
        />
        <StatCard
          title="Taxa de conclusão"
          value={showFilteredTotals ? `${(filteredTotals.taxaConclusao * 100).toFixed(1)}%` : '0%'}
          caption={
            showFilteredTotals
              ? `Media de ingressos por turma: ${filteredTotals.mediaIniciaram.toFixed(1)}`
              : 'Sem dados suficientes'
          }
        />
        <StatCard
          title="Maior turma do recorte"
          value={
            filteredTotals.maiorTurma
              ? filteredTotals.maiorTurma.totalIniciaram.toLocaleString('pt-BR')
              : '--'
          }
          emphasis={
            filteredTotals.maiorTurma
              ? `${filteredTotals.maiorTurma.turmas} • ${filteredTotals.maiorTurma.ano}`
              : undefined
          }
          caption={
            showFilteredTotals
              ? filteredTotals.maiorTurma
                ? `Iniciaram: ${filteredTotals.maiorTurma.totalIniciaram.toLocaleString(
                    'pt-BR',
                  )} • Concluíram: ${filteredTotals.maiorTurma.numeroDeFormados.toLocaleString(
                    'pt-BR',
                  )} (${filteredTotals.maiorTurma.totalConcluintesPmce.toLocaleString(
                    'pt-BR',
                  )} PMCE, ${filteredTotals.maiorTurma.totalConcluintesOutrasForcas.toLocaleString(
                    'pt-BR',
                  )} outras) • Cidades no recorte: ${filteredTotals.cidadesAtendidas} de ${globalTotals.cidades}`
                : 'Sem dados para determinar a maior turma'
              : 'Selecione um recorte para ver detalhes'
          }
        />
      </section>

      <section className="visualizations">
        <div className="panel">
          <YearlyBarChart data={yearlyAggregates} />
        </div>
        <div className="panel">
          <OtherForcesBreakdown
            totals={filteredTotals.detalheOutrasForcas}
            totalConcluintes={filteredTotals.totalConcluintesOutrasForcas}
            historicTotals={globalTotals.detalheOutrasForcas}
            historicTotal={globalTotals.totalConcluintesOutrasForcas}
          />
        </div>
      </section>

      <section className="panel table-panel">
        <div className="panel-header">
          <h3>Turmas formadas</h3>
          <span>{tableRecords.length} registros listados</span>
        </div>
        <GraduatesTable records={tableRecords} />
      </section>
    </div>
  );
};

export default App;
