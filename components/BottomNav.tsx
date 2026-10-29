"use client";

import { Home as HomeIcon, Code2, History, MessageSquareQuote, Mail } from "lucide-react";

export default function BottomNav() {
  const items = [
    { label: "Inicio", href: "#inicio", icon: <HomeIcon className="w-5 h-5" />, active: true },
    { label: "Proyectos", href: "#proyectos", icon: <Code2 className="w-5 h-5" /> },
    { label: "Trayectoria", href: "#experiencia", icon: <History className="w-5 h-5" /> },
    { label: "Reseñas", href: "#testimonios", icon: <MessageSquareQuote className="w-5 h-5" /> },
    { label: "Contacto", href: "#contacto", icon: <Mail className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-[#faf8ff]/90 backdrop-blur-xl border-t border-indigo-100/60 shadow-[0_-2px_12px_rgba(53,37,205,0.05)] md:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[54px] min-h-[44px] transition-colors ${
              item.active ? "text-[#3525cd] font-bold" : "text-[#777587] hover:text-[#131b2e]"
            }`}
          >
            {item.icon}
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
