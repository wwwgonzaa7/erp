import { listarOrdenesCompra, listarRecepciones } from '../services/compras'
import { useCollection } from './useCollection'

export function useOrdenesCompra() {
  return useCollection(listarOrdenesCompra)
}

export function useRecepciones() {
  return useCollection(listarRecepciones)
}
