import type { FechaISO, Id } from './common'

export interface Usuario {
  id: Id
  nombre: string
  rolIds: Id[]
}

export interface Rol {
  id: Id
  nombre: string
  permisoIds: Id[]
}

export interface Permiso {
  id: Id
  codigo: string
}

export interface RegistroAuditoria {
  id: Id
  usuarioId: Id
  accion: string
  entidad: string
  entidadId: Id
  fecha: FechaISO
}
