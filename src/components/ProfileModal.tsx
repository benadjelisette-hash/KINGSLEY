import React, { useState } from 'react';
import { X, User, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { useAuth, DbUser } from '../context/AuthContext.tsx';
import { api } from '../lib/api.ts';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, dbUser, token, refreshDbUser } = useAuth();
  const [displayName, setDisplayName] = useState(dbUser?.displayName || user?.displayName || '');
  const [role, setRole] = useState(dbUser?.role || 'agriculteur');
  const [phone, setPhone] = useState(dbUser?.phone || '');
  const [region, setRegion] = useState(dbUser?.region || 'Abidjan');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      setLoading(true);
      setError('');
      await api.updateProfile(token, {
        displayName: displayName.trim(),
        role,
        phone: phone.trim(),
        region,
      });
      await refreshDbUser();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Profil & Paramètres Exploitant</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-3 p-3 bg-green-50 text-green-700 text-xs rounded-xl border border-green-200">
            Profil mis à jour avec succès !
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nom complet ou dénomination</label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Statut / Rôle</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
            >
              <option value="agriculteur">Agriculteur / Planteur</option>
              <option value="conseiller">Conseiller Agronome / Encadreur</option>
              <option value="cooperative">Gestionnaire de Coopérative</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone (WhatsApp / Orange / Wave)</label>
            <input
              type="tel"
              placeholder="+225 07 00 00 00 00"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Région principale en Côte d'Ivoire</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
            >
              <option value="Abidjan">District Autonome d'Abidjan</option>
              <option value="San-Pédro / Bas-Sassandra">San-Pédro / Bas-Sassandra</option>
              <option value="Divo / Lôh-Djiboua">Divo / Lôh-Djiboua</option>
              <option value="Soubré / Nawa">Soubré / Nawa</option>
              <option value="Bouaké / Gbêkê">Bouaké / Gbêkê</option>
              <option value="Korhogo / Poro">Korhogo / Poro</option>
              <option value="Yamoussoukro / Béliers">Yamoussoukro / Béliers</option>
              <option value="Daloa / Haut-Sassandra">Daloa / Haut-Sassandra</option>
              <option value="Man / Tonkpi">Man / Tonkpi</option>
              <option value="Abengourou / Indénié-Djuablin">Abengourou / Indénié-Djuablin</option>
              <option value="Bondoukou / Gontougo">Bondoukou / Gontougo</option>
              <option value="Aboisso / Sud-Comoé">Aboisso / Sud-Comoé</option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
