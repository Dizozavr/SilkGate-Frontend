import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#F5F6FA] border-t border-gray-200 mt-12 py-6 px-4 text-[#10182A] text-sm">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-wrap gap-4 mb-2 md:mb-0">
          <a href="/terms" className="hover:text-[#FFD700] transition">Terms</a>
          <a href="/privacy" className="hover:text-[#FFD700] transition">Privacy</a>
          <a href="/contacts" className="hover:text-[#FFD700] transition">Contacts</a>
          <a href="/about" className="hover:text-[#FFD700] transition">About</a>
        </div>
        <div className="flex gap-3 items-center mb-2 md:mb-0">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-[#FFD700] transition">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8a6 6 0 016 6v5h-4v-5a2 2 0 00-4 0v5h-4v-9h4v1.5" /></svg>
          </a>
          <a href="https://t.me/" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="hover:text-[#FFD700] transition">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 3L3 10.53l5.18 1.64M21 3l-4.18 18.36a1 1 0 01-1.64.54l-4.18-3.18-2.18 2.18a1 1 0 01-1.64-.54L3 10.53" /></svg>
          </a>
          <a href="mailto:info@silkgate.com" aria-label="Email" className="hover:text-[#FFD700] transition">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12l-4-4-4 4m8 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v4" /></svg>
          </a>
        </div>
      </div>
      <hr className="my-4 border-gray-200" />
      <div className="max-w-6xl mx-auto text-xs text-gray-600">
        <b>Disclaimer:</b> The information provided on this platform is for informational purposes only and does not constitute investment advice, an offer, or a solicitation of any kind. All investment decisions should be made based on your own research and risk assessment. For more information, contact us.
      </div>
    </footer>
  );
} 