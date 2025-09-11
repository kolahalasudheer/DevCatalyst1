import React, { useEffect, useState } from 'react'

type Photo = {
  src: string;
  alt: string;
  w?: number;
  h?: number;
};

const fallback: Photo[] = [
  { src: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop', alt: 'Hackathon crowd' },
  { src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop', alt: 'Workshop session' },
  { src: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop', alt: 'Team collaboration' },
  { src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop', alt: 'Speaker on stage' },
  { src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop', alt: 'Coding session' },
  { src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop', alt: 'Developers at laptops' },
]

const Gallery = () => {
  const [active, setActive] = useState(null as Photo | null)
  const [photos, setPhotos] = useState(fallback as Photo[])

  useEffect(() => {
    let cancelled = false
    fetch('/data/gallery.json', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : Promise.reject(new Error('Failed')))
      .then((json: Photo[]) => { if (!cancelled) setPhotos(json) })
      .catch(() => { /* keep fallback */ })
    return () => { cancelled = true }
  }, [])

  return (
    <section id="gallery" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Gallery</h1>
          <p className="text-gray-400 max-w-3xl">Snapshots from our hackathons, workshops, and community events.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {photos.map((p, idx) => (
            <button
              key={idx}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-white/5"
              onClick={() => setActive(p)}
            >
              <img src={p.src} alt={p.alt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setActive(null)}>
          <div className="max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            <img src={active.src} alt={active.alt} className="w-full h-auto rounded-xl" />
            <div className="mt-3 flex justify-between items-center">
              <p className="text-gray-300">{active.alt}</p>
              <button className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white hover:bg-white/15" onClick={() => setActive(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Gallery

