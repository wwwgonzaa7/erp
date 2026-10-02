import { listarCuentasPorCobrar } from '../services/finanzas'
import { useCollection } from './useCollection'

export function useCuentasPorCobrar() {
  return useCollection(listarCuentasPorCobrar)
}
