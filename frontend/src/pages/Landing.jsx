import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-gray-900">
        SilkGate — Private Startup & Investor Platform
      </h1>
      <p className="text-xl md:text-2xl mb-10 text-gray-600 max-w-2xl">
        Connecting high-potential startups with verified investors under full confidentiality.
      </p>
      <div className="flex gap-4 justify-center">
        <Link
          to="/investor-register"
          className="px-8 py-3 rounded-lg font-semibold bg-black text-white hover:bg-gray-900 transition text-lg shadow-lg"
        >
          Зарегистрироваться как инвестор
        </Link>
        <Link
          to="/startup-register"
          className="px-8 py-3 rounded-lg font-semibold bg-gray-100 text-black hover:bg-gray-200 transition text-lg shadow-lg"
        >
          Подать стартап
        </Link>
      </div>
    </main>
  );
} 