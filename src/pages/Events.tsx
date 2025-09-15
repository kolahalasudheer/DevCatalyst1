import React, { useEffect, useMemo, useState } from 'react'

type Category = 'Hackathons' | 'Workshops' | 'Tech Talks' | 'Seminars' | 'Other';

type AgendaItem = { time: string; item: string };

type EventItem = {
  slug?: string;
  title: string;
  date: string;
  time?: string;
  description: string;
  cta: string;
  image?: string;
  category: Category;
  agenda?: AgendaItem[];
};

const Card: React.FC<{ item: EventItem }> = ({ item }) => (
  <div className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2">
    <div className="absolute top-0 -left-full w-full h-[2px] bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] transition-all duration-500 group-hover:left-0"></div>
    <div className="h-40 md:h-48 w-full overflow-hidden">
      <div
        className="h-full w-full bg-center bg-cover opacity-90"
        style={{
          backgroundImage: item.image
            ? `url("${item.image}")`
            : "linear-gradient(135deg, rgba(0,212,255,0.25), rgba(156,64,255,0.25))",
        }}
      ></div>
    </div>
    <div className="p-8">
      <div className="text-[#00d4ff] text-sm font-semibold mb-2">{item.date}{item.time ? ` • ${item.time}` : ''}</div>
      <h3 className="text-white text-xl font-semibold mb-4">{item.title}</h3>
      <p className="text-gray-400 leading-relaxed">{item.description}</p>

      {item.agenda && item.agenda.length > 0 && (
        <div className="mt-4 mb-4 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-gray-300 mb-2 font-semibold">Timetable</div>
          <ul className="text-gray-300 text-sm space-y-1">
            {item.agenda.slice(0, 3).map((a, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-gray-400 w-24 shrink-0">{a.time}</span>
                <span>{a.item}</span>
              </li>
            ))}
            {item.agenda.length > 3 && (
              <li className="text-gray-400">…and more</li>
            )}
          </ul>
        </div>
      )}

      {item.slug ? (
        <a href={`/events/${item.slug}`} className="inline-block bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] text-white px-6 py-2 rounded-full hover:scale-105 transition-transform duration-300">
          {item.cta}
        </a>
      ) : (
        <a href="/#contact" className="inline-block bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] text-white px-6 py-2 rounded-full hover:scale-105 transition-transform duration-300">
          {item.cta}
        </a>
      )}
    </div>
  </div>
);

type EventsData = { upcoming: EventItem[]; past: EventItem[] }

const fallbackData: EventsData = {
  upcoming: [
    { slug: 'hackathon-2025', title: 'Hackathon 2025', date: '2025-09-15', description: '24-hour coding marathon with prizes.', cta: 'Learn More', image: undefined, category: 'Hackathons', agenda: [ { time: '10:00 AM', item: 'Kickoff' }, { time: '01:00 PM', item: 'Mentor Rounds' }, { time: 'Next Day 03:00 PM', item: 'Submissions' } ] },
    { slug: 'web-development-workshop', title: 'Web Development Workshop', date: '2025-11-05', description: 'Learn the fundamentals of modern web development.', cta: 'Learn More', image: undefined, category: 'Workshops', agenda: [ { time: '09:30 AM', item: 'Intro & Setup' }, { time: '10:30 AM', item: 'Components & State' }, { time: '12:00 PM', item: 'Hands-on Build' } ] },
  ],
  past: [
    { slug: 'ai-ml-seminar-2025', title: 'AI & Machine Learning Seminar', date: '2025-04-20', description: 'Trends in AI/ML with practical demos.', cta: 'View Recap', image: undefined, category: 'Seminars' },
    { slug: 'beginners-python-2025', title: "Beginner's Python Workshop", date: '2025-02-10', description: 'Intro to Python programming.', cta: 'View Recap', image: undefined, category: 'Workshops' },
  ],
}

const Events = () => {
  const [activeCategory, setActiveCategory] = useState('All' as Category | 'All')
  const [data, setData] = useState(fallbackData as EventsData)

  useEffect(() => {
    let cancelled = false
    fetch('/data/events.json', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : Promise.reject(new Error('Failed')))
      .then((json: EventsData) => { if (!cancelled) setData(json) })
      .catch(() => { /* keep fallback */ })
    return () => { cancelled = true }
  }, [])

  const categories: Array<Category | 'All'> = useMemo(() => ['All', 'Hackathons', 'Workshops', 'Tech Talks', 'Seminars'], [])
  const filterMatches = (item: EventItem) => activeCategory === 'All' || item.category === activeCategory

  return (
    <section id="events" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Events</h1>
          <p className="text-gray-400 max-w-3xl">
            Join our upcoming workshops and hackathons or relive the highlights of past events.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full border ${activeCategory === cat ? 'bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] text-white border-transparent' : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">Upcoming Events</h2>
        <div className="grid md:grid-cols-2 gap-8 mb-14">
          {data.upcoming.filter(filterMatches).map((e: EventItem, i: number) => (
            <Card key={e.slug || i} item={e} />
          ))}
        </div>

        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">Past Events</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {data.past.filter(filterMatches).map((e: EventItem, i: number) => (
            <Card key={e.slug || i} item={e} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Events