import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { useClientes, useCuentasPorCobrar, useFacturas, useVentas } from '../../hooks'
import {
  actualizarCuentaPorCobrar,
  crearCuentaPorCobrar,
  eliminarCuentaPorCobrar,
} from '../../services/finanzas'
import type { CuentaPorCobrar } from '../../types'
import { formatoNumero } from '../../utils/format'

type CuentaDraft = Omit<CuentaPorCobrar, 'id'>

function nuevaCuenta(): CuentaDraft {
  return { facturaId: '', importe: 0, saldoPendiente: 0, fechaVencimiento: '' }
}

export function EstadoCuentaPage() {
  const cuentas = useCuentasPorCobrar()
  const facturas = useFacturas()
  const ventas = useVentas()
  const clientes = useClientes()
  const [draft, setDraft] = useState<CuentaDraft>(nuevaCuenta)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [clienteFiltro, setClienteFiltro] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [mensajeTipo, setMensajeTipo] = useState<'success' | 'error'>('error')
  const [guardando, setGuardando] = useState(false)

  function clienteDeFactura(facturaId: string) {
    const factura = facturas.data.find((item) => item.id === facturaId)
    return ventas.data.find((venta) => venta.id === factura?.ventaId)?.clienteId
  }

  function editar(cuenta: CuentaPorCobrar) {
    setEditandoId(cuenta.id)
    setDraft({
      facturaId: cuenta.facturaId,
      importe: cuenta.importe,
      saldoPendiente: cuenta.saldoPendiente,
      fechaVencimiento: cuenta.fechaVencimiento,
    })
    setMensaje('')
  }

  function cancelar() {
    setEditandoId(null)
    setDraft(nuevaCuenta())
    setMensaje('')
  }

  async function guardar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setGuardando(true)
    setMensaje('')
    try {
      if (editandoId) await actualizarCuentaPorCobrar(editandoId, draft)
      else await crearCuentaPorCobrar(draft)
      cancelar()
      cuentas.reload()
      setMensaje(editandoId ? 'Cuenta actualizada correctamente.' : 'Cuenta creada correctamente.')
      setMensajeTipo('success')
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudo guardar la cuenta.')
      setMensajeTipo('error')
    } finally {
      setGuardando(false)
    }
  }

  async function eliminar(id: string) {
    if (!window.confirm('¿Eliminar esta cuenta por cobrar?')) return
    setMensaje('')
    try {
      await eliminarCuentaPorCobrar(id)
      if (editandoId === id) cancelar()
      cuentas.reload()
      setMensaje('Cuenta eliminada correctamente.')
      setMensajeTipo('success')
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudo eliminar la cuenta.')
      setMensajeTipo('error')
    }
  }

  const visibles = cuentas.data.filter((cuenta) => !clienteFiltro || clienteDeFactura(cuenta.facturaId) === clienteFiltro)

  return (
    <section className="page area-cobros">
      <div className="page-heading"><div><span className="eyebrow">COBROS</span><h1>Cuentas por cobrar</h1><p>Consulta y actualiza cuánto queda por cobrar de cada factura.</p></div></div>
      {mensaje && <p className={`notice ${mensajeTipo === 'success' ? 'notice-success' : 'notice-error'}`} role={mensajeTipo === 'error' ? 'alert' : 'status'}>{mensaje}</p>}
      {(cuentas.error || facturas.error || ventas.error || clientes.error) && (
        <p className="notice notice-error" role="alert">No se pudieron cargar los datos.</p>
      )}
      {(cuentas.loading || facturas.loading || ventas.loading || clientes.loading) && <p className="notice" role="status">Cargando datos…</p>}
      <div className="section-card"><div className="section-head"><h2>Cuentas registradas</h2><small>{visibles.length} resultados</small></div><div className="filters"><label>
        Filtrar por cliente
        <select value={clienteFiltro} onChange={(event) => setClienteFiltro(event.target.value)}>
          <option value="">Todos</option>
          {clientes.data.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
          ))}
        </select>
      </label></div><div className="table-wrap">
        <table>
          <thead><tr><th>Cuenta</th><th>Factura</th><th>Cliente</th><th>Importe</th><th>Saldo pendiente</th><th>Vencimiento</th><th>Acciones</th></tr></thead>
          <tbody>
            {visibles.map((cuenta) => {
              const clienteId = clienteDeFactura(cuenta.facturaId)
              return (
                <tr key={cuenta.id}>
                  <td>{cuenta.id}</td>
                  <td>{cuenta.facturaId}</td>
                  <td>{clientes.data.find((cliente) => cliente.id === clienteId)?.nombre ?? clienteId ?? '—'}</td>
                  <td>{formatoNumero(cuenta.importe)}</td>
                  <td>{formatoNumero(cuenta.saldoPendiente)}</td>
                  <td>{cuenta.fechaVencimiento}</td>
                  <td><div className="row-actions">
                    <button className="button" type="button" onClick={() => editar(cuenta)}>Editar</button>
                    <button className="button button-danger" type="button" onClick={() => void eliminar(cuenta.id)}>Eliminar</button>
                  </div></td>
                </tr>
              )
            })}
            {!cuentas.loading && !cuentas.error && visibles.length === 0 && <tr><td className="empty-cell" colSpan={7}>No hay cuentas para mostrar.</td></tr>}
          </tbody>
        </table>
      </div></div>
      <div className="section-card form-card"><div className="section-head"><h2>{editandoId ? 'Editar cuenta por cobrar' : 'Nueva cuenta por cobrar'}</h2></div>
      <form onSubmit={(event) => void guardar(event)}>
        <div className="form-fields">
          <label>
            Factura
            <select
              required
              value={draft.facturaId}
              onChange={(event) => {
                const factura = facturas.data.find((item) => item.id === event.target.value)
                setDraft({
                  ...draft,
                  facturaId: event.target.value,
                  importe: factura?.importe ?? 0,
                  saldoPendiente: factura?.importe ?? 0,
                })
              }}
            >
              <option value="">Selecciona una factura</option>
              {facturas.data.map((factura) => (
                <option key={factura.id} value={factura.id}>{factura.id}</option>
              ))}
            </select>
          </label>
          <label>
            Importe de la factura
            <input
              required
              readOnly
              type="number"
              min="0"
              step="0.01"
              value={draft.importe}
            />
          </label>
          <label>
            Saldo pendiente
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={draft.saldoPendiente}
              onChange={(event) => setDraft({ ...draft, saldoPendiente: Number(event.target.value) })}
            />
          </label>
          <label>
            Fecha de vencimiento
            <input
              required
              type="date"
              value={draft.fechaVencimiento}
              onChange={(event) => setDraft({ ...draft, fechaVencimiento: event.target.value })}
            />
          </label>
        </div>
        <div className="actions">
          <button className="button button-primary" type="submit" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar cuenta'}</button>
          {editandoId && <button className="button" type="button" onClick={cancelar}>Cancelar</button>}
        </div>
      </form>
      </div>
      <div className="next-step"><span>Vista general</span><Link to="/inicio/panel">Volver al Panel <span aria-hidden="true">→</span></Link></div>
    </section>
  )
}
