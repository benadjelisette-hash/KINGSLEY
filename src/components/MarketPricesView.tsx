import React, { useState } from 'react';
import { MarketPrice } from '../lib/api.ts';
import {
  TrendingUp,
  MapPin,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Scale,
  Search,
} from 'lucide-react';

interface MarketPricesViewProps {
  marketPrices: MarketPrice[];
}

export const MarketPricesView: React.FC<MarketPricesViewProps> = ({ marketPrices }) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filteredPrices = marketPrices.filter((p) => {
    return (
      p.cropType.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.marketLocation.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (p.variety && p.variety.toLowerCase().includes(filterQuery.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>Cours Officiels & Mercuriales des Marchés</span>
          <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full uppercase">
            SIM Côte d'Ivoire
          </span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Barèmes officiels arrêtés par le Conseil du Café-Cacao, le Conseil Coton-Anacarde et l'OCPV
        </p>
      </div>

      {/* Info Notice on guaranteed prices */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 rounded-2xl p-4 border border-emerald-200/90 flex items-start space-x-3 text-xs text-emerald-950">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Réglementation et Prix Garanti Bord Champ :</span>
          <p className="mt-0.5 text-emerald-900/90 leading-relaxed">
            Pour les filières régulées (Café, Cacao, Anacarde), tout acheteur agréé ou coopérative est tenu par la loi de payer au planteur un montant supérieur ou égal au prix garanti fixé pour la campagne, sans réfaction illégale sur fèves ou noix de qualité marchande.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 ml-1" />
        <input
          type="text"
          placeholder="Filtrer par spéculation (Cacao, Anacarde...) ou place marchande..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="w-full text-xs bg-transparent focus:outline-none"
        />
      </div>

      {/* Price Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPrices.map((item) => {
          const isGuaranteed = !!item.guaranteedPriceFcfa;
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md">
                      {item.cropType}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-2">
                      {item.variety || item.cropType}
                    </h3>
                  </div>

                  <span
                    className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.trend === 'hausse'
                        ? 'bg-green-100 text-green-800'
                        : item.trend === 'baisse'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.trend === 'hausse' && '▲ Hausse'}
                    {item.trend === 'baisse' && '▼ Baisse'}
                    {item.trend === 'stable' && '— Stable'}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{item.marketLocation}</span>
                </div>

                <div className="mt-5 space-y-3">
                  {isGuaranteed && (
                    <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200/80">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                        Prix Garanti Bord Champ Fixé
                      </span>
                      <div className="text-xl font-black text-emerald-900 mt-0.5">
                        {item.guaranteedPriceFcfa?.toLocaleString('fr-FR')} FCFA{' '}
                        <span className="text-xs font-normal text-emerald-700">/ {item.unit}</span>
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Fourchette observée
                      </span>
                      <span className="font-extrabold text-slate-800">
                        {item.minPriceFcfa} à {item.maxPriceFcfa} FCFA
                      </span>
                    </div>
                    <Scale className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Relevé du {item.date}
                </span>
                <span className="font-semibold text-slate-600">Unité : {item.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
