import React, { useState } from 'react';
import { Consultation, Parcelle } from '../lib/api.ts';
import {
  MessageSquare,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  Send,
  HelpCircle,
  Filter,
} from 'lucide-react';

interface ConsultationsViewProps {
  consultations: Consultation[];
  parcelles: Parcelle[];
  onOpenNewConsultation: () => void;
  onAnswerConsultation: (id: number, response: string) => Promise<void>;
  isAuthenticated: boolean;
  onSignIn: () => void;
}

export const ConsultationsView: React.FC<ConsultationsViewProps> = ({
  consultations,
  parcelles,
  onOpenNewConsultation,
  onAnswerConsultation,
  isAuthenticated,
  onSignIn,
}) => {
  const [filterStatus, setFilterStatus] = useState<'tous' | 'en_attente' | 'resolu'>('tous');
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  const filteredConsultations = consultations.filter((c) => {
    if (filterStatus === 'tous') return true;
    return c.status === filterStatus;
  });

  const handleSendReply = async (id: number) => {
    if (!replyText.trim()) return;
    try {
      setSubmittingReply(true);
      await onAnswerConsultation(id, replyText);
      setActiveReplyId(null);
      setReplyText('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Conseil & Diagnostic Agronomique</span>
            <span className="text-sm font-semibold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
              {consultations.length} demande{consultations.length > 1 ? 's' : ''}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Assistance technique personnalisée par nos ingénieurs agronomes certifiés
          </p>
        </div>

        <button
          onClick={isAuthenticated ? onOpenNewConsultation : onSignIn}
          className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition shadow cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Poser une Question Agronome</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400 ml-1" />
          <button
            onClick={() => setFilterStatus('tous')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              filterStatus === 'tous'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Toutes ({consultations.length})
          </button>
          <button
            onClick={() => setFilterStatus('en_attente')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              filterStatus === 'en_attente'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            En attente d'avis ({consultations.filter((c) => c.status === 'en_attente').length})
          </button>
          <button
            onClick={() => setFilterStatus('resolu')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              filterStatus === 'resolu'
                ? 'bg-green-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Conseils formulés ({consultations.filter((c) => c.status === 'resolu').length})
          </button>
        </div>
      </div>

      {/* Consultations List */}
      {filteredConsultations.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Aucune demande de conseil trouvée</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Vous avez un doute sur un symptôme foliaire, une invasion d'insectes, le dosage d'engrais NPK ou le calendrier de taille ? Posez votre question.
          </p>
          <button
            onClick={isAuthenticated ? onOpenNewConsultation : onSignIn}
            className="mt-4 inline-flex items-center space-x-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Créer une demande de diagnostic</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredConsultations.map((c) => {
            const isResolved = c.status === 'resolu';
            const isReplying = activeReplyId === c.id;

            return (
              <div
                key={c.id}
                className={`bg-white rounded-2xl border p-5 transition shadow-xs ${
                  isResolved ? 'border-slate-200' : 'border-amber-200/90 bg-amber-50/15'
                }`}
              >
                {/* Consultation Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        c.urgency === 'urgente'
                          ? 'bg-red-100 text-red-800'
                          : c.urgency === 'faible'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      Urgence : {c.urgency}
                    </span>
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-full">
                      {c.category}
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full">
                      {c.cropType}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    {isResolved ? (
                      <span className="inline-flex items-center gap-1 font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Diagnostic rendu</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                        <Clock className="w-3.5 h-3.5" />
                        <span>En cours d'examen</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Consultation Body */}
                <div className="mt-3">
                  <h3 className="text-base font-extrabold text-slate-900">{c.title}</h3>
                  <p className="text-xs text-slate-700 mt-2 leading-relaxed whitespace-pre-line bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    {c.description}
                  </p>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-2.5">
                    <span>Auteur : {c.authorName || 'Exploitant Agricole'}</span>
                    {c.parcelleName && (
                      <>
                        <span>•</span>
                        <span>Parcelle liée : {c.parcelleName}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>Date : {new Date(c.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                {/* Advisor Response Section */}
                {isResolved && c.advisorResponse && (
                  <div className="mt-4 bg-gradient-to-r from-emerald-50 to-green-50/70 rounded-xl p-4 border border-emerald-200">
                    <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs mb-1.5">
                      <UserCheck className="w-4 h-4 text-emerald-700" />
                      <span>Recommandation du Conseiller Agronome ({c.advisorName || 'Ingénieur Conseil'})</span>
                    </div>
                    <p className="text-xs text-emerald-950 leading-relaxed whitespace-pre-line">
                      {c.advisorResponse}
                    </p>
                  </div>
                )}

                {/* Reply Form toggle for advisors or community */}
                {!isResolved && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    {!isReplying ? (
                      <button
                        onClick={() => {
                          if (!isAuthenticated) {
                            onSignIn();
                            return;
                          }
                          setActiveReplyId(c.id);
                        }}
                        className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Formuler un conseil agronomique</span>
                      </button>
                    ) : (
                      <div className="space-y-3 bg-blue-50/60 p-4 rounded-xl border border-blue-200/80">
                        <label className="block text-xs font-bold text-blue-950">
                          Votre recommandation agronomique (traitements préconisés, doses, mesures prophylactiques) :
                        </label>
                        <textarea
                          rows={3}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Indiquez le diagnostic précis et les étapes correctives..."
                          className="w-full p-3 text-xs bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setActiveReplyId(null);
                              setReplyText('');
                            }}
                            className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={() => handleSendReply(c.id)}
                            disabled={submittingReply || !replyText.trim()}
                            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-1.5 rounded-lg text-xs disabled:opacity-50 transition cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>{submittingReply ? 'Envoi...' : 'Publier le conseil'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
