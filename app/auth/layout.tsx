// import React from 'react'
// import Link from 'next/link'

// export default function AuthLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
//       <div style={{ width: 420, padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.08)' }}>
//         <nav style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
//           <Link href="/login">Login</Link>
//           <Link href="/register">Register</Link>
//         </nav>
//         <div>{children}</div>
//       </div>
//     </div>
//   )
// }
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
