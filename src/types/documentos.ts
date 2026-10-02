import type { Id } from './common'

export interface Documento {
  id: Id
  nombre: string
  tipo: string
  entidad: string
  entidadId: Id
}
