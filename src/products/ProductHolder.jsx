import React, { useState, useEffect } from 'react'
import './ProductHolder.css'
import Product from './Product'
import { API_URL } from '../../config'

function ProductHolder({ clientId }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!clientId) {
      setProducts([])
      return
    }

    const fetchProducts = async () => {
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
    }

    fetchProducts()
  }, [clientId])

  const handleGetProduct = () => {
    // Se implementará más adelante
  }

  if (loading) {
    return <div className="product-holder-message">Cargando productos...</div>
  }

  if (error) {
    return <div className="product-holder-message">Error al obtener los productos</div>
  }

  if (products.length === 0) {
    return (
      <div className="product-holder-empty">
        <p>Este cliente no tiene productos</p>
        <button className="get-product-btn" onClick={handleGetProduct}>
          Obtener producto
        </button>
      </div>
    )
  }

  return (
    <div className="product-holder">
      {products.map(product => (
        <Product key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductHolder