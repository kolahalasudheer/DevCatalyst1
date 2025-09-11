import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'

const Navbar = () => {
  const [open, setOpen] = useState(false)
  return (
    <nav className="fixed top-0 w-full bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 py-4 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] bg-clip-text text-transparent">
          Dev Catalyst
        </Link>
        <button className="md:hidden text-white px-3 py-2 rounded border border-white/10 hover:bg-white/10 transition-colors touch-manipulation" aria-label="Toggle menu" onClick={() => setOpen(v=>!v)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <ul className="hidden md:flex gap-8">
          <li><NavLink to="/" className="text-white hover:text-[#00d4ff] transition-colors relative group">
            Home
            <span className="absolute bottom-[-5px] left-0 w-0 h-0.5 bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] transition-all duration-300 group-hover:w-full"></span>
          </NavLink></li>
          <li><NavLink to="/about" className="text-white hover:text-[#00d4ff] transition-colors relative group">
            About
            <span className="absolute bottom-[-5px] left-0 w-0 h-0.5 bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] transition-all duration-300 group-hover:w-full"></span>
          </NavLink></li>
          <li><NavLink to="/events" className="text-white hover:text-[#00d4ff] transition-colors relative group">
            Events
            <span className="absolute bottom-[-5px] left-0 w-0 h-0.5 bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] transition-all duration-300 group-hover:w-full"></span>
          </NavLink></li>
          <li><NavLink to="/gallery" className="text-white hover:text-[#00d4ff] transition-colors relative group">
            Gallery
            <span className="absolute bottom-[-5px] left-0 w-0 h-0.5 bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] transition-all duration-300 group-hover:w-full"></span>
          </NavLink></li>
          <li><NavLink to="/resources" className="text-white hover:text-[#00d4ff] transition-colors relative group">
            Resources
            <span className="absolute bottom-[-5px] left-0 w-0 h-0.5 bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] transition-all duration-300 group-hover:w-full"></span>
          </NavLink></li>
          <li><a href="/#contact" className="text-white hover:text-[#00d4ff] transition-colors relative group">
            Contact
            <span className="absolute bottom-[-5px] left-0 w-0 h-0.5 bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] transition-all duration-300 group-hover:w-full"></span>
          </a></li>
          <li>
            <Link to="/join" className="ml-4 px-4 py-2 rounded-md bg-white/10 border border-white/10 text-white hover:bg-white/15 transition-colors">
              Join Us
            </Link>
          </li>
        </ul>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#0a0a0a]/98 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
            <NavLink to="/" onClick={() => setOpen(false)} className="block text-white py-3 px-4 rounded-lg hover:bg-white/10 transition-colors touch-manipulation">Home</NavLink>
            <NavLink to="/about" onClick={() => setOpen(false)} className="block text-white py-3 px-4 rounded-lg hover:bg-white/10 transition-colors touch-manipulation">About</NavLink>
            <NavLink to="/events" onClick={() => setOpen(false)} className="block text-white py-3 px-4 rounded-lg hover:bg-white/10 transition-colors touch-manipulation">Events</NavLink>
            <NavLink to="/gallery" onClick={() => setOpen(false)} className="block text-white py-3 px-4 rounded-lg hover:bg-white/10 transition-colors touch-manipulation">Gallery</NavLink>
            <NavLink to="/resources" onClick={() => setOpen(false)} className="block text-white py-3 px-4 rounded-lg hover:bg-white/10 transition-colors touch-manipulation">Resources</NavLink>
            <a href="/#contact" onClick={() => setOpen(false)} className="block text-white py-3 px-4 rounded-lg hover:bg-white/10 transition-colors touch-manipulation">Contact</a>
            <Link to="/join" onClick={() => setOpen(false)} className="block text-white py-3 px-4 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] text-center font-semibold touch-manipulation">Join Us</Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar