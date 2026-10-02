import { listarClientes, listarProveedores } from '../services/terceros'
import { useCollection } from './useCollection'

export function useClientes() {
  return useCollection(listarClientes)
}

export function useProveedores() {
  return useCollection(listarProveedores)
}
