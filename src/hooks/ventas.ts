import { listarFacturas, listarVentas } from '../services/ventas'
import { useCollection } from './useCollection'

export function useVentas() {
  return useCollection(listarVentas)
}

export function useFacturas() {
  return useCollection(listarFacturas)
}
