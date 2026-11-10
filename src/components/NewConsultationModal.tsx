import React, { useState } from 'react';
import { X, MessageSquare, AlertTriangle } from 'lucide-react';
import { Parcelle } from '../lib/api.ts';

interface NewConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  parcelles: Parcelle[];
  onSubmit: (data: {
    title: string;
    category: string;
    cropType: string;
    urgency: string;
    description: string;
    parcelleId?: number | null;
  }) => Promise<void>;
}

export const NewConsultationModal: React.FC<NewConsultationModalProps> = ({
  isOpen,
  onClose,
  parcelles,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Maladie / Ravageur');
  const [cropType, setCropType] = useState('Cacao');
  const [urgency, setUrgency] = useState('normale');
  const [parcelleId, setParcelleId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Veuillez remplir le titre et la description détaillée');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSubmit({
        title: title.trim(),
        category,
        cropType,
        urgency,
        description: description.trim(),
        parcelleId: parcelleId ? Number(parcelleId) : null,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la soumission de la consultation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Demande de Conseil ou Diagnostic</h3>
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
              Sujet / Problème constaté *
            </label>
            <input
              type="text"
              required
              placeholder="ex: Dessèchement des feuilles supérieures et piqûres sombres..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Catégorie *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
              >
                <option value="Maladie / Ravageur">Maladie / Ravageur</option>
                <option value="Fertilisation & Sol">Fertilisation & Sol</option>
                <option value="Traitement Phytosanitaire">Traitement Phytosanitaire</option>
                <option value="Taille & Régénération">Taille & Régénération</option>
                <option value="Irrigation & Climat">Irrigation & Climat</option>
                <option value="Semences & Clones">Semences & Clones</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Culture concernée *</label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
              >
                <option value="Cacao">Cacao</option>
                <option value="Café">Café</option>
                <option value="Anacarde (Cajou)">Anacarde (Cajou)</option>
                <option value="Palmier à huile">Palmier à huile</option>
                <option value="Hévéa">Hévéa</option>
                <option value="Manioc">Manioc</option>
                <option value="Maïs">Maïs</option>
                <option value="Riz">Riz</option>
                <option value="Maraîchage">Maraîchage</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Niveau d'urgence</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
              >
                <option value="normale">Normale (Sous 48h)</option>
                <option value="urgente">Urgente (Attaque sévère)</option>
                <option value="faible">Faible (Conseil général)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Parcelle associée</label>
              <select
                value={parcelleId}
                onChange={(e) => setParcelleId(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
              >
                <option value="">Aucune parcelle spécifique</option>
                {parcelles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.cropType})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Description détaillée des symptômes ou de la demande *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Décrivez les symptômes : couleur des feuilles, présence de larves ou trous dans l'écorce, date d'apparition, traitements déjà tentés..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
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
              className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Soumission...' : 'Envoyer au Conseiller'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
