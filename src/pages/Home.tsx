import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

type UpcomingEvent = { slug: string; title: string; date: string; time?: string }
type ActiveEventState = { slug: string; title: string; date: Date } | null
type TimeLeft = { days: number; hours: number; minutes: number; seconds: number }
type Filter = 'All' | 'Month' | 'Hackathons' | 'Open Source'

type BoardUser = { name: string; role: string; points: number; tag: Filter }

type HighlightItem = {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  category: 'event' | 'achievement' | 'announcement' | 'workshop';
  link?: string;
}

const Home = () => {
  const [events, setEvents] = useState([] as UpcomingEvent[])
  const [activeEvent, setActiveEvent] = useState(null as ActiveEventState)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 } as TimeLeft)
  const [highlights, setHighlights] = useState([] as HighlightItem[])
  const [currentHighlight, setCurrentHighlight] = useState(0)
  const canvasRef = useRef(null as HTMLCanvasElement | null)

  // Sample highlights data - replace with your actual data source
  const sampleHighlights: HighlightItem[] = [
    {
      id: 1,
      title: "Winter Hackathon 2025 Success!",
      description: "120+ participants built amazing projects over 48 hours. Congratulations to all winners!",
      image: "/gallery/2025-hackathon-1.svg",
      date: "Jan 15, 2025",
      category: "event",
      link: "/events/winter-hackathon-2025"
    },
    {
      id: 2,
      title: "New AI/ML Workshop Series",
      description: "Join our comprehensive AI/ML bootcamp starting February. Limited seats available!",
      image: "/gallery/2025-workshop-ai.svg",
      date: "Jan 20, 2025",
      category: "announcement",
      link: "/events/ai-ml-bootcamp"
    },
    {
      id: 3,
      title: "Community Reaches 500+ Members",
      description: "Dev Catalyst community has grown to over 500 active members across all platforms!",
      image: "/gallery/community-milestone.svg",
      date: "Jan 10, 2025",
      category: "achievement"
    },
    {
      id: 4,
      title: "Guest Speaker: Industry Expert",
      description: "Don't miss our upcoming tech talk with a senior engineer from a top tech company.",
      image: "/gallery/tech-talk-guest.svg",
      date: "Jan 25, 2025",
      category: "workshop",
      link: "/events/tech-talk-industry-expert"
    }
  ]

  // Highlights carousel effect
  useEffect(() => {
    setHighlights(sampleHighlights)
    const interval = setInterval(() => {
      setCurrentHighlight((prev: number) => (prev + 1) % sampleHighlights.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Fetch events and set active event (run once)
  useEffect(() => {
    const parseStartTime = (time?: string): string | null => {
      if (!time) return null
      const match = time.match(/(\d{1,2}:\d{2}\s?(AM|PM))/i)
      return match ? match[1] : null
    }
    const toDate = (dateStr: string, timeStr?: string): Date => {
      const base = dateStr
      const startToken = parseStartTime(timeStr) || '09:00 AM'
      const [y, m, d] = base.split('-').map(Number)
      let [hhmm, ampm] = startToken.split(' ')
      let [hh, mm] = hhmm.split(':').map(Number)
      if ((ampm || '').toUpperCase() === 'PM' && hh < 12) hh += 12
      if ((ampm || '').toUpperCase() === 'AM' && hh === 12) hh = 0
      const dt = new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0)
      return dt
    }
    const pickNextEvent = (list: UpcomingEvent[]) => {
      const now = new Date()
      const upcoming = list
        .map((e: UpcomingEvent) => ({ slug: e.slug, title: e.title, date: toDate(e.date, e.time) }))
        .filter((e: { slug: string; title: string; date: Date }) => e.date.getTime() > now.getTime())
        .sort((a: { date: Date }, b: { date: Date }) => a.date.getTime() - b.date.getTime())
      return upcoming[0] || null
    }
    fetch('/data/events.json', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : Promise.reject(new Error('Failed')))
      .then(json => {
        const list = Array.isArray(json?.upcoming) ? json.upcoming as UpcomingEvent[] : []
        setEvents(list)
        const next = pickNextEvent(list)
        setActiveEvent(next)
      })
      .catch(() => {
        // keep defaults if fetch fails
      })
  }, [])

  // Stats animation (run once)
  useEffect(() => {
    const animateCounters = () => {
      const counters = Array.from(document.querySelectorAll<HTMLElement>('.stat-number'))
      const timers: number[] = []
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target') || '0')
        const increment = Math.max(1, Math.floor(target / 100))
        let current = 0
        const timer = window.setInterval(() => {
          current += increment
          if (current >= target) {
            counter.textContent = target + '+'
            window.clearInterval(timer)
          } else {
            counter.textContent = Math.floor(current) + '+'
          }
        }, 30)
        timers.push(timer)
      })
      return () => { timers.forEach(t => window.clearInterval(t)) }
    }
    const cleanupCounters = animateCounters()
    return () => {
      cleanupCounters && cleanupCounters()
    }
  }, [])

  // Code rain and constellation animation (run once)
  useEffect(() => {
    const createCodeRain = () => {
      const hero = document.querySelector('.hero-background')
      if (!hero) return
      const tokens = ['function()', 'const', 'let', '=>', '{', '}', 'return', 'import', 'export', 'await', 'async', 'console.log()', 'if', 'for', 'while', '[', ']', 'className', 'useState()', 'useEffect()', 'props', 'map()', 'filter()', 'reduce()', 'true', 'false']
      const created: HTMLElement[] = []
      const columns = Math.floor(window.innerWidth / 40)
      for (let i = 0; i < columns; i++) {
        const rain = document.createElement('div')
        rain.className = 'code-rain'
        rain.style.left = (i / columns) * 100 + '%'
        rain.style.animationDuration = (Math.random() * 4 + 4) + 's'
        rain.style.animationDelay = Math.random() * 5 + 's'
        const length = Math.floor(Math.random() * 8) + 5
        const content = Array.from({ length }, () => tokens[Math.floor(Math.random() * tokens.length)]).join(' ')
        rain.textContent = content
        hero.appendChild(rain)
        created.push(rain)
      }
      return () => { created.forEach(el => el.remove()) }
    }
    const startConstellation = () => {
      const canvas = canvasRef.current
      const container = document.querySelector('.hero-background') as HTMLElement | null
      if (!canvas || !container) return () => {}
      const ctx = canvas.getContext('2d')!
      const resize = () => {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
      }
      resize()
      window.addEventListener('resize', resize)
      const w = () => canvas.width
      const h = () => canvas.height
      const cx = () => w() / 2
      const cy = () => h() / 2
      const basePoints = () => ([
        { x: cx() - 180, y: cy() - 80 },
        { x: cx() - 180, y: cy() + 80 },
        { x: cx() - 140, y: cy() + 110 },
        { x: cx() - 80, y: cy() + 80 },
        { x: cx() - 60, y: cy() + 30 },
        { x: cx() - 60, y: cy() - 30 },
        { x: cx() - 80, y: cy() - 80 },
        { x: cx() - 140, y: cy() - 110 },
        { x: cx() + 120, y: cy() - 100 },
        { x: cx() + 70, y: cy() - 120 },
        { x: cx() + 20, y: cy() - 90 },
        { x: cx() - 10, y: cy() - 40 },
        { x: cx() - 10, y: cy() + 40 },
        { x: cx() + 20, y: cy() + 90 },
        { x: cx() + 70, y: cy() + 120 },
        { x: cx() + 120, y: cy() + 100 },
      ])
      let animationId = 0
      const draw = (time: number) => {
        ctx.clearRect(0, 0, w(), h())
        const pts = basePoints()
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i]
          const twinkle = (Math.sin(time / 600 + i) + 1) / 2
          const r = 1.2 + twinkle * 1.8
          ctx.beginPath()
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(0,212,255,${0.35 + twinkle * 0.35})`
          ctx.shadowColor = 'rgba(0,212,255,0.6)'
          ctx.shadowBlur = 8
          ctx.fill()
        }
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x
            const dy = pts[i].y - pts[j].y
            const dist = Math.hypot(dx, dy)
            if (dist < 160) {
              const alpha = 1 - dist / 160
              ctx.beginPath()
              ctx.moveTo(pts[i].x, pts[j].y)
              ctx.lineTo(pts[j].x, pts[j].y)
              ctx.strokeStyle = `rgba(0,212,255,${0.08 + alpha * 0.12})`
              ctx.lineWidth = 1
              ctx.stroke()
            }
          }
        }
        animationId = requestAnimationFrame(draw)
      }
      animationId = requestAnimationFrame(draw)
      return () => {
        cancelAnimationFrame(animationId)
        window.removeEventListener('resize', resize)
        ctx.clearRect(0, 0, w(), h())
      }
    }
    const cleanupRain = createCodeRain()
    const stopConstellation = startConstellation()
    return () => {
      cleanupRain && cleanupRain()
      stopConstellation && stopConstellation()
    }
  }, [])

  // Countdown timer (depends on activeEvent)
  useEffect(() => {
    if (!activeEvent?.date) return
    let timer = window.setInterval(() => {
      const nowMs = Date.now()
      const targetMs = activeEvent.date.getTime()
      const diff = Math.max(0, targetMs - nowMs)
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeLeft({ days, hours, minutes, seconds })
      if (diff === 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)
    return () => {
      window.clearInterval(timer)
    }
  }, [activeEvent])

  const getCategoryIcon = (category: HighlightItem['category']) => {
    switch (category) {
      case 'event': return '🎉'
      case 'achievement': return '🏆'
      case 'announcement': return '📢'
      case 'workshop': return '💡'
      default: return '⭐'
    }
  }

  const getCategoryColor = (category: HighlightItem['category']) => {
    switch (category) {
      case 'event': return 'from-green-500 to-emerald-600'
      case 'achievement': return 'from-yellow-500 to-orange-600'
      case 'announcement': return 'from-blue-500 to-cyan-600'
      case 'workshop': return 'from-purple-500 to-pink-600'
      default: return 'from-[#00d4ff] to-[#9c40ff]'
    }
  }

  return (
    <>
      <main className="relative bg-[#0a0a0a]">
        <section id="home" className="hero-section min-h-[85vh] sm:min-h-screen flex items-center justify-center text-center relative bg-[#0a0a0a] overflow-hidden">
          <div className="hero-background absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.12)_0%,transparent_70%)]"></div>
            <div className="bg-grid"></div>
            <div className="gradient-conic"></div>
            <div className="sweep-light"></div>
            <canvas ref={canvasRef} className="constellation-canvas"/>
            <div className="bg-noise"></div>
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-white to-[#00d4ff] bg-clip-text text-transparent mb-4 animate-fadeInUp">
              DevCatalyst
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-8 animate-fadeInUp animation-delay-200">
              Fueling the Next Generation of Developers
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-10 md:gap-16 mb-10 animate-fadeInUp animation-delay-400">
              <div className="text-center">
                <div className="stat-number text-2xl sm:text-3xl font-bold text-[#00d4ff]" data-target="500">0</div>
                <div className="text-gray-500">Members</div>
              </div>
              <div className="text-center">
                <div className="stat-number text-2xl sm:text-3xl font-bold text-[#00d4ff]" data-target="15">0</div>
                <div className="text-gray-500">Events</div>
              </div>
              <div className="text-center">
                <div className="stat-number text-2xl sm:text-3xl font-bold text-[#00d4ff]" data-target="25">0</div>
                <div className="text-gray-500">Projects</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fadeInUp animation-delay-600">
              <a 
                href="#about" 
                className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] text-white rounded-full font-semibold text-sm sm:text-base
                  transform hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,212,255,0.3)]
                  active:scale-95 touch-manipulation"
              >
                Explore Our Community
              </a>
              <a
                href="#events"
                className="inline-block px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base border border-white/15 text-white/90 hover:text-white
                  hover:border-[#00d4ff]/50 hover:bg-white/5 transform hover:-translate-y-1 transition-all duration-300 active:scale-95"
              >
                See Upcoming Events
              </a>
            </div>
          </div>
        </section>

        {/* NEW HIGHLIGHTS SECTION */}
        <section className="py-12 sm:py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-[#00d4ff] bg-clip-text text-transparent">
                Community Highlights
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Stay updated with the latest events, achievements, and announcements from our growing developer community.
              </p>
            </div>

            {/* Main Highlight Carousel */}
            <div className="relative mb-12">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                {highlights.length > 0 && (
                  <div className="relative">
                    {/* Main highlight content with Framer Motion animation */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={highlights[currentHighlight]?.id}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        className="grid lg:grid-cols-2 gap-0"
                      >
                        {/* Image section */}
                        <div className="relative h-64 lg:h-80 overflow-hidden">
                          <img 
                            src={highlights[currentHighlight]?.image || '/placeholder.jpg'} 
                            alt={highlights[currentHighlight]?.title}
                            className="w-full h-full object-cover transition-all duration-700 transform hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute top-4 left-4">
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getCategoryColor(highlights[currentHighlight]?.category)} text-white shadow-lg`}>
                              <span>{getCategoryIcon(highlights[currentHighlight]?.category)}</span>
                              {highlights[currentHighlight]?.category.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        {/* Content section */}
                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                          <div className="text-[#00d4ff] text-sm font-semibold mb-2">
                            {highlights[currentHighlight]?.date}
                          </div>
                          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight">
                            {highlights[currentHighlight]?.title}
                          </h3>
                          <p className="text-gray-300 leading-relaxed mb-6 text-base lg:text-lg">
                            {highlights[currentHighlight]?.description}
                          </p>
                          {highlights[currentHighlight]?.link && (
                            <a 
                              href={highlights[currentHighlight]?.link}
                              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] text-white rounded-full font-semibold hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,212,255,0.3)] w-fit"
                            >
                              Learn More
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation arrows */}
                    <button
                      onClick={() => setCurrentHighlight((prev: number) => prev === 0 ? highlights.length - 1 : prev - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300 lg:w-12 lg:h-12"
                      aria-label="Previous highlight"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentHighlight((prev: number) => (prev + 1) % highlights.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300 lg:w-12 lg:h-12"
                      aria-label="Next highlight"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Dots indicator */}
              <div className="flex justify-center gap-3 mt-6">
              {highlights.map((_: HighlightItem, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentHighlight(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentHighlight 
                        ? 'bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] scale-125' 
                        : 'bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Go to highlight ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Countdown */}
        <section className="py-10 sm:py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {activeEvent ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl md:text-3xl font-semibold text-white mb-1">Next: {activeEvent.title}</h3>
                  <p className="text-gray-400">Countdown to the next upcoming event.</p>
                </div>
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-[#00d4ff]">{timeLeft.days}</div>
                    <div className="text-gray-400 text-sm">Days</div>
                  </div>
                  <div className="text-3xl md:text-4xl text-gray-500">:</div>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-[#00d4ff]">{timeLeft.hours}</div>
                    <div className="text-gray-400 text-sm">Hours</div>
                  </div>
                  <div className="text-3xl md:text-4xl text-gray-500">:</div>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-[#00d4ff]">{timeLeft.minutes}</div>
                    <div className="text-gray-400 text-sm">Minutes</div>
                  </div>
                  <div className="text-3xl md:text-4xl text-gray-500">:</div>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-[#00d4ff]">{timeLeft.seconds}</div>
                    <div className="text-gray-400 text-sm">Seconds</div>
                  </div>
                </div>
                <a href={activeEvent ? `/events/${activeEvent.slug}` : '/events'} className="inline-flex px-6 py-3 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] text-white font-semibold hover:-translate-y-0.5 transition-transform">View Details</a>
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10 text-center text-gray-400">No upcoming events yet. Check back soon!</div>
            )}
          </div>
        </section>

        <section id="about" className="py-10 sm:py-14 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-5 sm:mb-7 bg-gradient-to-r from-white to-[#00d4ff] bg-clip-text text-transparent">
              About DevCatalyst
            </h2>
            <p className="max-w-3xl mx-auto text-center text-gray-400 mb-7 sm:mb-9 leading-relaxed text-sm sm:text-base">
              DevCatalyst is a student-led developer community focused on learning-by-building. We bring together curious minds to explore modern technologies, collaborate on real projects, and become industry-ready through practice, mentorship, and events.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#00d4ff]/30 hover:shadow-[0_20px_40px_rgba(0,212,255,0.1)]">
                <h3 className="text-[#00d4ff] text-xl font-semibold mb-4">What We Are</h3>
                <p className="text-gray-400 leading-relaxed">
                  A welcoming space for developers of all levels—beginners to advanced—to learn, experiment, and ship ideas together across web, mobile, AI/ML, and cloud.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#00d4ff]/30 hover:shadow-[0_20px_40px_rgba(0,212,255,0.1)]">
                <h3 className="text-[#00d4ff] text-xl font-semibold mb-4">Why Join</h3>
                <ul className="text-gray-400 leading-relaxed list-disc pl-5 space-y-2">
                  <li>Hands-on workshops and guided learning paths</li>
                  <li>Real project experience for your portfolio</li>
                  <li>Mentorship from peers, seniors, and industry guests</li>
                  <li>Networking, internships, and referral opportunities</li>
                  <li>Teamwork, leadership, and public speaking practice</li>
                </ul>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#00d4ff]/30 hover:shadow-[0_20px_40px_rgba(0,212,255,0.1)]">
                <h3 className="text-[#00d4ff] text-xl font-semibold mb-4">Activities</h3>
                <ul className="text-gray-400 leading-relaxed list-disc pl-5 space-y-2">
                  <li>Weekly workshops and code-alongs</li>
                  <li>Hackathons, coding challenges, and demo days</li>
                  <li>Speaker sessions and tech talks</li>
                  <li>Open-source sprints and study groups</li>
                  <li>Community projects with real users</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Teams Preview */}
        <section id="team" className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-white to-[#00d4ff] bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-[#00d4ff]/30">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] flex items-center justify-center text-2xl font-bold text-white">
                  D
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">Divyansh Teja Edla</h3>
                <p className="text-[#00d4ff] text-sm">President</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-[#00d4ff]/30">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] flex items-center justify-center text-2xl font-bold text-white">
                  DG
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">Dhruv Gannaram</h3>
                <p className="text-[#00d4ff] text-sm">Vice President</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-[#00d4ff]/30">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] flex items-center justify-center text-2xl font-bold text-white">
                  P
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">Parimitha</h3>
                <p className="text-[#00d4ff] text-sm">Event Planner</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-[#00d4ff]/30">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] flex items-center justify-center text-2xl font-bold text-white">
                  HK
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">Hemaditya Kalakota</h3>
                <p className="text-[#00d4ff] text-sm">Technical Lead</p>
              </div>
            </div>
          </div>
        </section>

        {/* Community CTA */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-2">Join our community</h3>
                <p className="text-gray-400">Connect to us on our Socials.</p>
              </div>
              <div className="flex gap-3">
                <a href="https://beacons.ai/devcatalyst" target="_blank" rel="noreferrer" className="px-5 py-3 rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/15">Join Social</a>
              </div>
            </div>
          </div>
        </section>
        
        {/* Getting Started Steps */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 bg-gradient-to-r from-white to-[#00d4ff] bg-clip-text text-transparent">
              Get Started in 3 Steps
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { step: '01', title: 'Join the Community', desc: 'Hop into Discord/WhatsApp for updates and support.' },
                { step: '02', title: 'Attend a Workshop', desc: 'Pick a beginner-friendly session this month.' },
                { step: '03', title: 'Build a Project', desc: 'Team up and ship something real for your portfolio.' },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:-translate-y-2 transition-all">
                  <div className="text-[#00d4ff] font-semibold mb-2">{s.step}</div>
                  <h3 className="text-white text-lg font-semibold mb-2">{s.title}</h3>
                  <p className="text-gray-400">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="events" className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-white to-[#00d4ff] bg-clip-text text-transparent">
              Upcoming Events
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden">
                <div className="absolute top-0 -left-full w-full h-[2px] bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] transition-all duration-500 group-hover:left-0"></div>
                <div className="text-[#00d4ff] text-sm font-semibold mb-2">Dec 15, 2025</div>
                <h3 className="text-white text-xl font-semibold mb-4">React.js Workshop</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Learn the fundamentals of React.js and build your first interactive web application. Perfect for beginners!
                </p>
                <button className="bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] text-white px-6 py-2 rounded-full hover:scale-105 transition-transform duration-300">
                  Register Now
                </button>
              </div>
              
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden">
                <div className="absolute top-0 -left-full w-full h-[2px] bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] transition-all duration-500 group-hover:left-0"></div>
                <div className="text-[#00d4ff] text-sm font-semibold mb-2">Dec 20, 2025</div>
                <h3 className="text-white text-xl font-semibold mb-4">Winter Hackathon 2025</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  48-hour coding marathon! Team up with fellow developers and build innovative solutions for real-world problems.
                </p>
                <button className="bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] text-white px-6 py-2 rounded-full hover:scale-105 transition-transform duration-300">
                  Join Hackathon
                </button>
              </div>
              
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden">
                <div className="absolute top-0 -left-full w-full h-[2px] bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] transition-all duration-500 group-hover:left-0"></div>
                <div className="text-[#00d4ff] text-sm font-semibold mb-2">Jan 5, 2026</div>
                <h3 className="text-white text-xl font-semibold mb-4">AI/ML Bootcamp</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Dive into the world of Artificial Intelligence and Machine Learning with hands-on projects and industry experts.
                </p>
                <button className="bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] text-white px-6 py-2 rounded-full hover:scale-105 transition-transform duration-300">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </section>
        

        {/* Newsletter
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-[#00d4ff] bg-clip-text text-transparent">Subscribe to our Newsletter</h2>
            <p className="text-gray-400 mb-8">Get event announcements, learning resources, and community highlights in your inbox.</p>
            <form className="flex flex-col sm:flex-row gap-3 justify-center">
              <input type="email" required placeholder="you@example.com" className="w-full sm:w-auto min-w-[260px] px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00d4ff]" />
              <button type="submit" className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] text-white font-semibold">Subscribe</button>
            </form>
          </div>
        </section>*/}
        
        <section id="contact" className="py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-white to-[#00d4ff] bg-clip-text text-transparent">
              Get In Touch
            </h2>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <form className="space-y-6">
                <div className="form-group">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white 
                      focus:outline-none focus:border-[#00d4ff] focus:shadow-[0_0_20px_rgba(0,212,255,0.1)]
                      transition-all duration-300"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white 
                      focus:outline-none focus:border-[#00d4ff] focus:shadow-[0_0_20px_rgba(0,212,255,0.1)]
                      transition-all duration-300"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white 
                      focus:outline-none focus:border-[#00d4ff] focus:shadow-[0_0_20px_rgba(0,212,255,0.1)]
                      transition-all duration-300"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] text-white rounded-full 
                    font-semibold hover:-translate-y-1 transition-all duration-300 
                    hover:shadow-[0_10px_30px_rgba(0,212,255,0.3)]"
                >
                  Send Message
                </button>
              </form>
              <div className="mt-8 grid md:grid-cols-3 gap-6 text-gray-300">
                <div>
                  <h3 className="text-white font-semibold mb-2">Email</h3>
                  <a href="mailto:devcatalyst.2025@gmail.com" className="text-[#00d4ff]">devcatalyst.2025@gmail.com</a>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Social</h3>
                  <div className="flex gap-4">
                    <a href="https://www.instagram.com/devcatalystt?igsh=MTI4czBuMm1jamlkcg==" target="_blank" rel="noreferrer" className="hover:text-[#00d4ff]">Instagram</a>
                    <a href="https://x.com/dev_catalyst25?fbclid=PAVERDUAMveQZleHRuA2FlbQIxMAABp7ijhHXWgrfCm7EpuHhJRo1egPR2sGXTKjEuoE6lbBemaCi5pWNDXW_yOl68_aem_HgJ_UgCBOzKrRVSR4qd-1A" target="_blank" rel="noreferrer" className="hover:text-[#00d4ff]">Twitter (X)</a>
                    <a href="https://www.linkedin.com/company/devcatalystt?fbclid=PAVERDUAMveQZleHRuA2FlbQIxMAABp7ijhHXWgrfCm7EpuHhJRo1egPR2sGXTKjEuoE6lbBemaCi5pWNDXW_yOl68_aem_HgJ_UgCBOzKrRVSR4qd-1A" target="_blank" rel="noreferrer" className="hover:text-[#00d4ff]">LinkedIn</a>
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Location</h3>
                  <a href="https://maps.app.goo.gl/DAw396N9adcF5dHu7" target="_blank" rel="noreferrer" className="hover:text-[#00d4ff]">Matrusri Engineering College</a>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* === NEW FOOTER COMPONENT GOES HERE === */}
        <Footer />

      </main>
    </>
  )
}

// === NEW FOOTER COMPONENT DEFINITION ===
const Footer = () => {
  return (
    <footer className="bg-[#0f0f0f] border-t border-white/10 text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top section: Logo, links grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-8 mb-12">
          {/* Column 1 & 2: Logo and Address */}
          <div className="col-span-2 md:col-span-6 lg:col-span-4">
            <a href="#home" className="text-2xl font-bold bg-gradient-to-r from-white to-[#00d4ff] bg-clip-text text-transparent mb-4 inline-block">
              DevCatalyst
            </a>
            <p className="text-sm mb-4">
              <strong>Communications Address:</strong><br />
              Matrusri Engineering College<br />
              Hyderabad, Telangana, 500059
            </p>
            {/* Social Icons */}
            <div className="flex gap-4 mt-6">
              <a href="https://www.linkedin.com/company/devcatalystt" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="https://www.instagram.com/devcatalystt" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/></svg>
              </a>
               <a href="https://x.com/dev_catalyst25" target="_blank" rel="noreferrer" aria-label="Twitter X" className="hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 3: Company */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/about#teams" className="hover:text-white transition-colors">Our Team</a></li>
              <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Column 4: Explore */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <h4 className="font-semibold text-white mb-4">Explore</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/events" className="hover:text-white transition-colors">Events</a></li>
              <li><a href="/workshops" className="hover:text-white transition-colors">Workshops</a></li>
              <li><a href="/projects" className="hover:text-white transition-colors">Projects</a></li>
              <li><a href="/hackathons" className="hover:text-white transition-colors">Hackathons</a></li>
            </ul>
          </div>

          {/* Column 5: Resources */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/resources/roadmaps" className="hover:text-white transition-colors">Roadmaps</a></li>
              <li><a href="/resources/guides" className="hover:text-white transition-colors">Guides</a></li>
              <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          {/* Column 6: Legal */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/legal/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/legal/code-of-conduct" className="hover:text-white transition-colors">Code of Conduct</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom section: Copyright */}
        <div className="border-t border-white/10 pt-8 text-center text-sm">
          <p>&copy; 2025 DevCatalyst. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};


export default Home