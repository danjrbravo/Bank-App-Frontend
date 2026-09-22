import React, { useState, useEffect } from 'react'
import './MainPage.css'
import ClientDropDownMenu from '../dropDownMenu/ClientDropDownMenu'
import ProductHolder from '../products/ProductHolder'
import CreateClientModal from './modals/CreateClientModal'
import { API_URL } from '../../config'

const MainPage = () => {
  const [loading, setLoading] = useState(true)
  const [connectionError, setConnectionError] = useState(false)
  const [clients, setClients] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)
  const [openClientMenu, setOpenClientMenu] = useState(false)

  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  const [showCreateClientModal, setShowCreateClientModal] = useState(false)

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

  const handleDeleteClient = async () => {
    if (!selectedClient) return

    const confirmed = window.confirm(
      `¿Estás seguro de eliminar a ${selectedClient.firstname} ${selectedClient.lastName}?`
    )
    if (!confirmed) return

    try {
      setDeleteLoading(true)
      setDeleteError(null)

      const response = await fetch(`${API_URL}/api/clients/${selectedClient.id}`, {
        method: 'DELETE'
      })

      if (response.status === 409) {
        setDeleteError('El cliente tiene productos registrados, no se puede eliminar')
        return
      }

      if (!response.ok) {
        throw new Error('No se pudo eliminar el cliente')
      }

      setSelectedClient(null)
      fetchData(currentPage)

    } catch (err) {
      setDeleteError(err.message)
      console.error(err)
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleCreateClientSuccess = () => {
    fetchData(currentPage)
  }

  if (loading) {
    return <div className="main-page">Cargando clientes...</div>
  }

  if (connectionError) {
    return <div className="main-page">Error al conectar con la API</div>
  }

  return (
    <main className="main-page">

      <div className="client-selector-row">

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

        <button
          className="create-client-btn"
          onClick={() => setShowCreateClientModal(true)}
          title="Crear cliente"
        >
          Crear Cliente
        </button>

        <button
          className="delete-client-btn"
          disabled={!selectedClient || deleteLoading}
          onClick={handleDeleteClient}
          title="Eliminar cliente"
        >
          Eliminar Cliente
        </button>

      </div>

      {deleteError && <div className="delete-client-error">{deleteError}</div>}

      <ProductHolder clientId={selectedClient?.id} />

      {showCreateClientModal && (
        <CreateClientModal
          onClose={() => setShowCreateClientModal(false)}
          onSuccess={handleCreateClientSuccess}
        />
      )}

    </main>
  )
}

export default MainPage