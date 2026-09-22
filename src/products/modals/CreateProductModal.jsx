import React, { useState } from 'react'
import './ProductModals.css'
import { API_URL } from '../../../config'

function CreateProductModal({ clientId, onClose, onSuccess }) {
  const [accountType, setAccountType] = useState('AHORROS')
  const [balance, setBalance] = useState('0')
  const [gmfExempt, setGmfExempt] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (balance === '' || Number(balance) < 0) {
      setError('El saldo inicial no puede ser menor a 0')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${API_URL}/api/product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountType: accountType,
          clientId: String(clientId),
          balance: String(balance),
          gmfExempt: gmfExempt
        })
      })

      if (!response.ok) {
        throw new Error('No se pudo crear el producto')
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
          <h3>Nuevo producto</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <p className="modal-subtitle">
          Se creará un nuevo producto para este cliente
        </p>

        <form onSubmit={handleSubmit} className="modal-form">
          <label htmlFor="account-type">Tipo de cuenta</label>
          <select
            id="account-type"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
          >
            <option value="AHORROS">Ahorros</option>
            <option value="CORRIENTE">Corriente</option>
          </select>

          <label htmlFor="initial-balance">Saldo inicial</label>
          <input
            id="initial-balance"
            type="number"
            min="0"
            step="0.01"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            placeholder="0.00"
          />

          <label className="modal-checkbox-label">
            <input
              type="checkbox"
              checked={gmfExempt}
              onChange={(e) => setGmfExempt(e.target.checked)}
            />
            Exento de GMF
          </label>

          {error && <div className="modal-error">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="modal-btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="modal-btn-primary" disabled={loading}>
              {loading ? 'Creando...' : 'Crear producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProductModal