import { FormEvent, useEffect, useMemo, useState } from 'react';
import { GraduateRecord, OtherForcesBreakdown } from '../types';

interface NewClassFormProps {
  onAdd: (record: GraduateRecord) => void;
  suggestYear: number | null;
  commanders: string[];
}

interface FormState {
  ano: string;
  turmas: string;
  numeroDeFormados: string;
  cidades: string;
  pais: string;
  comandante: string;
}

const defaultState: FormState = {
  ano: '',
  turmas: '',
  numeroDeFormados: '',
  cidades: '',
  pais: 'Brasil',
  comandante: '',
};

const DEFAULT_STATE_VALUE = 'Ceará';

const OTHER_FORCES_KEYS: Array<keyof OtherForcesBreakdown> = [
  'exercito',
  'aeronautica',
  'pmam',
  'pmrr',
  'pmdf',
  'pmpi',
  'pmsc',
  'pmms',
  'pmac',
  'pmpa',
  'pmto',
  'pmma',
  'pmrn',
  'pmpb',
  'pmmt',
  'pmal',
  'pmsp',
  'pmrs',
  'pmpe',
  'pmro',
  'bmce',
  'prf',
  'policiaPenalCe',
  'guardaMunicipal',
];

const createEmptyOtherForces = (): OtherForcesBreakdown =>
  OTHER_FORCES_KEYS.reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {} as OtherForcesBreakdown);

const NewClassForm = ({ onAdd, suggestYear, commanders }: NewClassFormProps) => {
  const [formState, setFormState] = useState<FormState>(() => ({
    ...defaultState,
    ano: suggestYear ? String(suggestYear) : '',
  }));
  const [error, setError] = useState('');

  const knownCommanders = useMemo(() => commanders.filter(Boolean), [commanders]);

  useEffect(() => {
    if (!formState.ano && suggestYear) {
      setFormState((current) => ({
        ...current,
        ano: String(suggestYear),
      }));
    }
  }, [suggestYear, formState.ano]);

  const updateField = (field: keyof FormState) => (event: FormEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormState((current) => ({
      ...current,
      [field]: event.currentTarget.value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const ano = Number(formState.ano.trim());
    const numero = Number(formState.numeroDeFormados.trim());
    const turmas = formState.turmas.trim();
    const cidades = formState.cidades.trim();
    const pais = formState.pais.trim();
    const comandante = formState.comandante.trim();

    if (!ano || Number.isNaN(ano)) {
      setError('Informe um ano valido.');
      return;
    }

    if (!turmas) {
      setError('Informe o nome da turma.');
      return;
    }

    if (!numero || Number.isNaN(numero)) {
      setError('Informe o total de formados.');
      return;
    }

    if (!cidades) {
      setError('Informe a cidade.');
      return;
    }

    if (!comandante) {
      setError('Informe o comandante responsavel.');
      return;
    }

    const nextRecord: GraduateRecord = {
      ano,
      turmas,
      turmaNoAno: turmas,
      sequenciaHistorica: turmas,
      boletimConvocacao: '-',
      totalIniciaram: numero,
      totalConcluintesPmce: numero,
      detalheOutrasForcas: createEmptyOtherForces(),
      totalConcluintesOutrasForcas: 0,
      totalNaoConcluintesOutrasForcas: 0,
      observacaoNaoConcluintes: '-',
      numeroDeFormados: numero,
      estado: DEFAULT_STATE_VALUE,
      cidades,
      pais: pais || 'Brasil',
      comandante,
    };

    onAdd(nextRecord);
    setFormState({ ...defaultState, ano: suggestYear ? String(suggestYear) : '' });
  };

  return (
    <section className="panel new-class-panel">
      <div className="panel-header">
        <h3>Adicionar nova turma</h3>
        <span>Inclua rapidamente turmas que ainda nao estao no arquivo</span>
      </div>
      <form className="new-class-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="new-class-year">Ano</label>
          <input
            id="new-class-year"
            type="number"
            min="1900"
            max="2100"
            value={formState.ano}
            onChange={updateField('ano')}
            placeholder="2024"
          />
        </div>
        <div className="form-row">
          <label htmlFor="new-class-name">Turma</label>
          <input
            id="new-class-name"
            type="text"
            value={formState.turmas}
            onChange={updateField('turmas')}
            placeholder="14o CEPM"
          />
        </div>
        <div className="form-row">
          <label htmlFor="new-class-total">Total de formados</label>
          <input
            id="new-class-total"
            type="number"
            min="1"
            value={formState.numeroDeFormados}
            onChange={updateField('numeroDeFormados')}
            placeholder="30"
          />
        </div>
        <div className="form-row">
          <label htmlFor="new-class-city">Cidade</label>
          <input
            id="new-class-city"
            type="text"
            value={formState.cidades}
            onChange={updateField('cidades')}
            placeholder="Fortaleza"
          />
        </div>
        <div className="form-row">
          <label htmlFor="new-class-country">Pais</label>
          <input
            id="new-class-country"
            type="text"
            value={formState.pais}
            onChange={updateField('pais')}
            placeholder="Brasil"
          />
        </div>
        <div className="form-row">
          <label htmlFor="new-class-commander">Comandante</label>
          <input
            id="new-class-commander"
            type="text"
            value={formState.comandante}
            onChange={updateField('comandante')}
            placeholder="Cel. Nome"
            list="known-commanders"
          />
          {knownCommanders.length > 0 ? (
            <datalist id="known-commanders">
              {knownCommanders.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          ) : null}
        </div>
        {error ? <p className="form-error">{error}</p> : null}
        <div className="form-actions">
          <button type="submit">Adicionar turma</button>
        </div>
      </form>
    </section>
  );
};

export default NewClassForm;
