import React, { useState } from 'react';
import { Harvest, Parcelle } from '../lib/api.ts';
import {
  Wheat,
  Plus,
  Trash2,
  Calendar,
  Coins,
  TrendingUp,
  Tag,
  Building,
  Filter,
} from 'lucide-react';

interface HarvestsViewProps {
  harvests: Harvest[];
  parcelles: Parcelle[];
  onOpenNewHarvest: () => void;
  onDeleteHarvest: (id: number) => void;
  isAuthenticated: boolean;
  onSignIn: () => void;
}

export const HarvestsView: React.FC<HarvestsViewProps> = ({
  harvests,
  parcelles,
  onOpenNewHarvest,
  onDeleteHarvest,
  isAuthenticated,
  onSignIn,
}) => {
  const [selectedCrop, setSelectedCrop] = useState('Tous');

  const crops = ['Tous', 'Cacao', 'Café', 'Anacarde (Cajou)', 'Palmier à huile', 'Hévéa', 'Manioc', 'Maïs', 'Riz'];

  const filteredHarvests = harvests.filter((h) => {
    return selectedCrop === 'Tous' || h.cropType.toLowerCase().includes(selectedCrop.toLowerCase());
  });

  const totalKg = filteredHarvests.reduce((sum, h) => sum + (h.quantityKg || 0), 0);
  const totalRevenue = filteredHarvests.reduce((sum, h) => {
    if (h.salePriceFcfa && h.quantityKg) {
      return sum + h.salePriceFcfa * h.quantityKg;
    }
    return sum;
  }, 0);
  const avgPrice = totalKg > 0 && totalRevenue > 0 ? Math.round(totalRevenue / totalKg) : 0;

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center max-w-xl mx-auto my-12 shadow-sm">
        <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wheat className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Suivi des Récoltes & Rendements</h3>
        <p className="text-slate-600 text-sm mt-2">
          Connectez-vous pour consigner vos pesées, calculer vos gains aux prix officiels bord champ et archiver vos ventes aux coopératives et pisteurs agréés.
        </p>
        <button
          onClick={onSignIn}
          className="mt-6 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition shadow cursor-pointer"
        >
          Se connecter avec Google
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Suivi des Récoltes & Ventes</span>
            <span className="text-sm font-semibold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
              {harvests.length} pesée{harvests.length > 1 ? 's' : ''}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Historique certifié des pesées, classification des fèves/graines et calcul des recettes
          </p>
        </div>

        <button
          onClick={onOpenNewHarvest}
          className="flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition shadow cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Enregistrer une Récolte</span>
        </button>
      </div>

      {/* Summary KPI banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Volume Récolté</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {totalKg.toLocaleString('fr-FR')} <span className="text-xs font-normal text-slate-500">kg</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recette Totale</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {totalRevenue.toLocaleString('fr-FR')} <span className="text-xs font-normal text-slate-500">FCFA</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prix Moyen au Kilo</span>
          <div className="text-2xl font-black text-amber-700 mt-1">
            {avgPrice > 0 ? `${avgPrice.toLocaleString('fr-FR')} FCFA/kg` : '—'}
          </div>
        </div>
      </div>

      {/* Filter by Crop */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto">
        <Filter className="w-4 h-4 text-slate-400 ml-1 shrink-0" />
        <span className="text-xs font-bold text-slate-600 shrink-0">Filtrer par culture :</span>
        <div className="flex items-center gap-1.5">
          {crops.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCrop(c)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCrop === c
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Harvests Table */}
      {filteredHarvests.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
          <Wheat className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Aucune récolte enregistrée</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {parcelles.length === 0
              ? 'Créez d\'abord une parcelle agricole pour pouvoir lui rattacher vos pesées.'
              : 'Enregistrez votre première pesée pour suivre votre rendement et vos ventes.'}
          </p>
          <button
            onClick={onOpenNewHarvest}
            className="mt-4 inline-flex items-center space-x-1.5 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-4 py-2 rounded-xl transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Enregistrer une pesée</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Parcelle / Exploitation</th>
                  <th className="py-3 px-4">Culture</th>
                  <th className="py-3 px-4">Quantité (kg)</th>
                  <th className="py-3 px-4">Qualité / Grade</th>
                  <th className="py-3 px-4">Prix Unitaire</th>
                  <th className="py-3 px-4">Total Vente</th>
                  <th className="py-3 px-4">Acheteur / Coopérative</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHarvests.map((h) => {
                  const lineTotal = (h.salePriceFcfa || 0) * (h.quantityKg || 0);
                  return (
                    <tr key={h.id} className="hover:bg-amber-50/30 transition">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {h.harvestDate}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {h.parcelleName || `Parcelle #${h.parcelleId}`}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                          {h.cropType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900 text-sm">
                        {h.quantityKg.toLocaleString('fr-FR')} kg
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                          <Tag className="w-3 h-3 text-amber-600" />
                          {h.qualityGrade || 'Standard'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {h.salePriceFcfa ? (
                          <span className="font-semibold">{h.salePriceFcfa.toLocaleString('fr-FR')} FCFA/kg</span>
                        ) : (
                          <span className="text-slate-400 italic">Non renseigné</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-black text-emerald-700 text-sm">
                        {lineTotal > 0 ? `${lineTotal.toLocaleString('fr-FR')} FCFA` : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {h.buyer ? (
                          <span className="flex items-center gap-1">
                            <Building className="w-3 h-3 text-slate-400" />
                            {h.buyer}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            if (confirm('Supprimer cette entrée de récolte ?')) {
                              onDeleteHarvest(h.id);
                            }
                          }}
                          title="Supprimer la récolte"
                          className="w-7 h-7 inline-flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
