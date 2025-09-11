const Contact = () => {
  return (
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
        </div>
      </div>

      <footer className="mt-32 text-center">
        <div className="flex justify-center gap-8 mb-8">
          <a href="#" className="text-2xl text-gray-400 hover:text-[#00d4ff] hover:-translate-y-1 transition-all duration-300">📧</a>
          <a href="#" className="text-2xl text-gray-400 hover:text-[#00d4ff] hover:-translate-y-1 transition-all duration-300">💬</a>
          <a href="#" className="text-2xl text-gray-400 hover:text-[#00d4ff] hover:-translate-y-1 transition-all duration-300">🔗</a>
          <a href="#" className="text-2xl text-gray-400 hover:text-[#00d4ff] hover:-translate-y-1 transition-all duration-300">📸</a>
        </div>
        <p className="text-gray-500">&copy; 2025 Dev Catalyst. All rights reserved.</p>
      </footer>
    </section>
  )
}

export default Contact