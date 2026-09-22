import React from 'react'
import './ClientDropDownItem.css'

function ClientDropDownItem({
  client,
  selectedClient,
  setSelectedClient,
  setOpenClientMenu
}) {
  const isSelected = selectedClient?.id === client.id

  const handleSelect = () => {
    setSelectedClient(client)
    setOpenClientMenu(false)
  }

  return (
    <div
      className={`client-dropdown-item ${isSelected ? 'selected' : ''}`}
      onClick={handleSelect}
    >
      <div className="client-info">
        <span className="client-name">
          {client.firstname} {client.lastName}
        </span>

        <span className="client-email">
          {client.email}
        </span>
      </div>

      {isSelected && (
        <span className="selected-icon">✓</span>
      )}
    </div>
  )
}

export default ClientDropDownItem