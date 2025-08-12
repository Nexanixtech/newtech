// components/auth.ts
export function checkAdminSession() {
  // Check if user is authenticated
  const session = localStorage.getItem("adminSession")
  return !!session // Returns true if session exists, false otherwise
}
