import { useEffect, useState } from 'react'

type Leadership = { name: string; role: string; avatar?: string }
type TeamMember = { name: string; role?: string; avatar?: string }
type TeamGroup = { name: string; members: TeamMember[] }

type TeamData = {
  overview: string
  domains: string[]
  leadership: Leadership[]
  teams: TeamGroup[]
}

const About = () => {
  const [data, setData] = useState<TeamData | null>(null)
  const [open, setOpen] = useState<Record<string, boolean>>({})

  useEffect(() => {
    let cancelled = false
    fetch('/data/team.json', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : Promise.reject(new Error('Failed')))
      .then((json: TeamData) => { if (!cancelled) setData(json) })
      .catch(() => { /* keep null; page still shows base cards */ })
    return () => { cancelled = true }
  }, [])

  const toggleTeam = (name: string) => setOpen(prev => ({ ...prev, [name]: !prev[name] }))

  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-white to-[#00d4ff] bg-clip-text text-transparent">
          About Dev Catalyst
        </h2>

        {data && (
          <div className="max-w-4xl mx-auto text-center mb-12">
            <p className="text-gray-300 leading-relaxed">{data.overview}</p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#00d4ff]/30 hover:shadow-[0_20px_40px_rgba(0,212,255,0.1)]">
            <h3 className="text-[#00d4ff] text-xl font-semibold mb-4">Our Mission</h3>
            <p className="text-gray-400 leading-relaxed">
              To create a vibrant community where aspiring developers can learn, grow, and build innovative solutions together. We bridge the gap between academic learning and real-world application.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#00d4ff]/30 hover:shadow-[0_20px_40px_rgba(0,212,255,0.1)]">
            <h3 className="text-[#00d4ff] text-xl font-semibold mb-4">What We Do</h3>
            <p className="text-gray-400 leading-relaxed">
              We conduct hands-on workshops, organize hackathons, host guest speakers, and provide mentorship opportunities. From beginners to advanced coders, there's something for everyone.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#00d4ff]/30 hover:shadow-[0_20px_40px_rgba(0,212,255,0.1)]">
            <h3 className="text-[#00d4ff] text-xl font-semibold mb-4">Our Vision</h3>
            <p className="text-gray-400 leading-relaxed">
              To be the premier student-led tech community that produces industry-ready developers and drives innovation in the local tech ecosystem.
            </p>
          </div>
        </div>

        {data && (
          <>
            <div className="mt-16">
              <h3 className="text-2xl md:text-3xl font-semibold text-white mb-6 text-center">Domains</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {data.domains.map((d, i) => (
                  <span key={i} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300">{d}</span>
                ))}
              </div>
            </div>

            <div className="mt-16">
              <h3 className="text-2xl md:text-3xl font-semibold text-white mb-6 text-center">Leadership</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                {data.leadership.map((m, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center hover:-translate-y-2 transition-all">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] flex items-center justify-center text-xl font-bold text-white">{m.avatar || m.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
                    <div className="text-white font-semibold">{m.name}</div>
                    <div className="text-[#00d4ff] text-sm">{m.role}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16">
              <h3 className="text-2xl md:text-3xl font-semibold text-white mb-6 text-center">Teams</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {data.teams.map((t, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <button onClick={() => toggleTeam(t.name)} className="w-full text-left">
                      <div className="flex items-center justify-between">
                        <div className="text-white font-semibold">{t.name}</div>
                        <div className="text-[#00d4ff] text-sm">{open[t.name] ? 'Hide' : 'Show'}</div>
                      </div>
                    </button>
                    {open[t.name] && (
                      <ul className="mt-4 space-y-3">
                        {t.members.map((m, j) => (
                          <li key={j} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] flex items-center justify-center text-[12px] font-bold text-white">
                              {(m.avatar || m.name.split(' ').map(w=>w[0]).slice(0,2).join(''))}
                            </div>
                            <div className="text-gray-200">{m.name}{m.role ? ` — ${m.role}` : ''}</div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default About