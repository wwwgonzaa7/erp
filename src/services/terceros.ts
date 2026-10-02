import { clientes, proveedores } from '../data/terceros'
import type { Cliente, Proveedor } from '../types'

export function listarClientes(): Promise<readonly Cliente[]> {
  return Promise.resolve([...clientes])
}

export function listarProveedores(): Promise<readonly Proveedor[]> {
  return Promise.resolve([...proveedores])
}
