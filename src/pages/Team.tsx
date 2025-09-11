const Team = () => {
  return (
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
  )
}

export default Team