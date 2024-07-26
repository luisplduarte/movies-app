import React from 'react'
import { Link } from "react-router-dom"

function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1>Welcome to the home page!</h1>
      <Link to="/profile">Go to profile page</Link>
    </div>
  )
}

export default Home;