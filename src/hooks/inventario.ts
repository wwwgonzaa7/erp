import { listarAlmacenes, listarProductos } from '../services/inventario'
import { useCollection } from './useCollection'

export function useProductos() {
  return useCollection(listarProductos)
}

export function useAlmacenes() {
  return useCollection(listarAlmacenes)
}
