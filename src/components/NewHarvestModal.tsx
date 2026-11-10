import React, { useState, useEffect } from 'react';
import { X, Wheat, Coins } from 'lucide-react';
import { Parcelle } from '../lib/api.ts';

interface NewHarvestModalProps {
  isOpen: boolean;
  onClose: () => void;
  parcelles: Parcelle[];
  preselectedParcelle?: Parcelle | null;
  onSubmit: (data: {
    parcelleId: number;
    cropType: string;
    quantityKg: number;
    qualityGrade: string;
    salePriceFcfa?: number;
    harvestDate: string;
    buyer?: string;
    notes?: string;
  }) => Promise<void>;
}

export const NewHarvestModal: React.FC<NewHarvestModalProps> = ({
  isOpen,
  onClose,
  parcelles,
  preselectedParcelle,
  onSubmit,
}) => {
  const [selectedParcelleId, setSelectedParcelleId] = useState<number>(0);
  const [cropType, setCropType] = useState('Cacao');
  const [quantityKg, setQuantityKg] = useState('500');
  const [qualityGrade, setQualityGrade] = useState('Grade 1 (Supérieur)');
  const [salePriceFcfa, setSalePriceFcfa] = useState('1850');
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().slice(0, 10));
  const [buyer, setBuyer] = useState('Coopérative Agricole Locale');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (preselectedParcelle) {
      setSelectedParcelleId(preselectedParcelle.id);
      setCropType(preselectedParcelle.cropType);
      if (preselectedParcelle.cropType.toLowerCase().includes('cacao')) {
        setSalePriceFcfa('1850');
      } else if (preselectedParcelle.cropType.toLowerCase().includes('café')) {
        setSalePriceFcfa('1500');
      } else if (preselectedParcelle.cropType.toLowerCase().includes('anacarde')) {
        setSalePriceFcfa('375');
      }
    } else if (parcelles.length > 0) {
      setSelectedParcelleId(parcelles[0].id);
      setCropType(parcelles[0].cropType);
    }
  }, [preselectedParcelle, parcelles, isOpen]);

  if (!isOpen) return null;

  const handleParcelleChange = (id: number) => {
    setSelectedParcelleId(id);
    const found = parcelles.find((p) => p.id === id);
    if (found) {
      setCropType(found.cropType);
      if (found.cropType.toLowerCase().includes('cacao')) {
        setSalePriceFcfa('1850');
      } else if (found.cropType.toLowerCase().includes('café')) {
        setSalePriceFcfa('1500');
      } else if (found.cropType.toLowerCase().includes('anacarde')) {
        setSalePriceFcfa('375');
      }
    }
  };

  const calculatedTotal = (parseFloat(quantityKg) || 0) * (parseFloat(salePriceFcfa) || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParcelleId) {
      setError('Veuillez sélectionner une parcelle');
      return;
    }
    const qty = parseInt(quantityKg, 10);
    if (isNaN(qty) || qty <= 0) {
      setError('Quantité invalide');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSubmit({
        parcelleId: selectedParcelleId,
        cropType,
        quantityKg: qty,
        qualityGrade,
        salePriceFcfa: salePriceFcfa ? parseInt(salePriceFcfa, 10) : undefined,
        harvestDate,
        buyer: buyer.trim(),
        notes: notes.trim(),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'enregistrement de la récolte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Wheat className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Enregistrer une Récolte / Pesée</h3>
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
              Parcelle d'origine *
            </label>
            <select
              value={selectedParcelleId}
              onChange={(e) => handleParcelleChange(Number(e.target.value))}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none"
            >
              {parcelles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.cropType} - {p.areaHectares} ha - {p.location})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Quantité pesée (kg net) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={quantityKg}
                onChange={(e) => setQuantityKg(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Date de récolte / pesée *
              </label>
              <input
                type="date"
                required
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Qualité / Grade</label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none"
              >
                <option value="Grade 1 (Supérieur)">Grade 1 (Supérieur)</option>
                <option value="Grade 2 (Courant)">Grade 2 (Courant)</option>
                <option value="Standard Marchand">Standard Marchand</option>
                <option value="Sous-grade">Sous-grade</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Prix unitaire (FCFA / kg)
              </label>
              <input
                type="number"
                min="0"
                value={salePriceFcfa}
                onChange={(e) => setSalePriceFcfa(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Revenue Calculation Live Preview */}
          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-900">Montant total de la vente estimé :</span>
            <span className="font-black text-emerald-800 text-sm">
              {calculatedTotal.toLocaleString('fr-FR')} FCFA
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Acheteur / Coopérative / Pisteur
            </label>
            <input
              type="text"
              placeholder="ex: Coopérative COOPAZA, Négociant bord champ..."
              value={buyer}
              onChange={(e) => setBuyer(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Notes sur le séchage / fermentation</label>
            <textarea
              rows={2}
              placeholder="ex: Fèves fermentées 6 jours sous feuilles de bananier, séchées au soleil..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none"
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
              className="px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Enregistrement...' : 'Valider la Pesée'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
