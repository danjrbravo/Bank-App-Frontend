import React, { useState } from 'react'
import './ProductModals.css'
import { API_URL } from '../../../config'

function WithdrawModal({ product, onClose, onSuccess }) {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!amount || Number(amount) <= 0) {
      setError('Ingresa un monto válido')
      return
    }

    if (Number(amount) > product.Balance) {
      setError('El monto supera el saldo disponible')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${API_URL}/api/transaction/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionType: 'RETIRO',
          amount: amount,
          originProductId: String(product.id)
        })
      })

      if (!response.ok) {
        throw new Error('No se pudo realizar el retiro')
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
          <h3>Retirar</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <p className="modal-subtitle">
          Cuenta origen: {product.accountNumber}
        </p>

        <form onSubmit={handleSubmit} className="modal-form">
          <label htmlFor="withdraw-amount">Monto</label>
          <input
            id="withdraw-amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            autoFocus
          />

          {error && <div className="modal-error">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="modal-btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="modal-btn-primary" disabled={loading}>
              {loading ? 'Procesando...' : 'Retirar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WithdrawModal