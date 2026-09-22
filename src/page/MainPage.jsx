import React, { useState, useEffect } from 'react'
import './MainPage.css'
import ClientDropDownMenu from '../dropDownMenu/ClientDropDownMenu'
import ProductHolder from '../products/ProductHolder'
import { API_URL } from '../../config'

const MainPage = () => {
  const [loading, setLoading] = useState(true)
  const [connectionError, setConnectionError] = useState(false)
  const [clients, setClients] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)
  const [openClientMenu, setOpenClientMenu] = useState(false)

  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const fetchData = async (page) => {
    try {
      setLoading(true)
      setConnectionError(false)

      const response = await fetch(
        `${API_URL}/api/clients?page=${page}&size=5`
      )

      if (!response.ok) {
        throw new Error('Error al conectar con la API')
      }

      const data = await response.json()

      setClients(data.content)
      setCurrentPage(data.number)
      setTotalPages(data.totalPages)

      if (data.content.length > 0 && selectedClient === null) {
        setSelectedClient(data.content[0])
      }

    } catch (error) {
      setConnectionError(true)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(currentPage)
  }, [currentPage])

  if (loading) {
    return <div className="main-page">Cargando clientes...</div>
  }

  if (connectionError) {
    return <div className="main-page">Error al conectar con la API</div>
  }

  return (
    <main className="main-page">

      <div className="client-selector">

        <button
          className="selected-client"
          onClick={() => setOpenClientMenu(!openClientMenu)}
        >
          <span>
            {selectedClient
              ? `${selectedClient.firstname} ${selectedClient.lastName}`
              : 'Seleccionar cliente'}
          </span>

          <span>⌄</span>
        </button>

        {openClientMenu && (
          <ClientDropDownMenu
            clients={clients}
            selectedClient={selectedClient}
            setSelectedClient={setSelectedClient}
            setOpenClientMenu={setOpenClientMenu}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}

      </div>

      <ProductHolder clientId={selectedClient?.id} />

    </main>
  )
}

export default MainPage