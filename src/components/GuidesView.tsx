import React, { useState } from 'react';
import { AgriculturalGuide } from '../lib/api.ts';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Bug,
  Search,
  Sprout,
  HelpCircle,
} from 'lucide-react';

interface GuidesViewProps {
  guides: AgriculturalGuide[];
}

export const GuidesView: React.FC<GuidesViewProps> = ({ guides }) => {
  const [selectedCrop, setSelectedCrop] = useState('Tous');
  const [search, setSearch] = useState('');

  const crops = ['Tous', 'Cacao', 'Anacarde (Cajou)', 'Palmier à huile', 'Manioc'];

  const filteredGuides = guides.filter((g) => {
    const matchesCrop = selectedCrop === 'Tous' || g.cropType.toLowerCase().includes(selectedCrop.toLowerCase());
    const matchesSearch =
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.summary.toLowerCase().includes(search.toLowerCase()) ||
      g.keyRecommendations.toLowerCase().includes(search.toLowerCase());
    return matchesCrop && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>Fiches Techniques & Bonnes Pratiques Agricoles</span>
          <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
            Itinéraires Techniques CNRA / FIRCA
          </span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Protocoles validés pour maximiser le rendement, protéger les sols et sécuriser la récolte
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Rechercher une recommandation, un ravageur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:bg-white transition"
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

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGuides.map((guide) => (
          <div
            key={guide.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md">
                  {guide.cropType}
                </span>
                <span className="text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-600" />
                  {guide.calendarPeriod}
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 mt-3">{guide.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {guide.summary}
              </p>

              {/* Recommendations */}
              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Recommandations Clés du Protocole</span>
                </h4>
                <div className="text-xs text-slate-700 space-y-1.5 bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-100 whitespace-pre-line leading-relaxed">
                  {guide.keyRecommendations}
                </div>
              </div>

              {/* Pests / Diseases */}
              {guide.commonPests && (
                <div className="mt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
                    <Bug className="w-3.5 h-3.5 text-red-500" />
                    <span>Ravageurs & Pathogènes Ciblés</span>
                  </h4>
                  <div className="text-xs text-slate-600 bg-red-50/40 p-3 rounded-xl border border-red-100">
                    {guide.commonPests}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Catégorie : {guide.category}</span>
              <span className="text-emerald-700 font-semibold">Guide validé</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
