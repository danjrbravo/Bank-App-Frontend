import React from 'react'
import './Product.css'

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

function Product({ product }) {
  const typeClass = product.accountType === 'CORRIENTE' ? 'product-blue' : 'product-green'

  const stateClass =
    product.productState === 'ACTIVE'
      ? 'state-active'
      : product.productState === 'INACTIVE'
      ? 'state-inactive'
      : 'state-cancelled'

  return (
    <div className={`product-card ${typeClass} ${stateClass}`}>
      <div className="product-header">
        <span className="product-type">
          {accountTypeLabel[product.accountType] || product.accountType}
        </span>
        <span className="product-state">
          {stateLabel[product.productState] || product.productState}
        </span>
      </div>

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
  )
}

export default Product