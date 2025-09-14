import React from 'react'

const Join = () => {
  return (
    <section id="join" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-10">Join Us</h1>
        <p className="text-gray-400 max-w-3xl mb-12">Become a part of Dev Catalyst—learn, build, and grow with an inclusive community.</p>
        <div className="mb-12 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <p className="text-gray-300">Fill out our membership form to get onboarded. We’ll reach out with next steps.</p>
          <a href="https://forms.gle/your-google-form" target="_blank" rel="noreferrer" className="inline-flex px-6 py-3 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#9c40ff] text-white font-semibold hover:-translate-y-0.5 transition-transform">Open Membership Form</a>
        </div>

        <div className="mb-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Membership Perks</h2>
          <ul className="text-gray-400 leading-relaxed list-disc pl-5 space-y-2">
            <li>Networking with peers, alumni, and industry mentors</li>
            <li>Hands-on learning via workshops, projects, and hackathons</li>
            <li>Leadership opportunities: organize events, lead teams, mentor juniors</li>
            <li>Priority access to limited-seat sessions and partner events</li>
            <li>Boost your portfolio with real project experience</li>
          </ul>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h3 className="text-[#00d4ff] text-xl font-semibold mb-4">Who Can Join</h3>
            <p className="text-gray-400 leading-relaxed">
              Anyone interested in technology: developers, designers, product enthusiasts. No prior experience required—just curiosity and commitment.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h3 className="text-[#00d4ff] text-xl font-semibold mb-4">How To Get Involved</h3>
            <ul className="text-gray-400 leading-relaxed list-disc pl-5 space-y-2">
              <li>Attend a beginner workshop this month</li>
              <li>Join a project team that matches your interests</li>
              <li>Contribute to our open-source repos</li>
              <li>Volunteer at events or lead a session</li>
              <li>Say hello on our community chat</li>
            </ul>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h3 className="text-[#00d4ff] text-xl font-semibold mb-4">Our Values</h3>
            <ul className="text-gray-400 leading-relaxed list-disc pl-5 space-y-2">
              <li>Learn in public and build together</li>
              <li>Be kind, inclusive, and respectful</li>
              <li>Bias for action—ship, iterate, improve</li>
              <li>Share knowledge and lift others up</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <a href="https://beacons.ai/devcatalyst" target="_blank" rel="noreferrer" className="px-5 py-3 rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/15">Join Social</a>
        </div>
      </div>
    </section>
  )
}

export default Join

