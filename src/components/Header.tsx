import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Sprout, LogIn, LogOut, User, MapPin, ShieldCheck, ChevronDown, Clock } from 'lucide-react';

interface HeaderProps {
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenProfile }) => {
  const { user, dbUser, signInWithGoogle, signOutUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  const handleSignIn = async () => {
    try {
      setSigningIn(true);
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
    } finally {
      setSigningIn(false);
    }
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'conseiller':
        return 'Conseiller Agronome';
      case 'cooperative':
        return 'Gestionnaire Coopérative';
      default:
        return 'Agriculteur / Planteur';
    }
  };

  return (
    <header className="bg-emerald-900 text-white border-b border-emerald-800 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-inner text-emerald-950">
              <Sprout className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white">AgriConseil</span>
                <span className="bg-amber-400/90 text-amber-950 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Côte d'Ivoire
                </span>
              </div>
              <p className="text-xs text-emerald-200 hidden sm:block">
                Gestion d'Exploitations & Conseil Agronomique Régional
              </p>
            </div>
          </div>

          {/* Time & Region Badge */}
          <div className="hidden md:flex items-center space-x-4 text-xs text-emerald-200">
            <div className="flex items-center space-x-1.5 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800/80">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fuseau : Africa/Abidjan (GMT)</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800/80">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{dbUser?.region || 'Abidjan / Sud-Forestier'}</span>
            </div>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2.5 bg-emerald-850 hover:bg-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-700/60 transition cursor-pointer"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Utilisateur'}
                      className="w-8 h-8 rounded-full border border-emerald-400 object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-emerald-100 font-bold">
                      {user.displayName?.[0] || 'A'}
                    </div>
                  )}
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-white leading-tight">
                      {dbUser?.displayName || user.displayName || 'Exploitant'}
                    </p>
                    <p className="text-[10px] text-emerald-300">
                      {getRoleLabel(dbUser?.role)}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-emerald-300" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 border border-slate-200 text-slate-800 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Connecté avec Google</p>
                      <p className="text-sm font-semibold truncate text-slate-900">{user.email}</p>
                      <div className="mt-1 flex items-center space-x-1 text-[11px] text-emerald-700 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Base PostgreSQL Cloud SQL</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenProfile();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      <span>Modifier mon profil</span>
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        signOutUser();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 border-t border-slate-100 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                disabled={signingIn}
                className="flex items-center space-x-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-bold px-4 py-2 rounded-xl text-sm shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>{signingIn ? 'Connexion...' : 'Connexion Google'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
