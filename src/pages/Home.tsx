import * as React from 'react'
import { useEffect, useRef, useState } from 'react'

type UpcomingEvent = { slug: string; title: string; date: string; time?: string }
type ActiveEventState = { slug: string; title: string; date: Date } | null
type TimeLeft = { days: number; hours: number; minutes: number; seconds: number }
type Filter = 'All' | 'Month' | 'Hackathons' | 'Open Source'

type BoardUser = { name: string; role: string; points: number; tag: Filter }

const Home = () => {
  const [events, setEvents] = useState([] as UpcomingEvent[])
  const [activeEvent, setActiveEvent] = useState(null as ActiveEventState)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 } as TimeLeft)
  const canvasRef = useRef(null as HTMLCanvasElement | null)

  useEffect(() => {
    const parseStartTime = (time?: string): string | null => {
      if (!time) return null
      const match = time.match(/(\d{1,2}:\d{2}\s?(AM|PM))/i)
      return match ? match[1] : null
    }

    const toDate = (dateStr: string, timeStr?: string): Date => {
      const base = dateStr
      const startToken = parseStartTime(timeStr) || '09:00 AM'
      // Ensure consistent parsing across browsers by constructing ISO-like string
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

    // Fetch events once
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
    // Animated counter for stats
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

    // Code rain animation
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

    // Constellation canvas drawing
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

      // Points roughly forming "D" and "C" shapes around center
      const w = () => canvas.width
      const h = () => canvas.height
      const cx = () => w() / 2
      const cy = () => h() / 2

      const basePoints = () => ([
        // D arc
        { x: cx() - 180, y: cy() - 80 },
        { x: cx() - 180, y: cy() + 80 },
        { x: cx() - 140, y: cy() + 110 },
        { x: cx() - 80, y: cy() + 80 },
        { x: cx() - 60, y: cy() + 30 },
        { x: cx() - 60, y: cy() - 30 },
        { x: cx() - 80, y: cy() - 80 },
        { x: cx() - 140, y: cy() - 110 },
        // C arc
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

        // Slight shimmer
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

        // Connect nearby points
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x
            const dy = pts[i].y - pts[j].y
            const dist = Math.hypot(dx, dy)
            if (dist < 160) {
              const alpha = 1 - dist / 160
              ctx.beginPath()
              ctx.moveTo(pts[i].x, pts[i].y)
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

    const cleanupCounters = animateCounters()
    const cleanupRain = createCodeRain()
    const stopConstellation = startConstellation()

    let timer = 0
    const startTick = () => {
      if (!activeEvent?.date) return
      if (timer) window.clearInterval(timer)
      timer = window.setInterval(() => {
        const nowMs = Date.now()
        const targetMs = activeEvent.date.getTime()
        const diff = Math.max(0, targetMs - nowMs)
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        setTimeLeft({ days, hours, minutes, seconds })
        if (diff === 0) {
          // Move to next event automatically
          const next = ((): { slug: string; title: string; date: Date } | null => {
            const now = new Date()
            const upcoming = events
              .map((e: UpcomingEvent) => ({ slug: e.slug, title: e.title, date: toDate(e.date, e.time) }))
              .filter((e: { date: Date }) => e.date.getTime() > now.getTime())
              .sort((a: { date: Date }, b: { date: Date }) => a.date.getTime() - b.date.getTime())
            return upcoming[0] || null
          })()
          setActiveEvent(next)
        }
      }, 1000)
    }
    startTick()

    return () => {
      cleanupCounters && cleanupCounters()
      cleanupRain && cleanupRain()
      stopConstellation && stopConstellation()
      if (timer) window.clearInterval(timer)
    }
  }, [activeEvent])

  return (
    <>
      <main className="relative">
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
              Dev Catalyst
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-8 animate-fadeInUp animation-delay-200">
              Fueling the Next Generation of Developers
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-10 md:gap-16 mb-10 animate-fadeInUp animation-delay-400">
              <div className="text-center">
                <div className="stat-number text-2xl sm:text-3xl font-bold text-[#00d4ff]" data-target="25">0</div>
                <div className="text-gray-500">Members</div>
              </div>
              <div className="text-center">
                <div className="stat-number text-2xl sm:text-3xl font-bold text-[#00d4ff]" data-target="5">0</div>
                <div className="text-gray-500">Events</div>
              </div>
              <div className="text-center">
                <div className="stat-number text-2xl sm:text-3xl font-bold text-[#00d4ff]" data-target="10">0</div>
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
              About Dev Catalyst
            </h2>
            <p className="max-w-3xl mx-auto text-center text-gray-400 mb-7 sm:mb-9 leading-relaxed text-sm sm:text-base">
              Dev Catalyst is a student-led developer community focused on learning-by-building. We bring together curious minds to explore modern technologies, collaborate on real projects, and become industry-ready through practice, mentorship, and events.
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

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#00d4ff]/30 hover:shadow-[0_20px_40px_rgba(0,212,255,0.1)]">
                <h3 className="text-[#00d4ff] text-xl font-semibold mb-4">Who Can Join</h3>
                <p className="text-gray-400 leading-relaxed">
                  Anyone interested in technology: developers, designers, product enthusiasts. No prior experience required—just curiosity and commitment.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#00d4ff]/30 hover:shadow-[0_20px_40px_rgba(0,212,255,0.1)]">
                <h3 className="text-[#00d4ff] text-xl font-semibold mb-4">How To Get Involved</h3>
                <ul className="text-gray-400 leading-relaxed list-disc pl-5 space-y-2">
                  <li>Attend a beginner workshop this month</li>
                  <li>Join a project team that matches your interests</li>
                  <li>Contribute to our open-source repos</li>
                  <li>Volunteer at events or lead a session</li>
                  <li>Say hello on our community chat</li>
                </ul>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#00d4ff]/30 hover:shadow-[0_20px_40px_rgba(0,212,255,0.1)]">
                <h3 className="text-[#00d4ff] text-xl font-semibold mb-4">Our Values</h3>
                <ul className="text-gray-400 leading-relaxed list-disc pl-5 space-y-2">
                  <li>Learn in public and build together</li>
                  <li>Be kind, inclusive, and respectful</li>
                  <li>Bias for action—ship, iterate, improve</li>
                  <li>Share knowledge and lift others up</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Highlights / Recent Gallery */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 bg-gradient-to-r from-white to-[#00d4ff] bg-clip-text text-transparent">
              Recent Highlights
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Hackathon 2025', img: '/gallery/2025-hackathon-1.svg', desc: '120+ participants, 24 projects shipped.' },
                { title: 'Tech Talk', img: '/gallery/2025-talk-1.svg', desc: 'Guest session on AI agents and tooling.' },
                { title: 'Web Workshop', img: '/gallery/2025-workshop-1.svg', desc: 'From idea to deploy with Vite + Tailwind.' },
              ].map((g, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:-translate-y-2 transition-all">
                  <img src={g.img} alt={g.title} loading="lazy" className="w-full h-48 object-cover bg-white/5" />
                  <div className="p-6">
                    <h3 className="text-white font-semibold mb-1">{g.title}</h3>
                    <p className="text-gray-400 text-sm">{g.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <a href="/gallery" className="inline-block px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10">View Gallery</a>
            </div>
          </div>
        </section>

        {/* Teams Preview */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 bg-gradient-to-r from-white to-[#00d4ff] bg-clip-text text-transparent">
              Explore Our Teams
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Core Team', href: '/about#teams' },
                { name: 'Technical Team', href: '/about#teams' },
                { name: 'Event Planning Team', href: '/about#teams' },
                { name: 'Social Media Team', href: '/about#teams' },
              ].map((t, i) => (
                <a key={i} href={t.href} className="block bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:-translate-y-2 transition-all">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#9c40ff]" />
                  <div className="text-white font-semibold">{t.name}</div>
                </a>
              ))}
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

        {/* Testimonials */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 bg-gradient-to-r from-white to-[#00d4ff] bg-clip-text text-transparent">
              What Members Say
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { quote: 'Workshops are hands-on and super practical. I built my first app here!', name: 'Aisha' },
                { quote: 'Great peer mentorship and friendly vibes. Helped me crack my internship.', name: 'Rahul' },
                { quote: 'The hackathon was incredible—learned a ton and made new friends.', name: 'Sneha' },
              ].map((q, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <p className="text-gray-300 leading-relaxed mb-4">“{q.quote}”</p>
                  <div className="text-white font-semibold">{q.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Resources teaser */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 bg-gradient-to-r from-white to-[#00d4ff] bg-clip-text text-transparent">
              Popular Resources
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Frontend Roadmap', tag: 'Web' },
                { title: 'Intro to LLMs', tag: 'AI/ML' },
                { title: 'Deploy on Vercel', tag: 'Cloud' },
              ].map((r, i) => (
                <a key={i} href="/resources" className="block bg-white/5 border border-white/10 rounded-2xl p-6 hover:-translate-y-2 transition-all">
                  <div className="text-[#00d4ff] text-sm mb-1">{r.tag}</div>
                  <div className="text-white font-semibold">{r.title}</div>
                </a>
              ))}
            </div>
            <div className="text-center mt-8">
              <a href="/resources" className="inline-block px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10">Browse All Resources</a>
            </div>
          </div>
        </section>

        {/* Leaderboard */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-white to-[#00d4ff] bg-clip-text text-transparent">Leaderboard</h2>

            {(() => {
              const [filter, setFilter] = useState('All' as Filter)
              const [data, setData] = useState([] as BoardUser[])

              useEffect(() => {
                let cancelled = false
                fetch('/data/leaderboard.json', { cache: 'no-store' })
                  .then(r => r.ok ? r.json() : Promise.reject(new Error('Failed')))
                  .then(json => { if (!cancelled) setData(Array.isArray(json?.users) ? json.users as BoardUser[] : []) })
                  .catch(() => { /* silently ignore */ })
                return () => { cancelled = true }
              }, [])

              const filtered = data
                .filter((u: BoardUser) => filter === 'All' ? true : u.tag === filter)
                .sort((a: BoardUser, b: BoardUser) => b.points - a.points)
              const podium = filtered.slice(0, 3)
              const others = filtered.slice(3, 5)
              const maxPts = Math.max(...filtered.map((u: BoardUser) => u.points), 1)

              return (
                <>
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
                    {(['All','Month','Hackathons','Open Source'] as const).map((key: Filter) => (
                      <button
                        key={key}
                        onClick={() => setFilter(key)}
                        className={`px-4 py-2 rounded-full border text-sm transition-all ${filter === key ? 'bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] text-white border-transparent' : 'bg-white/5 border-white/10 text-white/90 hover:bg-white/10'}`}
                      >
                        {key === 'All' ? 'All-time' : key === 'Month' ? 'This Month' : key}
                      </button>
                    ))}
                  </div>

                  {/* Podium */}
                  <div className="grid md:grid-cols-3 gap-5 mb-8">
                    {podium.map((p: BoardUser, i: number) => (
                      <div key={i} className={`relative bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:-translate-y-1 transition-all ${i===0 ? 'md:order-2' : i===1 ? 'md:order-1' : 'md:order-3'}`}>
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${i===0 ? 'bg-yellow-400 text-black' : i===1 ? 'bg-gray-300 text-black' : 'bg-amber-700 text-white'}`}>{i===0 ? '1st' : i===1 ? '2nd' : '3rd'}</span>
                        </div>
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] flex items-center justify-center text-lg font-bold text-white">
                          {p.name.split(' ').map((w: string) => w[0]).slice(0,2).join('')}
                        </div>
                        <div className="text-white font-semibold">{p.name}</div>
                        <div className="text-[#00d4ff] text-sm mb-2">{p.role}</div>
                        <div className="text-gray-300 text-sm">{p.points} pts</div>
                      </div>
                    ))}
                  </div>

                  {/* Ranked list */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6">
                    <div className="divide-y divide-white/10">
                      {others.map((u: BoardUser, idx: number) => (
                        <div key={u.name} className="py-4 flex items-center gap-4">
                          <div className="w-8 text-gray-400 text-sm">#{idx + 4}</div>
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] flex items-center justify-center text-sm font-bold text-white">
                            {u.name.split(' ').map((w: string) => w[0]).slice(0,2).join('')}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-white font-medium leading-tight">{u.name}</div>
                                <div className="text-[#00d4ff] text-xs">{u.role}</div>
                              </div>
                              <div className="text-gray-300 text-sm">{u.points} pts</div>
                            </div>
                            <div className="mt-2 h-2 w-full rounded-full bg-white/5 overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-[#00d4ff] to-[#9c40ff]" style={{ width: `${Math.max(6, Math.round((u.points / maxPts) * 100))}%` }} />
                            </div>
                          </div>
                          <div>
                            <span className="px-2 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-gray-300">{u.tag}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )
            })()}
          </div>
        </section>

        {/* Community CTA */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-2">Join our community</h3>
                <p className="text-gray-400">Connect on Discord or WhatsApp for updates and support.</p>
              </div>
              <div className="flex gap-3">
                <a href="https://discord.com/invite/" target="_blank" rel="noreferrer" className="px-5 py-3 rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/15">Discord</a>
                <a href="https://chat.whatsapp.com/" target="_blank" rel="noreferrer" className="px-5 py-3 rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/15">WhatsApp</a>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-[#00d4ff] bg-clip-text text-transparent">Subscribe to our Newsletter</h2>
            <p className="text-gray-400 mb-8">Get event announcements, learning resources, and community highlights in your inbox.</p>
            <form className="flex flex-col sm:flex-row gap-3 justify-center">
              <input type="email" required placeholder="you@example.com" className="w-full sm:w-auto min-w-[260px] px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00d4ff]" />
              <button type="submit" className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] text-white font-semibold">Subscribe</button>
            </form>
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
                  <a href="mailto:club@example.com" className="text-[#00d4ff]">club@example.com</a>
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
                  <p className="text-gray-400">Block A, Room 204, Your College</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-12 px-4 text-center">
          <div className="flex justify-center gap-8 mb-8">
            <a href="#" className="text-2xl text-gray-400 hover:text-[#00d4ff] hover:-translate-y-1 transition-all duration-300">📧</a>
            <a href="#" className="text-2xl text-gray-400 hover:text-[#00d4ff] hover:-translate-y-1 transition-all duration-300">💬</a>
            <a href="#" className="text-2xl text-gray-400 hover:text-[#00d4ff] hover:-translate-y-1 transition-all duration-300">🔗</a>
            <a href="#" className="text-2xl text-gray-400 hover:text-[#00d4ff] hover:-translate-y-1 transition-all duration-300">📸</a>
          </div>
          <p className="text-gray-500">&copy; 2025 Dev Catalyst. All rights reserved.</p>
        </footer>
      </main>
    </>
  )
}

export default Home