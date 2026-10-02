import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import LineasConPrecioEditor from '../../components/LineasConPrecioEditor'
import { useClientes, useFacturas, useProductos, useVentas } from '../../hooks'
import { actualizarVenta, crearVenta, eliminarVenta } from '../../services/ventas'
import type { Venta } from '../../types'
import { describirLineas } from '../../utils/format'

type VentaDraft = Omit<Venta, 'id'>

function nuevaVenta(): VentaDraft {
  return { clienteId: '', fecha: '', lineas: [{ productoId: '', cantidad: 1, precioUnitario: 0 }] }
}

export function OrdenVentasPage() {
  const ventas = useVentas()
  const clientes = useClientes()
  const productos = useProductos()
  const facturas = useFacturas()
  const [draft, setDraft] = useState<VentaDraft>(nuevaVenta)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [mensaje, setMensaje] = useState('')
  const [mensajeTipo, setMensajeTipo] = useState<'success' | 'error'>('error')
  const [guardando, setGuardando] = useState(false)

  function editar(venta: Venta) {
    setEditandoId(venta.id)
    setDraft({
      clienteId: venta.clienteId,
      fecha: venta.fecha,
      lineas: venta.lineas.map((linea) => ({ ...linea })),
    })
    setMensaje('')
  }

  function cancelar() {
    setEditandoId(null)
    setDraft(nuevaVenta())
    setMensaje('')
  }

  async function guardar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setGuardando(true)
    setMensaje('')
    try {
      if (editandoId) await actualizarVenta(editandoId, draft)
      else await crearVenta(draft)
      cancelar()
      ventas.reload()
      setMensaje(editandoId ? 'Orden actualizada correctamente.' : 'Orden creada correctamente.')
      setMensajeTipo('success')
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudo guardar la venta.')
      setMensajeTipo('error')
    } finally {
      setGuardando(false)
    }
  }

  async function eliminar(id: string) {
    if (!window.confirm('¿Eliminar esta orden de ventas?')) return
    setMensaje('')
    try {
      await eliminarVenta(id)
      if (editandoId === id) cancelar()
      ventas.reload()
      setMensaje('Orden eliminada correctamente.')
      setMensajeTipo('success')
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudo eliminar la venta.')
      setMensajeTipo('error')
    }
  }

  return (
    <section className="page area-ventas">
      <div className="page-heading"><div><span className="eyebrow">VENTAS</span><h1>Órdenes de venta</h1><p>Registra los productos vendidos a un cliente. Después emite la factura de esa venta.</p></div></div>
      {mensaje && <p className={`notice ${mensajeTipo === 'success' ? 'notice-success' : 'notice-error'}`} role={mensajeTipo === 'error' ? 'alert' : 'status'}>{mensaje}</p>}
      {(ventas.error || clientes.error || productos.error || facturas.error) && (
        <p className="notice notice-error" role="alert">No se pudieron cargar los datos.</p>
      )}
      {(ventas.loading || clientes.loading || productos.loading || facturas.loading) && <p className="notice" role="status">Cargando datos…</p>}
      <div className="section-card"><div className="section-head"><h2>Ventas registradas</h2></div><div className="table-wrap">
        <table>
          <thead><tr><th>Venta</th><th>Fecha</th><th>Cliente</th><th>Productos</th><th>Acciones</th></tr></thead>
          <tbody>
            {ventas.data.map((venta) => {
              const facturada = facturas.data.some((factura) => factura.ventaId === venta.id)
              return (
                <tr key={venta.id}>
                  <td>{venta.id}</td>
                  <td>{venta.fecha}</td>
                  <td>{clientes.data.find((cliente) => cliente.id === venta.clienteId)?.nombre ?? venta.clienteId}</td>
                  <td>{describirLineas(venta.lineas, productos.data)}</td>
                  <td><div className="row-actions">
                    <button className="button" type="button" disabled={facturada} onClick={() => editar(venta)}>Editar</button>
                    <button className="button button-danger" type="button" disabled={facturada} onClick={() => void eliminar(venta.id)}>Eliminar</button>
                    {facturada && <span className="state-badge">Facturada</span>}
                  </div></td>
                </tr>
              )
            })}
            {!ventas.loading && !ventas.error && ventas.data.length === 0 && <tr><td className="empty-cell" colSpan={5}>No hay ventas registradas.</td></tr>}
          </tbody>
        </table>
      </div></div>
      <div className="section-card form-card"><div className="section-head"><h2>{editandoId ? 'Editar orden de venta' : 'Nueva orden de venta'}</h2></div>
      <form onSubmit={(event) => void guardar(event)}>
        <div className="form-fields">
          <label>
            Cliente
            <select
              required
              value={draft.clienteId}
              onChange={(event) => setDraft({ ...draft, clienteId: event.target.value })}
            >
              <option value="">Selecciona un cliente</option>
              {clientes.data.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
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
          <button className="button button-primary" type="submit" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar venta'}</button>
          {editandoId && <button className="button" type="button" onClick={cancelar}>Cancelar</button>}
        </div>
      </form>
      </div>
      <div className="next-step"><span>Después de la venta</span><Link to="/ventas/facturacion">Emitir una factura <span aria-hidden="true">→</span></Link></div>
    </section>
  )
}
