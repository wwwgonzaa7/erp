import type { Permiso, Rol, Usuario } from '../../types'

export type AccessContext = {
  usuario: Usuario | null
  roles: readonly Rol[]
  permisos: readonly Permiso[]
}
