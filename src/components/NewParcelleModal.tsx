import React, { useState } from 'react';
import { X, Layers, MapPin, Sprout } from 'lucide-react';

interface NewParcelleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    cropType: string;
    areaHectares: string;
    location: string;
    soilType: string;
    plantingDate: string;
    notes: string;
  }) => Promise<void>;
}

export const NewParcelleModal: React.FC<NewParcelleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [cropType, setCropType] = useState('Cacao');
  const [areaHectares, setAreaHectares] = useState('2.5');
  const [location, setLocation] = useState('Divo, Lôh-Djiboua');
  const [soilType, setSoilType] = useState('Sol ferrallitique profond');
  const [plantingDate, setPlantingDate] = useState('2022-05');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Veuillez saisir un nom pour la parcelle');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await onSubmit({
        name: name.trim(),
        cropType,
        areaHectares,
        location: location.trim(),
        soilType,
        plantingDate,
        notes: notes.trim(),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'enregistrement de la parcelle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Ajouter une Parcelle Agricole</h3>
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nom ou Identifiant de l'exploitation *
            </label>
            <input
              type="text"
              required
              placeholder="ex: Plantation Cacao Est, Champ Anacarde Nord"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Spéculation / Culture *</label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
              >
                <option value="Cacao">Cacao</option>
                <option value="Café">Café</option>
                <option value="Anacarde (Cajou)">Anacarde (Cajou)</option>
                <option value="Palmier à huile">Palmier à huile</option>
                <option value="Hévéa">Hévéa</option>
                <option value="Manioc">Manioc</option>
                <option value="Maïs">Maïs</option>
                <option value="Riz">Riz</option>
                <option value="Banane plantain">Banane plantain</option>
                <option value="Maraîchage">Maraîchage</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Superficie (Hectares) *</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={areaHectares}
                onChange={(e) => setAreaHectares(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Localisation géographique (Ville / Village / Région) *
            </label>
            <input
              type="text"
              required
              placeholder="ex: Soubré, Divo, Aboisso, Korhogo..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Type de sol dominant</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
              >
                <option value="Sol ferrallitique profond">Sol ferrallitique profond</option>
                <option value="Sol argilo-sableux">Sol argilo-sableux</option>
                <option value="Sol hydromorphe (bas-fonds)">Sol hydromorphe (bas-fonds)</option>
                <option value="Sol ferrugineux tropical">Sol ferrugineux tropical</option>
                <option value="Sol brun eutrophe">Sol brun eutrophe</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Période de plantation</label>
              <input
                type="month"
                value={plantingDate}
                onChange={(e) => setPlantingDate(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Notes complémentaires (ombrage, clone, historique)
            </label>
            <textarea
              rows={2}
              placeholder="ex: Verger régénéré en 2023 avec variétés Mercedes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
            />
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
              {loading ? 'Enregistrement...' : 'Enregistrer la Parcelle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
