import React, { useState } from 'react'
import './CreateClientModal.css'
import { API_URL } from '../../../config'

const IDENTIFICATION_TYPES = [
  { value: 'CEDULA_CIUDADANIA', label: 'Cédula de Ciudadanía' },
  { value: 'CEDULA_EXTRANJERIA', label: 'Cédula de Extranjería' },
  { value: 'PASAPORTE', label: 'Pasaporte' }
]

const MAX_ID_DIGITS = 12
const MIN_AGE = 18

const calculateAge = (birthDateStr) => {
  const birthDate = new Date(birthDateStr)
  const today = new Date()

  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--
  }

  return age
}

function CreateClientModal({ onClose, onSuccess }) {
  const [identificationType, setIdentificationType] = useState('CEDULA_CIUDADANIA')
  const [identificationNumber, setIdentificationNumber] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleIdentificationNumberChange = (e) => {
    const onlyDigits = e.target.value.replace(/\D/g, '')
    setIdentificationNumber(onlyDigits.slice(0, MAX_ID_DIGITS))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!firstname.trim() || !lastName.trim()) {
      setError('Nombre y apellido son obligatorios')
      return
    }

    if (!identificationNumber) {
      setError('El número de identificación es obligatorio')
      return
    }

    if (identificationNumber.length > MAX_ID_DIGITS) {
      setError(`El número de identificación no puede tener más de ${MAX_ID_DIGITS} dígitos`)
      return
    }

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Ingresa un correo electrónico válido')
      return
    }

    if (!birthDate) {
      setError('La fecha de nacimiento es obligatoria')
      return
    }

    if (calculateAge(birthDate) < MIN_AGE) {
      setError(`El cliente debe ser mayor de ${MIN_AGE} años`)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${API_URL}/api/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identificationType: identificationType,
          identificationNumber: identificationNumber,
          firstname: firstname.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          birthDate: birthDate
        })
      })

      if (!response.ok) {
        throw new Error('No se pudo crear el cliente')
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
          <h3>Nuevo cliente</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <label htmlFor="identification-type">Tipo de identificación</label>
          <select
            id="identification-type"
            value={identificationType}
            onChange={(e) => setIdentificationType(e.target.value)}
          >
            {IDENTIFICATION_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          <label htmlFor="identification-number">Número de identificación</label>
          <input
            id="identification-number"
            type="text"
            inputMode="numeric"
            value={identificationNumber}
            onChange={handleIdentificationNumberChange}
            placeholder="Máximo 12 dígitos"
            maxLength={MAX_ID_DIGITS}
          />

          <label htmlFor="firstname">Nombre</label>
          <input
            id="firstname"
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            placeholder="Nombre"
          />

          <label htmlFor="lastname">Apellido</label>
          <input
            id="lastname"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Apellido"
          />

          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
          />

          <label htmlFor="birth-date">Fecha de nacimiento</label>
          <input
            id="birth-date"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />

          {error && <div className="modal-error">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="modal-btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="modal-btn-primary" disabled={loading}>
              {loading ? 'Creando...' : 'Crear cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateClientModal