import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

type Category = 'Hackathons' | 'Workshops' | 'Tech Talks' | 'Seminars' | 'Other'

type EventItem = {
  slug: string
  title: string
  date: string
  time?: string
  location?: string
  description: string
  cta: string
  image?: string
  category: Category
  rules?: string[]
  agenda?: { time: string; item: string }[]
  highlights?: string[]
  registrationUrl?: string
  recapUrl?: string
  guests?: { name: string; designation?: string }[]
  summary?: string
  photos?: string[]
  organizers?: string[]
  sponsors?: string[]
  resources?: { label: string; url: string }[]
  outcomes?: string[]
  hashtags?: string[]
}

type EventsData = { upcoming: EventItem[]; past: EventItem[] }

const EventDetail = () => {
  const { slug = '' } = useParams<{ slug: string }>()
  const [event, setEvent] = useState<EventItem | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [all, setAll] = useState<EventItem[]>([])
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  // No orientation boxes needed when using masonry layout

  const fetchData = async () => {
    try {
      const res = await fetch('/data/events.json', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed')
      const data: EventsData = await res.json()
      const combined = [...data.upcoming, ...data.past]
      setAll(combined)
      const found = combined.find(e => e.slug === slug)
      if (!found) { setNotFound(true); return }
      setEvent(found)
    } catch {
      setNotFound(true)
    }
  }

  useEffect(() => { fetchData() }, [slug])

  const isPast = useMemo(() => {
    if (!event) return false
    const toISO = (d: string) => (d.includes('-') && d.split('-')[0].length === 4) ? d : d.split('-').reverse().join('-')
    const today = new Date().toISOString().slice(0,10)
    return toISO(event.date) < today
  }, [event])

  const related = useMemo(() => {
    if (!event) return [] as EventItem[]
    const sameCategory = all.filter(e => e.slug !== event.slug && e.category === event.category)
    const others = all.filter(e => e.slug !== event.slug && e.category !== event.category)
    return [...sameCategory, ...others].slice(0, 3)
  }, [all, event])

  if (notFound) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Event not found</h1>
          <p className="text-gray-400 mb-6">The event you are looking for doesn’t exist or has been removed.</p>
          <Link to="/events" className="px-6 py-3 rounded-full bg-white/10 border border-white/10">Back to Events</Link>
        </div>
      </section>
    )
  }

  if (!event) return null

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link to="/events" className="text-[#00d4ff] hover:underline">← All events</Link>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          {event.image && (
            <div className="w-full bg-black/20 flex items-center justify-center p-2">
              <img
                src={(() => { const src = event.image as string; return (src.startsWith('http://') || src.startsWith('https://')) ? src : encodeURI(src) })()}
                alt={event.title}
                className="max-h-[60vh] w-auto object-contain rounded-md cursor-zoom-in"
                loading="lazy"
                onClick={() => { const src = event.image as string; setLightboxSrc((src.startsWith('http://') || src.startsWith('https://')) ? src : encodeURI(src)) }}
              />
            </div>
          )}
          <div className="p-6 md:p-8">
            <div className="text-sm text-[#00d4ff] mb-2">{event.date}{event.time ? ` • ${event.time}` : ''}{event.location ? ` • ${event.location}` : ''}</div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{event.title}</h1>
            <p className="text-gray-300 leading-relaxed mb-6">{event.description}</p>

            {isPast && event.summary && (
              <div className="mb-6">
                <h2 className="text-white text-xl font-semibold mb-2">Recap</h2>
                <p className="text-gray-300 leading-relaxed">{event.summary}</p>
              </div>
            )}

            {event.guests && event.guests.length > 0 && (
              <div className="mb-6">
                <h2 className="text-white text-xl font-semibold mb-2">Guests</h2>
                <ul className="text-gray-300 space-y-1">
                  {event.guests.map((g, i) => (
                    <li key={i}><span className="text-white">{g.name}</span>{g.designation ? ` — ${g.designation}` : ''}</li>
                  ))}
                </ul>
              </div>
            )}

            {event.rules && event.rules.length > 0 && (
              <div className="mb-6">
                <h2 className="text-white text-xl font-semibold mb-2">Rules</h2>
                <ul className="list-disc pl-5 text-gray-300 space-y-1">
                  {event.rules.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}

            {event.agenda && event.agenda.length > 0 && (
              <div className="mb-6">
                <h2 className="text-white text-xl font-semibold mb-2">Agenda</h2>
                <ul className="text-gray-300 space-y-1">
                  {event.agenda.map((a, i) => (
                    <li key={i} className="flex gap-3"><span className="text-gray-400 w-28">{a.time}</span><span>{a.item}</span></li>
                  ))}
                </ul>
              </div>
            )}

            {event.highlights && event.highlights.length > 0 && (
              <div className="mb-6">
                <h2 className="text-white text-xl font-semibold mb-2">Highlights</h2>
                <ul className="list-disc pl-5 text-gray-300 space-y-1">
                  {event.highlights.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </div>
            )}

            {event.photos && event.photos.length > 0 && (
              <div className="mt-8">
                <h2 className="text-white text-xl font-semibold mb-3">Photos</h2>
                <div className="columns-1 sm:columns-2 md:columns-3 gap-4 [column-gap:1rem]">
                  {event.photos.map((p, i) => (
                    <div key={i} className="mb-4 break-inside-avoid overflow-hidden rounded-xl border border-white/10 bg-black/20">
                      <img
                        src={(p.startsWith('http://') || p.startsWith('https://')) ? p : encodeURI(p)}
                        alt={`${event.title} photo ${i+1}`}
                        className="w-full h-auto object-contain cursor-zoom-in"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement
                          target.onerror = null
                          target.src = 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop'
                        }}
                        onClick={() => setLightboxSrc((p.startsWith('http://') || p.startsWith('https://')) ? p : encodeURI(p))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {event.organizers && event.organizers.length > 0 && (
              <div className="mt-8">
                <h2 className="text-white text-xl font-semibold mb-2">Organizers</h2>
                <div className="flex flex-wrap gap-2">
                  {event.organizers.map((o, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">{o}</span>
                  ))}
                </div>
              </div>
            )}

            {event.sponsors && event.sponsors.length > 0 && (
              <div className="mt-6">
                <h2 className="text-white text-xl font-semibold mb-2">Sponsors</h2>
                <div className="flex flex-wrap gap-2">
                  {event.sponsors.map((s, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {event.outcomes && event.outcomes.length > 0 && (
              <div className="mt-6">
                <h2 className="text-white text-xl font-semibold mb-2">Outcomes</h2>
                <ul className="list-disc pl-5 text-gray-300 space-y-1">
                  {event.outcomes.map((o, i) => <li key={i}>{o}</li>)}
                </ul>
              </div>
            )}

            {event.resources && event.resources.length > 0 && (
              <div className="mt-6">
                <h2 className="text-white text-xl font-semibold mb-2">Resources</h2>
                <ul className="text-gray-300 space-y-1">
                  {event.resources.map((r, i) => (
                    <li key={i}><a className="text-[#00d4ff] hover:underline" href={r.url} target="_blank" rel="noreferrer">{r.label}</a></li>
                  ))}
                </ul>
              </div>
            )}

            {event.hashtags && event.hashtags.length > 0 && (
              <div className="mt-6">
                <h2 className="text-white text-xl font-semibold mb-2">Hashtags</h2>
                <div className="flex flex-wrap gap-2">
                  {event.hashtags.map((h, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">{h}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {!isPast && (
                <a href={event.registrationUrl || '/#contact'} className="px-6 py-3 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] text-white font-semibold">Register</a>
              )}
              {isPast && event.recapUrl && (
                <a href={event.recapUrl} className="px-6 py-3 rounded-full bg-white/10 border border-white/10 text-white">View Recap</a>
              )}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">Related Events</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map(e => (
                <Link key={e.slug} to={`/events/${e.slug}`} className="block bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:-translate-y-1 transition-transform">
                  <div className="h-28 w-full bg-center bg-cover" style={{ backgroundImage: e.image ? `url("${e.image}")` : undefined }} />
                  <div className="p-4">
                    <div className="text-xs text-[#00d4ff] mb-1">{e.date}</div>
                    <div className="text-white font-semibold">{e.title}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {lightboxSrc && (
        <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setLightboxSrc(null)}>
          <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end mb-2">
              <button className="px-3 py-2 rounded-md bg-white/10 border border-white/10 text-white hover:bg-white/15" onClick={() => setLightboxSrc(null)}>Close</button>
            </div>
            <img src={lightboxSrc} alt="Event photo" className="w-full h-auto rounded-xl" />
          </div>
        </div>
      )}
    </section>
  )
}

export default EventDetail
