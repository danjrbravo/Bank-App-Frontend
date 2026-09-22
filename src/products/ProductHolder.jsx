import React, { useState, useEffect, useCallback } from 'react'
import './ProductHolder.css'
import Product from './Product'
import CreateProductModal from './modals/CreateProductModal'
import { API_URL } from '../../config'

function ProductHolder({ clientId }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const fetchProducts = useCallback(async () => {
    if (!clientId) {
      setProducts([])
      return
    }

    try {
      setLoading(true)
      setError(false)

      const response = await fetch(`${API_URL}/api/product/client/${clientId}`)

      if (!response.ok) {
        throw new Error('Error al obtener los productos')
      }

      const data = await response.json()
      setProducts(data)

    } catch (err) {
      setError(true)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [clientId])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  if (loading) {
    return <div className="product-holder-message">Cargando productos...</div>
  }

  if (error) {
    return <div className="product-holder-message">Error al obtener los productos</div>
  }

  const canAddProduct = products.length < 2

  if (products.length === 0) {
    return (
      <>
        <div className="product-holder-empty">
          <p>Este cliente no tiene productos</p>
          <button
            className="add-product-btn"
            onClick={() => setShowCreateModal(true)}
          >
            +
          </button>
        </div>

        {showCreateModal && (
          <CreateProductModal
            clientId={clientId}
            onClose={() => setShowCreateModal(false)}
            onSuccess={fetchProducts}
          />
        )}
      </>
    )
  }

  return (
    <>
      <div className="product-holder">
        {products.map(product => (
          <Product
            key={product.id}
            product={product}
            onTransactionSuccess={fetchProducts}
          />
        ))}

        {canAddProduct && (
          <button
            className="add-product-btn"
            onClick={() => setShowCreateModal(true)}
          >
            +
          </button>
        )}
      </div>

      {showCreateModal && (
        <CreateProductModal
          clientId={clientId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchProducts}
        />
      )}
    </>
  )
}

export default ProductHolder