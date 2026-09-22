import React, { useState } from 'react'
import './Product.css'
import ConsignModal from './modals/ConsignModal'
import WithdrawModal from './modals/WithdrawModal'
import TransferModal from './modals/TransferModal'
import chipImg from '../assets/chip.png'
import { API_URL } from '../../config'

const accountTypeLabel = {
  CORRIENTE: 'Cuenta Corriente',
  AHORROS: 'Cuenta de Ahorros'
}

const stateLabel = {
  ACTIVE: 'Activa',
  INACTIVE: 'Inactiva',
  CANCELLED: 'Cancelada'
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 2
  }).format(value)
}

function Product({ product, onTransactionSuccess }) {
  const [openModal, setOpenModal] = useState(null) // 'consign' | 'withdraw' | 'transfer' | null
  const [statusLoading, setStatusLoading] = useState(false)
  const [statusError, setStatusError] = useState(null)

  const typeClass = product.accountType === 'CORRIENTE' ? 'product-blue' : 'product-green'

  const stateClass =
    product.productState === 'ACTIVE'
      ? 'state-active'
      : product.productState === 'INACTIVE'
      ? 'state-inactive'
      : 'state-cancelled'

  const isActive = product.productState === 'ACTIVE'

  const handleStatusChange = async (action, confirmMessage) => {
    if (confirmMessage && !window.confirm(confirmMessage)) {
      return
    }

    try {
      setStatusLoading(true)
      setStatusError(null)

      const response = await fetch(`${API_URL}/api/product/${product.id}/${action}`, {
        method: 'PUT'
      })

      if (!response.ok) {
        throw new Error('No se pudo actualizar el estado del producto')
      }

      onTransactionSuccess()

    } catch (err) {
      setStatusError(err.message)
      console.error(err)
    } finally {
      setStatusLoading(false)
    }
  }

  return (
    <div className="product-wrapper">

      <div className={`product-card ${typeClass} ${stateClass}`}>

        <div className="product-main">
          <span className="product-type">
            {accountTypeLabel[product.accountType] || product.accountType}
          </span>

          <img src={chipImg} alt="chip" className="product-chip" />

          <div className="product-number">N° {product.accountNumber}</div>

          <div className="product-balance">
            {formatCurrency(product.Balance)}
          </div>

          {product.productState === 'CANCELLED' && (
            <div className="product-cancelled-tag">Cancelada</div>
          )}

          {product.gmfExcempt && (
            <div className="product-gmf">Exento de GMF</div>
          )}
        </div>

        <div className="product-side">
          <span className="product-state">
            {stateLabel[product.productState] || product.productState}
          </span>

          {isActive && (
            <div className="product-actions">
              <button
                className="product-action-btn btn-consign"
                title="Consignar"
                onClick={() => setOpenModal('consign')}
              >
                +
              </button>
              <button
                className="product-action-btn btn-withdraw"
                title="Retirar"
                onClick={() => setOpenModal('withdraw')}
              >
                −
              </button>
              <button
                className="product-action-btn btn-transfer"
                title="Transferir"
                onClick={() => setOpenModal('transfer')}
              >
                →
              </button>
            </div>
          )}
        </div>

      </div>

      <div className="product-status-actions">
        <button
          className="status-btn status-activate"
          disabled={product.productState === 'ACTIVE' || statusLoading}
          onClick={() => handleStatusChange('activate')}
        >
          Activar
        </button>
        <button
          className="status-btn status-deactivate"
          disabled={product.productState === 'INACTIVE' || statusLoading}
          onClick={() => handleStatusChange('deactivate')}
        >
          Desactivar
        </button>
        <button
          className="status-btn status-cancel"
          disabled={product.productState === 'CANCELLED' || statusLoading}
          onClick={() =>
            handleStatusChange(
              'cancel',
              '¿Estás seguro de cancelar este producto? Esta acción no se puede deshacer.'
            )
          }
        >
          Cancelar
        </button>
      </div>

      {statusError && <div className="status-error">{statusError}</div>}

      {openModal === 'consign' && (
        <ConsignModal
          product={product}
          onClose={() => setOpenModal(null)}
          onSuccess={onTransactionSuccess}
        />
      )}

      {openModal === 'withdraw' && (
        <WithdrawModal
          product={product}
          onClose={() => setOpenModal(null)}
          onSuccess={onTransactionSuccess}
        />
      )}

      {openModal === 'transfer' && (
        <TransferModal
          product={product}
          onClose={() => setOpenModal(null)}
          onSuccess={onTransactionSuccess}
        />
      )}

    </div>
  )
}

export default Product