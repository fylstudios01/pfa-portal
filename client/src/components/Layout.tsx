import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Shield, Menu, X, Instagram, Twitter, Facebook, Search } from "lucide-react";
import { useState } from "react";
import logo from "@assets/image_(18)_1765250186765.png";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Inicio", path: "/" },
    { name: "Incorporación", path: "/incorporacion" },
    { name: "Estado de Trámite", path: "/seguimiento" },
    { name: "Acceso Personal", path: "/login" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Top Bar */}
      <div className="bg-primary text-secondary py-1 px-4 text-xs font-semibold tracking-wider text-center md:text-right border-b border-secondary/20">
        REPÚBLICA ARGENTINA - MINISTERIO DE SEGURIDAD
      </div>

      {/* Header */}
      <header className="bg-primary text-white shadow-md sticky top-0 z-50 border-b-4 border-secondary">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              <img 
                src={logo} 
                alt="Escudo PFA" 
                className="h-12 w-auto drop-shadow-md group-hover:scale-105 transition-transform duration-300" 
              />
              <div className="hidden md:block">
                <h1 className="font-serif font-bold text-lg leading-tight tracking-wide text-white">
                  POLICÍA FEDERAL
                </h1>
                <h2 className="font-sans text-xs text-secondary font-bold tracking-[0.2em] uppercase">
                  ARGENTINA
                </h2>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a className={cn(
                  "text-sm font-medium tracking-wide transition-colors hover:text-secondary py-2 border-b-2 border-transparent flex items-center gap-2",
                  location === item.path ? "text-secondary border-secondary" : "text-gray-200"
                )}>
                  {item.path === "/seguimiento" && <Search className="w-3 h-3" />}
                  {item.name.toUpperCase()}
                </a>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white hover:text-secondary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-primary border-t border-primary-foreground/10 py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a 
                  className={cn(
                    "block text-sm font-medium tracking-wide py-2 px-3 rounded hover:bg-white/10 transition-colors",
                    location === item.path ? "text-secondary bg-white/5" : "text-white"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name.toUpperCase()}
                </a>
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white border-t-4 border-secondary pt-12 pb-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center md:text-left">
               <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <img src={logo} alt="Escudo PFA" className="h-10 w-auto opacity-90" />
                <div>
                  <h3 className="font-serif font-bold text-md text-white">POLICÍA FEDERAL</h3>
                  <p className="text-[10px] text-secondary tracking-widest uppercase font-bold">Argentina</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 max-w-xs mx-auto md:mx-0">
                Al servicio de la comunidad, protegiendo la vida, los bienes y los derechos de los ciudadanos con honor y deber.
              </p>
            </div>

            <div className="text-center">
              <h4 className="font-serif font-bold text-lg mb-4 text-secondary">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/"><a className="hover:text-white transition-colors">Inicio</a></Link></li>
                <li><Link href="/incorporacion"><a className="hover:text-white transition-colors">Incorporación</a></Link></li>
                <li><Link href="/seguimiento"><a className="hover:text-white transition-colors">Estado de Trámite</a></Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Denuncias</a></li>
              </ul>
            </div>

            <div className="text-center md:text-right">
              <h4 className="font-serif font-bold text-lg mb-4 text-secondary">Contacto</h4>
              <p className="text-sm text-gray-300 mb-1">Emergencias: 911</p>
              <p className="text-sm text-gray-300 mb-1">Comisaría Central: Av. Belgrano 1234</p>
              <p className="text-sm text-gray-300 mb-4">policiafederalargentina.rav1@gmail.com</p>
              
              <div className="flex justify-center md:justify-end gap-4">
                <a href="#" className="text-gray-400 hover:text-secondary transition-colors"><Instagram size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-secondary transition-colors"><Twitter size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-secondary transition-colors"><Facebook size={20} /></a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-6 text-center text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} Policía Federal Argentina - Capital Federal | Roblox Game. Sitio oficial de rol.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
