import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sanity } from '../sanityClient'

export default function Login() {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    const result = await sanity.fetch(
      `*[_type == "user" && username == $username][0]`,
      { username }
    )
    if (result) {
      const isAdmin = result.role === 'admin'
      navigate('/dashboard', { state: { username, isAdmin } })
    } else {
      setError('Invalid username')
    }
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <input
        type="text"
        value={username}
        placeholder="Enter username"
        onChange={e => setUsername(e.target.value)}
        className="border p-2 rounded mb-2"
      />
      <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
        Login
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}
