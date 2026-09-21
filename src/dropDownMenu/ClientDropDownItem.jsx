import React from 'react'
import './ClientDropDownItem.css'

function ClientDropDownItem({
  client,
  setSelectedClient,
  setOpenClientMenu
}) {
  const handleSelect = () => {
    setSelectedClient(client)
    setOpenClientMenu(false)
  }

  return (
    <div
      className="client-dropdown-item"
      onClick={handleSelect}
    >
      <span>
        {client.firstname} {client.lastName}
      </span>

      <span>
        {client.email}
      </span>
    </div>
  )
}

export default ClientDropDownItem