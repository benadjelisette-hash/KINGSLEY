import React from 'react';
import { DashboardStats, MarketPrice, Parcelle, Harvest, Consultation } from '../lib/api.ts';
import {
  MapPin,
  TrendingUp,
  Layers,
  Wheat,
  Coins,
  MessageSquare,
  AlertTriangle,
  Sun,
  PlusCircle,
  Calendar,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface DashboardViewProps {
  stats: DashboardStats | null;
  parcelles: Parcelle[];
  harvests: Harvest[];
  consultations: Consultation[];
  marketPrices: MarketPrice[];
  onNavigateTab: (tab: string) => void;
  onOpenNewParcelle: () => void;
  onOpenNewHarvest: () => void;
  onOpenNewConsultation: () => void;
  isAuthenticated: boolean;
  onSignIn: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  parcelles,
  harvests,
  consultations,
  marketPrices,
  onNavigateTab,
  onOpenNewParcelle,
  onOpenNewHarvest,
  onOpenNewConsultation,
  isAuthenticated,
  onSignIn,
}) => {
  return (
    <div className="space-y-6">
      {/* Banner for non-logged-in visitors */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-emerald-850 via-emerald-800 to-green-800 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold flex items-center gap-2">
              <span>Bienvenue sur AgriConseil CI</span>
            </h2>
            <p className="text-emerald-100 text-sm mt-1 max-w-2xl">
              Connectez-vous avec votre compte Google pour gérer vos parcelles agricoles en Côte d'Ivoire, enregistrer vos récoltes, suivre vos revenus en FCFA et consulter nos ingénieurs agronomes en temps réel.
            </p>
          </div>
          <button
            onClick={onSignIn}
            className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold px-5 py-2.5 rounded-xl text-sm transition shrink-0 shadow cursor-pointer"
          >
            Se connecter pour démarrer
          </button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Parcelles */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Parcelles Actives</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900">
              {stats?.parcellesCount ?? parcelles.length}
            </span>
            <span className="text-xs text-slate-500 ml-2">exploitations</span>
          </div>
          <div className="mt-2 text-xs text-emerald-700 font-medium flex items-center">
            <span>{stats?.totalAreaHectares ?? 0} hectares recensés</span>
          </div>
        </div>

        {/* Total Harvests */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Récoltes Cumulées</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Wheat className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900">
              {(stats?.totalHarvestKg ?? 0).toLocaleString('fr-FR')}
            </span>
            <span className="text-xs text-slate-500 ml-1">kg</span>
          </div>
          <div className="mt-2 text-xs text-amber-700 font-medium">
            {harvests.length} pesées enregistrées
          </div>
        </div>

        {/* Total Revenues */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Revenu Agricole Estimé</span>
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900">
              {(stats?.totalRevenueFcfa ?? 0).toLocaleString('fr-FR')}
            </span>
            <span className="text-xs text-slate-500 ml-1">FCFA</span>
          </div>
          <div className="mt-2 text-xs text-green-700 font-medium flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            <span>Ventes bord champ</span>
          </div>
        </div>

        {/* Consultations */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Conseil & Diagnostic</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900">
              {stats?.pendingConsultations ?? 0}
            </span>
            <span className="text-xs text-slate-500 ml-1">en attente</span>
          </div>
          <div className="mt-2 text-xs text-blue-600 font-medium">
            {stats?.resolvedConsultations ?? 0} diagnostics résolus
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1">Actions Rapides :</span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenNewParcelle}
            className="flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold px-3.5 py-2 rounded-xl text-xs transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>Nouvelle Parcelle</span>
          </button>
          <button
            onClick={onOpenNewHarvest}
            className="flex items-center space-x-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold px-3.5 py-2 rounded-xl text-xs transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-amber-600" />
            <span>Saisir une Récolte</span>
          </button>
          <button
            onClick={onOpenNewConsultation}
            className="flex items-center space-x-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold px-3.5 py-2 rounded-xl text-xs transition cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>Poser une Question Agronome</span>
          </button>
        </div>
      </div>

      {/* Grid: Weather & Agronomic Alerts + Live Market Prices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather & Seasonal Advisory */}
        <div className="lg:col-span-1 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/50 rounded-2xl p-5 border border-amber-200/70 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-600" />
                <span>Bulletin Agro-Météo CI</span>
              </span>
              <span className="bg-amber-200 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Saison 2026/2027
              </span>
            </div>

            <div className="mt-4">
              <h4 className="text-base font-bold text-amber-950">
                Grande Campagne Café-Cacao & Préparation
              </h4>
              <p className="text-xs text-amber-900/80 mt-1.5 leading-relaxed">
                Les conditions de séchage sont optimales dans les régions de Divo, Soubré, San-Pédro et Abengourou. Veillez à retourner les claies de cacao au moins 2 fois par jour pour prévenir le développement de moisissures internes.
              </p>
            </div>

            <div className="mt-4 space-y-2.5">
              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-amber-200/50 text-xs">
                <div className="flex items-center space-x-2 text-amber-900 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Vigilance Miriades & Pourriture Brune</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-1">
                  Élaguer les branches basses ombragées et traiter au biopesticide homologué dès les premiers signes de piqûres.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-amber-200/50 text-xs">
                <div className="flex items-center space-x-2 text-amber-900 font-bold">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>Anacardier / Cajou</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-1">
                  Désherbage sous frondaison indispensable dans le Zanzan et les Savanes avant la floraison massive.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs text-amber-900 font-semibold">
            <span>Guide des pratiques culturales</span>
            <button
              onClick={() => onNavigateTab('guides')}
              className="text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
            >
              Consulter <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Market Price Snapshot */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span>Mercuriales & Cours Officiels (SIM Côte d'Ivoire)</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  PostgreSQL Sync
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Prix garantis bord champ fixés par l'État et relevés des marchés de gros
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('market')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
            >
              Voir tout <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Culture / Variété</th>
                  <th className="py-2.5 px-3">Marché / Bourse</th>
                  <th className="py-2.5 px-3">Prix Garanti</th>
                  <th className="py-2.5 px-3">Fourchette Actuelle</th>
                  <th className="py-2.5 px-3">Tendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {marketPrices.slice(0, 5).map((price) => (
                  <tr key={price.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 block">{price.cropType}</span>
                      <span className="text-[11px] text-slate-500">{price.variety || 'Qualité standard'}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {price.marketLocation}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {price.guaranteedPriceFcfa ? (
                        <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {price.guaranteedPriceFcfa} FCFA/{price.unit}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Prix libre</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">
                      {price.minPriceFcfa} - {price.maxPriceFcfa} FCFA
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          price.trend === 'hausse'
                            ? 'bg-green-100 text-green-800'
                            : price.trend === 'baisse'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {price.trend === 'hausse' && '▲ Hausse'}
                        {price.trend === 'baisse' && '▼ Baisse'}
                        {price.trend === 'stable' && '— Stable'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Two columns: Recent Parcelles + Recent Consultations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Parcelles */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-base">Vos Dernières Parcelles</h3>
            <button
              onClick={() => onNavigateTab('parcelles')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
            >
              Gérer ({parcelles.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {parcelles.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <Layers className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p>Aucune parcelle agricole enregistrée pour l'instant.</p>
              {isAuthenticated && (
                <button
                  onClick={onOpenNewParcelle}
                  className="mt-3 text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  + Ajouter votre première plantation
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {parcelles.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-emerald-200 bg-slate-50/50 hover:bg-emerald-50/30 transition"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{p.name}</h4>
                    <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                      <span className="font-semibold text-emerald-800">{p.cropType}</span>
                      <span>•</span>
                      <span>{p.areaHectares} ha</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-slate-500">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {p.location}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Consultations */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-base">Conseils & Diagnostics Récents</h3>
            <button
              onClick={() => onNavigateTab('consultations')}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
            >
              Tout voir ({consultations.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {consultations.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p>Aucune consultation soumise.</p>
              <button
                onClick={onOpenNewConsultation}
                className="mt-3 text-blue-700 font-bold hover:underline cursor-pointer"
              >
                + Poser une question à un agronome
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {consultations.slice(0, 3).map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-blue-50/30 transition text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 truncate max-w-[240px]">
                      {c.title}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        c.status === 'resolu'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.status === 'resolu' ? 'Résolu' : 'En attente'}
                    </span>
                  </div>
                  <p className="text-slate-600 line-clamp-2">{c.description}</p>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-2">
                    <span className="font-medium text-slate-700">{c.cropType}</span>
                    <span>•</span>
                    <span>{c.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
