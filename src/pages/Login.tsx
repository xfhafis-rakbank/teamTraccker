import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sanity } from '../sanityClient'
import { motion } from 'framer-motion'

export default function Login() {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    setLoading(true)
    try {
      const result = await sanity.fetch(
        `*[_type == "user" && username == $username][0]`,
        { username }
      )
      if (result) {
        const isAdmin = result.role === 'admin'
        if (isAdmin) {
          navigate('/admin', { state: { username, isAdmin } })
        } else {
          navigate('/dashboard', { state: { username, isAdmin } })
        }
      } else {
        setError('Invalid username')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <motion.div
        className="bg-white shadow-xl p-8 rounded-xl max-w-md w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-indigo-700">
          Team Activity Login
        </h1>
        <input
          type="text"
          value={username}
          placeholder="Enter your username"
          onChange={e => setUsername(e.target.value)}
          className="w-full border rounded px-4 py-2 mb-4"
        />
        <button
          onClick={handleLogin}
          disabled={loading || username.trim() === ''}
          className={`w-full flex items-center justify-center bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          ) : (
            'Login'
          )}
        </button>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </motion.div>
    </div>
  )
}
