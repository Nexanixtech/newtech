// components/AdminNavbar.tsx
import React from "react"
import { Link } from "react-router-dom"

export default function AdminNavbar() {
  return (
    <nav className="w-64 bg-white shadow-md flex flex-col p-4">
      <h1 className="text-xl font-bold mb-6 text-center">Admin Dashboard</h1>
      <Link className="mb-2 text-blue-600 hover:underline" to="/dashboard">Dashboard</Link>
      <Link className="mb-2 text-blue-600 hover:underline" to="/manage-home">Manage Home</Link>
      <Link className="mb-2 text-blue-600 hover:underline" to="/manage-products">Manage Products</Link>
      <Link className="mb-2 text-blue-600 hover:underline" to="/manage-categories">Manage Categories</Link>
      <Link className="mb-2 text-blue-600 hover:underline" to="/manage-logos">Manage Logos</Link>
      <Link className="mt-auto text-red-500 hover:underline" to="/logout">Logout</Link>
    </nav>
  )
}
