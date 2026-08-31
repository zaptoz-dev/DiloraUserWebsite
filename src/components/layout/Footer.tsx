import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--border)] py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        <div className="max-w-xs">
          <Link to="/" className="font-body font-semibold text-2xl mb-4 block">
            Dilora
          </Link>
          <p className="text-[var(--muted-foreground)] text-sm mb-6">
            AI voice agents that pick up, speak like people and get things done — in nine Indian languages, for agencies and businesses that live on the phone.
          </p>
          <div className="flex flex-wrap gap-3">
            {/* Social Icons */}
            <a href="https://www.linkedin.com/company/zaptoztechnologies/" target="_blank" rel="noopener noreferrer" className="glass p-2 rounded-full hover:bg-[var(--background)] transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="https://x.com/ZaptozTech" target="_blank" rel="noopener noreferrer" className="glass p-2 rounded-full hover:bg-[var(--background)] transition-colors">
              <span className="sr-only">Twitter (X)</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://www.instagram.com/zaptoztechnologies/" target="_blank" rel="noopener noreferrer" className="glass p-2 rounded-full hover:bg-[var(--background)] transition-colors">
              <span className="sr-only">Instagram</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://www.facebook.com/zaptoztechnologies/" target="_blank" rel="noopener noreferrer" className="glass p-2 rounded-full hover:bg-[var(--background)] transition-colors">
              <span className="sr-only">Facebook</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
            </a>
            <a href="https://www.youtube.com/@ZaptozTechnologies" target="_blank" rel="noopener noreferrer" className="glass p-2 rounded-full hover:bg-[var(--background)] transition-colors">
              <span className="sr-only">YouTube</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>

        <div className="flex gap-12 lg:gap-16">
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Product</h3>
            <ul className="flex flex-col gap-2">
              <li><Link to="/features" className="text-[var(--muted-foreground)] hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/voice-lab" className="text-[var(--muted-foreground)] hover:text-white transition-colors">Voice Lab</Link></li>
              <li><Link to="/industries" className="text-[var(--muted-foreground)] hover:text-white transition-colors">Industries</Link></li>
              <li><Link to="/pricing" className="text-[var(--muted-foreground)] hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Company</h3>
            <ul className="flex flex-col gap-2">
              <li><Link to="/about" className="text-[var(--muted-foreground)] hover:text-white transition-colors">About us</Link></li>
              <li><Link to="/demo" className="text-[var(--muted-foreground)] hover:text-white transition-colors">Get a demo</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-xs">
          <h3 className="font-semibold text-lg mb-3 text-white">Get in touch</h3>
          <p className="text-[var(--muted-foreground)] text-sm mb-4 leading-relaxed">
            We'd love to hear about your project and discuss how we can help. Reach out to us using any of the methods below.
          </p>
          <ul className="flex flex-col gap-3 text-sm text-[var(--muted-foreground)]">
            <li>
              <span className="block text-white font-medium mb-1">Email</span>
              <a href="mailto:info@zaptoz.com" className="hover:text-white transition-colors">info@zaptoz.com</a>
            </li>
            <li>
              <span className="block text-white font-medium mb-1">US Address</span>
              ZAPTOZ TECHNOLOGIES LLC, 30 N GOULD ST STE R, SHERIDAN, WY 82801
            </li>
            <li>
              <span className="block text-white font-medium mb-1">India Address</span>
              AT by AGM, Vijaylaxmi venture, Shanti Nagar, Andheri East, Mumbai, Maharashtra 400093
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[var(--muted-foreground)]">
        <p>© 2026 Zaptoz Technologies Private Limited | ZAPTOZ TECHNOLOGIES LLC | All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">DPA</a>
        </div>
      </div>
    </footer>
  );
}
