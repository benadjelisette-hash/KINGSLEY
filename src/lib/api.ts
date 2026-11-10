export interface Parcelle {
  id: number;
  userId: number;
  userUid: string;
  name: string;
  cropType: string;
  areaHectares: string;
  location: string;
  soilType: string | null;
  plantingDate: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
}

export interface Harvest {
  id: number;
  parcelleId: number;
  parcelleName: string | null;
  userId: number;
  cropType: string;
  quantityKg: number;
  qualityGrade: string | null;
  salePriceFcfa: number | null;
  harvestDate: string;
  buyer: string | null;
  notes: string | null;
  createdAt: string;
}

export interface Consultation {
  id: number;
  userId: number;
  authorName: string | null;
  parcelleId: number | null;
  parcelleName: string | null;
  title: string;
  category: string;
  cropType: string;
  urgency: 'faible' | 'normale' | 'urgente';
  description: string;
  status: 'en_attente' | 'en_cours' | 'resolu';
  advisorResponse: string | null;
  advisorName: string | null;
  createdAt: string;
  resolvedAt: string | null;
}

export interface MarketPrice {
  id: number;
  cropType: string;
  variety: string | null;
  marketLocation: string;
  minPriceFcfa: number;
  maxPriceFcfa: number;
  guaranteedPriceFcfa: number | null;
  unit: string;
  trend: 'hausse' | 'baisse' | 'stable';
  date: string;
  updatedAt: string;
}

export interface AgriculturalGuide {
  id: number;
  cropType: string;
  title: string;
  category: string;
  calendarPeriod: string;
  summary: string;
  keyRecommendations: string;
  commonPests: string | null;
  createdAt: string;
}

export interface DashboardStats {
  parcellesCount: number;
  totalAreaHectares: number;
  totalHarvestKg: number;
  totalRevenueFcfa: number;
  pendingConsultations: number;
  resolvedConsultations: number;
}

const authHeaders = (token?: string | null) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Dashboard
  async getDashboard(token: string): Promise<DashboardStats> {
    const res = await fetch('/api/dashboard', { headers: authHeaders(token) });
    if (!res.ok) throw new Error('Impossible de charger les statistiques');
    return res.json();
  },

  // Parcelles
  async getParcelles(token: string): Promise<Parcelle[]> {
    const res = await fetch('/api/parcelles', { headers: authHeaders(token) });
    if (!res.ok) throw new Error('Impossible de charger les parcelles');
    return res.json();
  },

  async createParcelle(token: string, data: Partial<Parcelle>): Promise<Parcelle> {
    const res = await fetch('/api/parcelles', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erreur lors de la création de la parcelle');
    }
    return res.json();
  },

  async deleteParcelle(token: string, id: number): Promise<void> {
    const res = await fetch(`/api/parcelles/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    });
    if (!res.ok) throw new Error('Erreur lors de la suppression');
  },

  // Harvests
  async getHarvests(token: string): Promise<Harvest[]> {
    const res = await fetch('/api/harvests', { headers: authHeaders(token) });
    if (!res.ok) throw new Error('Impossible de charger les récoltes');
    return res.json();
  },

  async createHarvest(token: string, data: Partial<Harvest>): Promise<Harvest> {
    const res = await fetch('/api/harvests', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erreur lors de l\'enregistrement de la récolte');
    }
    return res.json();
  },

  async deleteHarvest(token: string, id: number): Promise<void> {
    const res = await fetch(`/api/harvests/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    });
    if (!res.ok) throw new Error('Erreur suppression récolte');
  },

  // Consultations
  async getConsultations(token?: string | null): Promise<Consultation[]> {
    const res = await fetch('/api/consultations', { headers: authHeaders(token) });
    if (!res.ok) throw new Error('Impossible de charger les consultations');
    return res.json();
  },

  async createConsultation(token: string, data: {
    title: string;
    category: string;
    cropType: string;
    urgency: string;
    description: string;
    parcelleId?: number | null;
  }): Promise<Consultation> {
    const res = await fetch('/api/consultations', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erreur lors de la soumission de la consultation');
    }
    return res.json();
  },

  async answerConsultation(token: string, id: number, advisorResponse: string): Promise<Consultation> {
    const res = await fetch(`/api/consultations/${id}/reply`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({ advisorResponse }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erreur lors de l\'enregistrement du conseil');
    }
    return res.json();
  },

  // Market Prices & Guides (Public)
  async getMarketPrices(): Promise<MarketPrice[]> {
    const res = await fetch('/api/market-prices');
    if (!res.ok) throw new Error('Impossible de charger les cours des marchés');
    return res.json();
  },

  async getGuides(): Promise<AgriculturalGuide[]> {
    const res = await fetch('/api/guides');
    if (!res.ok) throw new Error('Impossible de charger les guides agricoles');
    return res.json();
  },

  // User Profile
  async updateProfile(token: string, data: { displayName?: string; role?: string; phone?: string; region?: string }) {
    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erreur mise à jour profil');
    return res.json();
  },
};
