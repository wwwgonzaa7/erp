import type { Permiso, RegistroAuditoria, Rol, Usuario } from '../types'

export const permisos: Permiso[] = [
  { id: 'perm-001', codigo: 'ventas.consultar' },
  { id: 'perm-002', codigo: 'compras.consultar' },
  { id: 'perm-003', codigo: 'inventario.consultar' },
]

export const roles: Rol[] = [
  {
    id: 'rol-001',
    nombre: 'Administrador',
    permisoIds: ['perm-001', 'perm-002', 'perm-003'],
  },
  { id: 'rol-002', nombre: 'Comercial', permisoIds: ['perm-001'] },
]

export const usuarios: Usuario[] = [
  { id: 'usr-001', nombre: 'Ana Torres', rolIds: ['rol-001'] },
  { id: 'usr-002', nombre: 'Luis Pérez', rolIds: ['rol-002'] },
]

export const registrosAuditoria: RegistroAuditoria[] = [
  {
    id: 'aud-001',
    usuarioId: 'usr-002',
    accion: 'crear',
    entidad: 'venta',
    entidadId: 'ven-001',
    fecha: '2026-09-05',
  },
  {
    id: 'aud-002',
    usuarioId: 'usr-001',
    accion: 'crear',
    entidad: 'ordenCompra',
    entidadId: 'oc-001',
    fecha: '2026-08-23',
  },
]
