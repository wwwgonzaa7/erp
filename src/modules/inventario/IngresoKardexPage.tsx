import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import LineasCantidadEditor from '../../components/LineasCantidadEditor'
import { useAlmacenes, useOrdenesCompra, useProductos, useRecepciones } from '../../hooks'
import { actualizarRecepcion, crearRecepcion, eliminarRecepcion } from '../../services/compras'
import type { Recepcion } from '../../types'
import { describirLineas } from '../../utils/format'

type RecepcionDraft = Omit<Recepcion, 'id'>

function nuevaRecepcion(): RecepcionDraft {
  return { ordenCompraId: '', almacenId: '', fecha: '', lineas: [{ productoId: '', cantidad: 1 }] }
}

export function IngresoKardexPage() {
  const recepciones = useRecepciones()
  const ordenes = useOrdenesCompra()
  const almacenes = useAlmacenes()
  const productos = useProductos()
  const [draft, setDraft] = useState<RecepcionDraft>(nuevaRecepcion)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [mensaje, setMensaje] = useState('')
  const [mensajeTipo, setMensajeTipo] = useState<'success' | 'error'>('error')
  const [guardando, setGuardando] = useState(false)

  function editar(recepcion: Recepcion) {
    setEditandoId(recepcion.id)
    setDraft({
      ordenCompraId: recepcion.ordenCompraId,
      almacenId: recepcion.almacenId,
      fecha: recepcion.fecha,
      lineas: recepcion.lineas.map((linea) => ({ ...linea })),
    })
    setMensaje('')
  }

  function cancelar() {
    setEditandoId(null)
    setDraft(nuevaRecepcion())
    setMensaje('')
  }

  async function guardar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setGuardando(true)
    setMensaje('')
    try {
      if (editandoId) await actualizarRecepcion(editandoId, draft)
      else await crearRecepcion(draft)
      cancelar()
      recepciones.reload()
      setMensaje(editandoId ? 'Recepción actualizada correctamente.' : 'Recepción creada correctamente.')
      setMensajeTipo('success')
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudo guardar la recepción.')
      setMensajeTipo('error')
    } finally {
      setGuardando(false)
    }
  }

  async function eliminar(id: string) {
    if (!window.confirm('¿Eliminar esta recepción?')) return
    setMensaje('')
    try {
      await eliminarRecepcion(id)
      if (editandoId === id) cancelar()
      recepciones.reload()
      setMensaje('Recepción eliminada correctamente.')
      setMensajeTipo('success')
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudo eliminar la recepción.')
      setMensajeTipo('error')
    }
  }

  const ordenSeleccionada = ordenes.data.find((orden) => orden.id === draft.ordenCompraId)
  const productosDeOrden = productos.data.filter((producto) => ordenSeleccionada?.lineas.some((linea) => linea.productoId === producto.id))

  return (
    <section className="page area-compras">
      <div className="page-heading"><div><span className="eyebrow">COMPRAS</span><h1>Recepción de compras</h1><p>Confirma qué productos llegaron de una orden de compra y en qué almacén se recibieron.</p></div></div>
      {mensaje && <p className={`notice ${mensajeTipo === 'success' ? 'notice-success' : 'notice-error'}`} role={mensajeTipo === 'error' ? 'alert' : 'status'}>{mensaje}</p>}
      {(recepciones.error || ordenes.error || almacenes.error || productos.error) && (
        <p className="notice notice-error" role="alert">No se pudieron cargar los datos.</p>
      )}
      {(recepciones.loading || ordenes.loading || almacenes.loading || productos.loading) && <p className="notice" role="status">Cargando datos…</p>}
      <div className="section-card"><div className="section-head"><h2>Recepciones registradas</h2></div><div className="table-wrap">
        <table>
          <thead><tr><th>Recepción</th><th>Fecha</th><th>Orden</th><th>Almacén</th><th>Productos</th><th>Acciones</th></tr></thead>
          <tbody>
            {recepciones.data.map((recepcion) => (
              <tr key={recepcion.id}>
                <td>{recepcion.id}</td>
                <td>{recepcion.fecha}</td>
                <td>{recepcion.ordenCompraId}</td>
                <td>{almacenes.data.find((almacen) => almacen.id === recepcion.almacenId)?.nombre ?? recepcion.almacenId}</td>
                <td>{describirLineas(recepcion.lineas, productos.data)}</td>
                <td><div className="row-actions">
                  <button className="button" type="button" onClick={() => editar(recepcion)}>Editar</button>
                  <button className="button button-danger" type="button" onClick={() => void eliminar(recepcion.id)}>Eliminar</button>
                </div></td>
              </tr>
            ))}
            {!recepciones.loading && !recepciones.error && recepciones.data.length === 0 && <tr><td className="empty-cell" colSpan={6}>No hay recepciones registradas.</td></tr>}
          </tbody>
        </table>
      </div></div>
      <div className="section-card form-card"><div className="section-head"><h2>{editandoId ? 'Editar recepción' : 'Nueva recepción'}</h2></div>
      <form onSubmit={(event) => void guardar(event)}>
        <div className="form-fields">
          <label>
            Orden de compras
            <select
              required
              value={draft.ordenCompraId}
              onChange={(event) => setDraft({
                ...draft,
                ordenCompraId: event.target.value,
                lineas: [{ productoId: '', cantidad: 1 }],
              })}
            >
              <option value="">Selecciona una orden</option>
              {ordenes.data.map((orden) => (
                <option key={orden.id} value={orden.id}>{orden.id}</option>
              ))}
            </select>
          </label>
          <label>
            Almacén
            <select
              required
              value={draft.almacenId}
              onChange={(event) => setDraft({ ...draft, almacenId: event.target.value })}
            >
              <option value="">Selecciona un almacén</option>
              {almacenes.data.map((almacen) => (
                <option key={almacen.id} value={almacen.id}>{almacen.nombre}</option>
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
        <LineasCantidadEditor
          lineas={draft.lineas}
          productos={productosDeOrden}
          onChange={(lineas) => setDraft({ ...draft, lineas })}
        />
        <div className="actions">
          <button className="button button-primary" type="submit" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar recepción'}</button>
          {editandoId && <button className="button" type="button" onClick={cancelar}>Cancelar</button>}
        </div>
      </form>
      </div>
      <div className="next-step"><span>Después de recibir productos</span><Link to="/ventas/movimiento-kardex">Ver entradas en inventario <span aria-hidden="true">→</span></Link></div>
    </section>
  )
}
