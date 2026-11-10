import React, { useState } from 'react';
import { Parcelle } from '../lib/api.ts';
import {
  Layers,
  Plus,
  Trash2,
  MapPin,
  Calendar,
  Wheat,
  Search,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface ParcellesViewProps {
  parcelles: Parcelle[];
  onOpenNewParcelle: () => void;
  onOpenNewHarvestForParcelle: (parcelle: Parcelle) => void;
  onDeleteParcelle: (id: number) => void;
  isAuthenticated: boolean;
  onSignIn: () => void;
}

export const ParcellesView: React.FC<ParcellesViewProps> = ({
  parcelles,
  onOpenNewParcelle,
  onOpenNewHarvestForParcelle,
  onDeleteParcelle,
  isAuthenticated,
  onSignIn,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('Tous');

  const crops = ['Tous', 'Cacao', 'Café', 'Anacarde (Cajou)', 'Palmier à huile', 'Hévéa', 'Manioc', 'Maïs', 'Riz'];

  const filteredParcelles = parcelles.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCrop = selectedCrop === 'Tous' || p.cropType.toLowerCase().includes(selectedCrop.toLowerCase());
    return matchesSearch && matchesCrop;
  });

  const totalHectares = parcelles.reduce((sum, p) => sum + (parseFloat(p.areaHectares) || 0), 0);

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center max-w-xl mx-auto my-12 shadow-sm">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Layers className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Gestion de vos Parcelles Agricoles</h3>
        <p className="text-slate-600 text-sm mt-2">
          Connectez-vous avec votre compte Google pour créer votre registre d'exploitations, cartographier vos surfaces et calculer vos rendements.
        </p>
        <button
          onClick={onSignIn}
          className="mt-6 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition shadow cursor-pointer"
        >
          Se connecter avec Google
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Mes Parcelles Agricoles</span>
            <span className="text-sm font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              {parcelles.length} parcelle{parcelles.length > 1 ? 's' : ''} ({Math.round(totalHectares * 10) / 10} ha)
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Enregistrement cadastral et suivi agronomique de vos exploitations
          </p>
        </div>

        <button
          onClick={onOpenNewParcelle}
          className="flex items-center justify-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition shadow cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une Parcelle</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Rechercher par nom, ville..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {crops.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCrop(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCrop === c
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Parcelles List */}
      {filteredParcelles.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Aucune parcelle trouvée</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {searchTerm || selectedCrop !== 'Tous'
              ? 'Aucun résultat ne correspond à vos critères de recherche.'
              : 'Commencez par enregistrer votre première parcelle de cacao, café, anacarde ou vivrier.'}
          </p>
          <button
            onClick={onOpenNewParcelle}
            className="mt-4 inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une parcelle</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredParcelles.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-emerald-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                      {p.cropType}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-2">{p.name}</h3>
                  </div>
                  <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
                    {p.areaHectares} ha
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{p.location}</span>
                  </div>

                  {p.soilType && (
                    <div className="flex items-center space-x-2">
                      <span className="w-3.5 h-3.5 rounded-full bg-amber-200/80 shrink-0 flex items-center justify-center text-[9px] font-bold text-amber-900">
                        S
                      </span>
                      <span>Type de sol : {p.soilType}</span>
                    </div>
                  )}

                  {p.plantingDate && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Date de mise en place : {p.plantingDate}</span>
                    </div>
                  )}

                  {p.notes && (
                    <div className="flex items-start space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-slate-600 italic leading-snug">{p.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenNewHarvestForParcelle(p)}
                  className="flex-1 inline-flex items-center justify-center space-x-1.5 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 px-3 py-2 rounded-xl transition cursor-pointer"
                >
                  <Wheat className="w-3.5 h-3.5 text-amber-700" />
                  <span>Saisir Récolte</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Confirmez-vous la suppression de la parcelle "${p.name}" ? Toutes les récoltes associées seront également supprimées.`)) {
                      onDeleteParcelle(p.id);
                    }
                  }}
                  title="Supprimer la parcelle"
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
