import React from 'react'
import ClientDropDownItem from './ClientDropDownItem'
import './ClientDropDownMenu.css'

function ClientDropDownMenu({
  clients,
  setSelectedClient,
  setOpenClientMenu,
  currentPage,
  totalPages,
  setCurrentPage
}) {
  return (
    <div className="client-dropdown">

      <div className="client-list">
        {clients.map(client => (
          <ClientDropDownItem
            key={client.id}
            client={client}
            setSelectedClient={setSelectedClient}
            setOpenClientMenu={setOpenClientMenu}
          />
        ))}
      </div>

      <div className="pagination">

        <button
          disabled={currentPage === 0}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          ←
        </button>

        <span>
          {currentPage + 1} / {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages - 1}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          →
        </button>

      </div>

    </div>
  )
}

export default ClientDropDownMenu