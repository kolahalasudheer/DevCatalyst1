import * as React from 'react'
import { useEffect, useRef, useState } from 'react'

const Home = () => {
  const nextEventDate = new Date('2025-12-15T09:00:00')
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 } as { days: number; hours: number; minutes: number; seconds: number })
  const canvasRef = useRef(null as HTMLCanvasElement | null)

  useEffect(() => {
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

    const timer = window.setInterval(() => {
      const now = new Date().getTime()
      const diff = Math.max(0, nextEventDate.getTime() - now)
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeLeft({ days, hours, minutes, seconds })
    }, 1000)

    return () => {
      cleanupCounters && cleanupCounters()
      cleanupRain && cleanupRain()
      stopConstellation && stopConstellation()
      window.clearInterval(timer)
    }
  }, [])

  return (
    <>
      <main className="relative">
        <section id="home" className="hero-section min-h-screen flex items-center justify-center text-center relative bg-[#0a0a0a] overflow-hidden">
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
            
            <div className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-12 md:gap-24 mb-12 animate-fadeInUp animation-delay-400">
              <div className="text-center">
                <div className="stat-number text-2xl sm:text-3xl font-bold text-[#00d4ff]" data-target="150">0</div>
                <div className="text-gray-500">Members</div>
              </div>
              <div className="text-center">
                <div className="stat-number text-2xl sm:text-3xl font-bold text-[#00d4ff]" data-target="25">0</div>
                <div className="text-gray-500">Events</div>
              </div>
              <div className="text-center">
                <div className="stat-number text-2xl sm:text-3xl font-bold text-[#00d4ff]" data-target="50">0</div>
                <div className="text-gray-500">Projects</div>
              </div>
            </div>
            
            <a 
              href="#about" 
              className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] text-white rounded-full font-semibold text-sm sm:text-base
                transform hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,212,255,0.3)] animate-fadeInUp animation-delay-600
                active:scale-95 touch-manipulation"
            >
              Explore Our Community
            </a>
          </div>
        </section>

        {/* Countdown */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold text-white mb-2">Next Big Event Starts In</h3>
                <p className="text-gray-400">Mark your calendar for our upcoming hackathon.</p>
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
              <a href="/events" className="inline-flex px-6 py-3 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] text-white font-semibold hover:-translate-y-0.5 transition-transform">View Details</a>
            </div>
          </div>
        </section>

        <section id="about" className="py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-10 bg-gradient-to-r from-white to-[#00d4ff] bg-clip-text text-transparent">
              About Dev Catalyst
            </h2>
            <p className="max-w-3xl mx-auto text-center text-gray-400 mb-10 sm:mb-14 leading-relaxed text-sm sm:text-base">
              Dev Catalyst is a student-led developer community focused on learning-by-building. We bring together curious minds to explore modern technologies, collaborate on real projects, and become industry-ready through practice, mentorship, and events.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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

        {/* Leaderboard */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-white to-[#00d4ff] bg-clip-text text-transparent">Leaderboard</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[{name:'Alex Kumar', role:'Hackathon Winner', score:'1st Place'}, {name:'Sarah Patel', role:'Top Problem Solver', score:'320 pts'}, {name:'Raj Joshi', role:'Open Source Champion', score:'24 PRs'}].map((p, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:-translate-y-2 transition-all">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] flex items-center justify-center text-xl font-bold text-white">{p.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
                  <h3 className="text-white text-xl font-semibold mb-1">{p.name}</h3>
                  <p className="text-[#00d4ff] text-sm mb-2">{p.role}</p>
                  <p className="text-gray-400">{p.score}</p>
                </div>
              ))}
            </div>
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

        <section id="team" className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-white to-[#00d4ff] bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-[#00d4ff]/30">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] flex items-center justify-center text-2xl font-bold text-white">
                  AK
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">Alex Kumar</h3>
                <p className="text-[#00d4ff] text-sm">President</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-[#00d4ff]/30">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] flex items-center justify-center text-2xl font-bold text-white">
                  SP
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">Sarah Patel</h3>
                <p className="text-[#00d4ff] text-sm">Vice President</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-[#00d4ff]/30">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] flex items-center justify-center text-2xl font-bold text-white">
                  RJ
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">Raj Joshi</h3>
                <p className="text-[#00d4ff] text-sm">Event Head</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-[#00d4ff]/30">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] flex items-center justify-center text-2xl font-bold text-white">
                  MG
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">Maya Gupta</h3>
                <p className="text-[#00d4ff] text-sm">Technical Lead</p>
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