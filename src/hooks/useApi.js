import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useApi — Hook genérico para llamadas a la API
 *
 * @param {() => Promise<any>} serviceFn  — función que retorna una promesa
 * @param {any[]} deps                   — dependencias (igual que useEffect)
 *
 * @returns {{ data, loading, error, refetch }}
 *
 * Ejemplo:
 *   const { data: clients, loading, error, refetch } = useApi(() => clientService.getAll(), []);
 */
export function useApi(serviceFn, deps = []) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fnRef = useRef(serviceFn);
  fnRef.current = serviceFn;

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fnRef.current();
      setData(result);
    } catch (err) {
      setError(err.message ?? 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    execute();
  }, [...deps, execute]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, refetch: execute };
}
