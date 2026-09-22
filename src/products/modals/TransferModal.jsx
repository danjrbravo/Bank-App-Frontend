import React, { useState, useEffect } from 'react'
import './ProductModals.css'
import { API_URL } from '../../../config'

function TransferModal({ product, onClose, onSuccess }) {
  const [amount, setAmount] = useState('')
  const [destinyProductId, setDestinyProductId] = useState('')
  const [availableProducts, setAvailableProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true)

        const response = await fetch(`${API_URL}/api/product`)

        if (!response.ok) {
          throw new Error('No se pudieron cargar las cuentas destino')
        }

        const data = await response.json()

        const filtered = data.filter(p => p.id !== product.id)
        setAvailableProducts(filtered)

      } catch (err) {
        setError(err.message)
        console.error(err)
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchProducts()
  }, [product.id])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!amount || Number(amount) <= 0) {
      setError('Ingresa un monto válido')
      return
    }

    if (!destinyProductId) {
      setError('Selecciona una cuenta destino')
      return
    }

    if (Number(amount) > product.Balance) {
      setError('El monto supera el saldo disponible')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${API_URL}/api/transaction/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionType: 'TRANSFERENCIA',
          amount: amount,
          originProductId: String(product.id),
          destinyProductId: String(destinyProductId)
        })
      })

      if (!response.ok) {
        throw new Error('No se pudo realizar la transferencia')
      }

      onSuccess()
      onClose()

    } catch (err) {
      setError(err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Transferir</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <p className="modal-subtitle">
          Cuenta origen: {product.accountNumber}
        </p>

        <form onSubmit={handleSubmit} className="modal-form">
          <label htmlFor="destiny-product">Cuenta destino</label>
          <select
            id="destiny-product"
            value={destinyProductId}
            onChange={(e) => setDestinyProductId(e.target.value)}
            disabled={loadingProducts}
          >
            <option value="">
              {loadingProducts ? 'Cargando cuentas...' : 'Selecciona una cuenta'}
            </option>
            {availableProducts.map(p => (
              <option key={p.id} value={p.id}>
                {p.accountNumber} · {p.accountType} (Cliente {p.clientId})
              </option>
            ))}
          </select>

          <label htmlFor="transfer-amount">Monto</label>
          <input
            id="transfer-amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
          />

          {error && <div className="modal-error">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="modal-btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="modal-btn-primary" disabled={loading}>
              {loading ? 'Procesando...' : 'Transferir'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TransferModal