import React from 'react';

const Contact = () => {
  return (
    <>
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
      </section>
      <Footer />
    </>
  );
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
              <strong>Corporate & Communications Address:</strong><br />
              Block A, Room 204, Your College,<br />
              Hyderabad, Telangana, 500001
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
          <p>&copy; 2025 Dev Catalyst. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};


export default Contact