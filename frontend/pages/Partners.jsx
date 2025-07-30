import React from 'react';

const partners = [
  { id: 1, logo: '/partners/partner1.png', name: 'VC Group' },
  { id: 2, logo: '/partners/partner2.png', name: 'Startup Hub' },
  { id: 3, logo: '/partners/partner3.png', name: 'FinTech Angels' },
];

export default function Partners() {
  return (
    <div className="min-h-screen bg-[#10182A] py-10 px-2 sm:px-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Партнёры</h1>
      <p className="text-lg text-gray-300 mb-10 max-w-2xl">SilkGate сотрудничает с ведущими венчурными фондами, акселераторами и экспертами рынка.</p>
      <div className="flex flex-wrap gap-8 items-center">
        {partners.map((p) => (
          <div key={p.id} className="bg-white rounded-xl p-3 flex items-center justify-center shadow min-w-[120px] min-h-[60px]">
            <img src={p.logo} alt={p.name} className="h-10 object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
} 