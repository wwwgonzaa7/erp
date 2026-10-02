import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import LineasConPrecioEditor from '../../components/LineasConPrecioEditor'
import { useOrdenesCompra, useProductos, useProveedores, useRecepciones } from '../../hooks'
import {
  actualizarOrdenCompra,
  crearOrdenCompra,
  eliminarOrdenCompra,
} from '../../services/compras'
import type { OrdenCompra } from '../../types'
import { describirLineas } from '../../utils/format'

type OrdenDraft = Omit<OrdenCompra, 'id'>

function nuevaOrden(): OrdenDraft {
  return { proveedorId: '', fecha: '', lineas: [{ productoId: '', cantidad: 1, precioUnitario: 0 }] }
}

export function OrdenComprasPage() {
  const ordenes = useOrdenesCompra()
  const proveedores = useProveedores()
  const productos = useProductos()
  const recepciones = useRecepciones()
  const [draft, setDraft] = useState<OrdenDraft>(nuevaOrden)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [mensaje, setMensaje] = useState('')
  const [mensajeTipo, setMensajeTipo] = useState<'success' | 'error'>('error')
  const [guardando, setGuardando] = useState(false)

  function editar(orden: OrdenCompra) {
    setEditandoId(orden.id)
    setDraft({
      proveedorId: orden.proveedorId,
      fecha: orden.fecha,
      lineas: orden.lineas.map((linea) => ({ ...linea })),
    })
    setMensaje('')
  }

  function cancelar() {
    setEditandoId(null)
    setDraft(nuevaOrden())
    setMensaje('')
  }

  async function guardar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setGuardando(true)
    setMensaje('')
    try {
      if (editandoId) await actualizarOrdenCompra(editandoId, draft)
      else await crearOrdenCompra(draft)
      cancelar()
      ordenes.reload()
      setMensaje(editandoId ? 'Orden actualizada correctamente.' : 'Orden creada correctamente.')
      setMensajeTipo('success')
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudo guardar la orden.')
      setMensajeTipo('error')
    } finally {
      setGuardando(false)
    }
  }

  async function eliminar(id: string) {
    if (!window.confirm('¿Eliminar esta orden de compras?')) return
    setMensaje('')
    try {
      await eliminarOrdenCompra(id)
      if (editandoId === id) cancelar()
      ordenes.reload()
      setMensaje('Orden eliminada correctamente.')
      setMensajeTipo('success')
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudo eliminar la orden.')
      setMensajeTipo('error')
    }
  }

  return (
    <section className="page area-compras">
      <div className="page-heading"><div><span className="eyebrow">COMPRAS</span><h1>Órdenes de compra</h1><p>Registra lo que pides a un proveedor. Cuando llegue, confirma los productos recibidos.</p></div></div>
      {mensaje && <p className={`notice ${mensajeTipo === 'success' ? 'notice-success' : 'notice-error'}`} role={mensajeTipo === 'error' ? 'alert' : 'status'}>{mensaje}</p>}
      {(ordenes.error || proveedores.error || productos.error || recepciones.error) && (
        <p className="notice notice-error" role="alert">No se pudieron cargar los datos.</p>
      )}
      {(ordenes.loading || proveedores.loading || productos.loading || recepciones.loading) && <p className="notice" role="status">Cargando datos…</p>}
      <div className="section-card"><div className="section-head"><h2>Órdenes registradas</h2></div><div className="table-wrap">
        <table>
          <thead><tr><th>Orden</th><th>Fecha</th><th>Proveedor</th><th>Productos</th><th>Acciones</th></tr></thead>
          <tbody>
            {ordenes.data.map((orden) => {
              const recibida = recepciones.data.some((recepcion) => recepcion.ordenCompraId === orden.id)
              return (
                <tr key={orden.id}>
                  <td>{orden.id}</td>
                  <td>{orden.fecha}</td>
                  <td>{proveedores.data.find((proveedor) => proveedor.id === orden.proveedorId)?.nombre ?? orden.proveedorId}</td>
                  <td>{describirLineas(orden.lineas, productos.data)}</td>
                  <td><div className="row-actions">
                    <button className="button" type="button" disabled={recibida} onClick={() => editar(orden)}>Editar</button>
                    <button className="button button-danger" type="button" disabled={recibida} onClick={() => void eliminar(orden.id)}>Eliminar</button>
                    {recibida && <span className="state-badge">Recibida</span>}
                  </div></td>
                </tr>
              )
            })}
            {!ordenes.loading && !ordenes.error && ordenes.data.length === 0 && <tr><td className="empty-cell" colSpan={5}>No hay órdenes registradas.</td></tr>}
          </tbody>
        </table>
      </div></div>
      <div className="section-card form-card"><div className="section-head"><h2>{editandoId ? 'Editar orden de compra' : 'Nueva orden de compra'}</h2></div>
      <form onSubmit={(event) => void guardar(event)}>
        <div className="form-fields">
          <label>
            Proveedor
            <select
              required
              value={draft.proveedorId}
              onChange={(event) => setDraft({ ...draft, proveedorId: event.target.value })}
            >
              <option value="">Selecciona un proveedor</option>
              {proveedores.data.map((proveedor) => (
                <option key={proveedor.id} value={proveedor.id}>{proveedor.nombre}</option>
              ))}
            </select>
          </label>
          <label>
            Fecha
            <input
              required
              type="date"
              value={draft.fecha}
              onChange={(event) => setDraft({ ...draft, fecha: event.target.value })}
            />
          </label>
        </div>
        <LineasConPrecioEditor
          lineas={draft.lineas}
          productos={productos.data}
          onChange={(lineas) => setDraft({ ...draft, lineas })}
        />
        <div className="actions">
          <button className="button button-primary" type="submit" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar orden'}</button>
          {editandoId && <button className="button" type="button" onClick={cancelar}>Cancelar</button>}
        </div>
      </form>
      </div>
      <div className="next-step"><span>Después de la compra</span><Link to="/ventas/ingreso-kardex">Confirmar los productos recibidos <span aria-hidden="true">→</span></Link></div>
    </section>
  )
}
