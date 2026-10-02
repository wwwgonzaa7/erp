import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { useClientes, useCuentasPorCobrar, useFacturas, useVentas } from '../../hooks'
import { actualizarFactura, crearFactura, eliminarFactura } from '../../services/ventas'
import type { Factura } from '../../types'
import { formatoNumero } from '../../utils/format'

type FacturaDraft = Omit<Factura, 'id'>

function nuevaFactura(): FacturaDraft {
  return { ventaId: '', fechaEmision: '', importe: 0 }
}

export function FacturacionPage() {
  const facturas = useFacturas()
  const ventas = useVentas()
  const clientes = useClientes()
  const cuentas = useCuentasPorCobrar()
  const [draft, setDraft] = useState<FacturaDraft>(nuevaFactura)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [mensaje, setMensaje] = useState('')
  const [mensajeTipo, setMensajeTipo] = useState<'success' | 'error'>('error')
  const [guardando, setGuardando] = useState(false)

  function editar(factura: Factura) {
    setEditandoId(factura.id)
    setDraft({ ventaId: factura.ventaId, fechaEmision: factura.fechaEmision, importe: factura.importe })
    setMensaje('')
  }

  function cancelar() {
    setEditandoId(null)
    setDraft(nuevaFactura())
    setMensaje('')
  }

  async function guardar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setGuardando(true)
    setMensaje('')
    try {
      if (editandoId) await actualizarFactura(editandoId, draft)
      else await crearFactura(draft)
      cancelar()
      facturas.reload()
      setMensaje(editandoId ? 'Factura actualizada correctamente.' : 'Factura creada correctamente.')
      setMensajeTipo('success')
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudo guardar la factura.')
      setMensajeTipo('error')
    } finally {
      setGuardando(false)
    }
  }

  async function eliminar(id: string) {
    if (!window.confirm('¿Eliminar esta factura?')) return
    setMensaje('')
    try {
      await eliminarFactura(id)
      if (editandoId === id) cancelar()
      facturas.reload()
      setMensaje('Factura eliminada correctamente.')
      setMensajeTipo('success')
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudo eliminar la factura.')
      setMensajeTipo('error')
    }
  }

  return (
    <section className="page area-ventas">
      <div className="page-heading"><div><span className="eyebrow">VENTAS</span><h1>Facturación</h1><p>Emite una factura desde una venta registrada. El importe se completa con los productos vendidos.</p></div></div>
      {mensaje && <p className={`notice ${mensajeTipo === 'success' ? 'notice-success' : 'notice-error'}`} role={mensajeTipo === 'error' ? 'alert' : 'status'}>{mensaje}</p>}
      {(facturas.error || ventas.error || clientes.error || cuentas.error) && (
        <p className="notice notice-error" role="alert">No se pudieron cargar los datos.</p>
      )}
      {(facturas.loading || ventas.loading || clientes.loading || cuentas.loading) && <p className="notice" role="status">Cargando datos…</p>}
      <div className="section-card"><div className="section-head"><h2>Facturas registradas</h2></div><div className="table-wrap">
        <table>
          <thead><tr><th>Factura</th><th>Venta</th><th>Cliente</th><th>Emisión</th><th>Importe</th><th>Acciones</th></tr></thead>
          <tbody>
            {facturas.data.map((factura) => {
              const venta = ventas.data.find((item) => item.id === factura.ventaId)
              const conCuenta = cuentas.data.some((cuenta) => cuenta.facturaId === factura.id)
              return (
                <tr key={factura.id}>
                  <td>{factura.id}</td>
                  <td>{factura.ventaId}</td>
                  <td>{clientes.data.find((cliente) => cliente.id === venta?.clienteId)?.nombre ?? venta?.clienteId ?? '—'}</td>
                  <td>{factura.fechaEmision}</td>
                  <td>{formatoNumero(factura.importe)}</td>
                  <td><div className="row-actions">
                    <button className="button" type="button" disabled={conCuenta} onClick={() => editar(factura)}>Editar</button>
                    <button className="button button-danger" type="button" disabled={conCuenta} onClick={() => void eliminar(factura.id)}>Eliminar</button>
                    {conCuenta && <span className="state-badge">Con cuenta</span>}
                  </div></td>
                </tr>
              )
            })}
            {!facturas.loading && !facturas.error && facturas.data.length === 0 && <tr><td className="empty-cell" colSpan={6}>No hay facturas registradas.</td></tr>}
          </tbody>
        </table>
      </div></div>
      <div className="section-card form-card"><div className="section-head"><h2>{editandoId ? 'Editar factura' : 'Nueva factura'}</h2></div>
      <form onSubmit={(event) => void guardar(event)}>
        <div className="form-fields">
          <label>
            Orden de ventas
            <select
              required
              value={draft.ventaId}
              onChange={(event) => {
                const venta = ventas.data.find((item) => item.id === event.target.value)
                setDraft({
                  ...draft,
                  ventaId: event.target.value,
                  importe: venta?.lineas.reduce((total, linea) => total + linea.cantidad * linea.precioUnitario, 0) ?? 0,
                })
              }}
            >
              <option value="">Selecciona una venta</option>
              {ventas.data.map((venta) => (
                <option key={venta.id} value={venta.id}>{venta.id}</option>
              ))}
            </select>
          </label>
          <label>
            Fecha de emisión
            <input
              required
              type="date"
              value={draft.fechaEmision}
              onChange={(event) => setDraft({ ...draft, fechaEmision: event.target.value })}
            />
          </label>
          <label>
            Importe de la venta
            <input
              required
              readOnly
              type="number"
              min="0"
              step="0.01"
              value={draft.importe}
            />
          </label>
        </div>
        <div className="actions">
          <button className="button button-primary" type="submit" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar factura'}</button>
          {editandoId && <button className="button" type="button" onClick={cancelar}>Cancelar</button>}
        </div>
      </form>
      </div>
      <div className="next-step"><span>Después de facturar</span><Link to="/ventas/estado-cuenta">Consultar lo pendiente de cobro <span aria-hidden="true">→</span></Link></div>
    </section>
  )
}
