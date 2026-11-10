import { db } from './index.ts';
import { parcelles, harvests, consultations, marketPrices, agriculturalGuides, users } from './schema.ts';
import { eq, desc, and } from 'drizzle-orm';

// --- Parcelles ---
export async function getParcellesByUserId(userId: number) {
  try {
    return await db
      .select()
      .from(parcelles)
      .where(eq(parcelles.userId, userId))
      .orderBy(desc(parcelles.createdAt));
  } catch (error) {
    console.error('Database query failed in getParcellesByUserId:', error);
    throw new Error('Impossible de charger les parcelles agricoles.', { cause: error });
  }
}

export async function createParcelle(data: {
  userId: number;
  userUid: string;
  name: string;
  cropType: string;
  areaHectares: string;
  location: string;
  soilType?: string;
  plantingDate?: string;
  notes?: string;
}) {
  try {
    const result = await db
      .insert(parcelles)
      .values({
        userId: data.userId,
        userUid: data.userUid,
        name: data.name,
        cropType: data.cropType,
        areaHectares: data.areaHectares,
        location: data.location,
        soilType: data.soilType || 'Sol ferrallitique',
        plantingDate: data.plantingDate || new Date().toISOString().slice(0, 7),
        notes: data.notes || '',
        status: 'active',
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database query failed in createParcelle:', error);
    throw new Error('Impossible d\'enregistrer la nouvelle parcelle.', { cause: error });
  }
}

export async function deleteParcelle(parcelleId: number, userId: number) {
  try {
    const result = await db
      .delete(parcelles)
      .where(and(eq(parcelles.id, parcelleId), eq(parcelles.userId, userId)))
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error('Database query failed in deleteParcelle:', error);
    throw new Error('Impossible de supprimer la parcelle.', { cause: error });
  }
}

// --- Harvests ---
export async function getHarvestsByUserId(userId: number) {
  try {
    return await db
      .select({
        id: harvests.id,
        parcelleId: harvests.parcelleId,
        parcelleName: parcelles.name,
        userId: harvests.userId,
        cropType: harvests.cropType,
        quantityKg: harvests.quantityKg,
        qualityGrade: harvests.qualityGrade,
        salePriceFcfa: harvests.salePriceFcfa,
        harvestDate: harvests.harvestDate,
        buyer: harvests.buyer,
        notes: harvests.notes,
        createdAt: harvests.createdAt,
      })
      .from(harvests)
      .leftJoin(parcelles, eq(harvests.parcelleId, parcelles.id))
      .where(eq(harvests.userId, userId))
      .orderBy(desc(harvests.harvestDate));
  } catch (error) {
    console.error('Database query failed in getHarvestsByUserId:', error);
    throw new Error('Impossible de récupérer l\'historique des récoltes.', { cause: error });
  }
}

export async function createHarvest(data: {
  userId: number;
  parcelleId: number;
  cropType: string;
  quantityKg: number;
  qualityGrade?: string;
  salePriceFcfa?: number;
  harvestDate: string;
  buyer?: string;
  notes?: string;
}) {
  try {
    const result = await db
      .insert(harvests)
      .values({
        userId: data.userId,
        parcelleId: data.parcelleId,
        cropType: data.cropType,
        quantityKg: data.quantityKg,
        qualityGrade: data.qualityGrade || 'Standard',
        salePriceFcfa: data.salePriceFcfa || null,
        harvestDate: data.harvestDate,
        buyer: data.buyer || null,
        notes: data.notes || '',
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database query failed in createHarvest:', error);
    throw new Error('Impossible d\'enregistrer la récolte.', { cause: error });
  }
}

export async function deleteHarvest(harvestId: number, userId: number) {
  try {
    const result = await db
      .delete(harvests)
      .where(and(eq(harvests.id, harvestId), eq(harvests.userId, userId)))
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error('Database query failed in deleteHarvest:', error);
    throw new Error('Impossible de supprimer la récolte.', { cause: error });
  }
}

// --- Consultations (Diagnostic & Conseil) ---
export async function getConsultations(userId?: number) {
  try {
    if (userId) {
      return await db
        .select({
          id: consultations.id,
          userId: consultations.userId,
          authorName: users.displayName,
          parcelleId: consultations.parcelleId,
          parcelleName: parcelles.name,
          title: consultations.title,
          category: consultations.category,
          cropType: consultations.cropType,
          urgency: consultations.urgency,
          description: consultations.description,
          status: consultations.status,
          advisorResponse: consultations.advisorResponse,
          advisorName: consultations.advisorName,
          createdAt: consultations.createdAt,
          resolvedAt: consultations.resolvedAt,
        })
        .from(consultations)
        .leftJoin(parcelles, eq(consultations.parcelleId, parcelles.id))
        .leftJoin(users, eq(consultations.userId, users.id))
        .where(eq(consultations.userId, userId))
        .orderBy(desc(consultations.createdAt));
    }

    // Community view / agronomist advisory pool
    return await db
      .select({
        id: consultations.id,
        userId: consultations.userId,
        authorName: users.displayName,
        parcelleId: consultations.parcelleId,
        parcelleName: parcelles.name,
        title: consultations.title,
        category: consultations.category,
        cropType: consultations.cropType,
        urgency: consultations.urgency,
        description: consultations.description,
        status: consultations.status,
        advisorResponse: consultations.advisorResponse,
        advisorName: consultations.advisorName,
        createdAt: consultations.createdAt,
        resolvedAt: consultations.resolvedAt,
      })
      .from(consultations)
      .leftJoin(parcelles, eq(consultations.parcelleId, parcelles.id))
      .leftJoin(users, eq(consultations.userId, users.id))
      .orderBy(desc(consultations.createdAt))
      .limit(50);
  } catch (error) {
    console.error('Database query failed in getConsultations:', error);
    throw new Error('Impossible de charger les demandes de conseil agronomique.', { cause: error });
  }
}

export async function createConsultation(data: {
  userId: number;
  parcelleId?: number | null;
  title: string;
  category: string;
  cropType: string;
  urgency: string;
  description: string;
}) {
  try {
    const result = await db
      .insert(consultations)
      .values({
        userId: data.userId,
        parcelleId: data.parcelleId || null,
        title: data.title,
        category: data.category,
        cropType: data.cropType,
        urgency: data.urgency || 'normale',
        description: data.description,
        status: 'en_attente',
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database query failed in createConsultation:', error);
    throw new Error('Impossible de soumettre la demande de conseil.', { cause: error });
  }
}

export async function answerConsultation(data: {
  consultationId: number;
  advisorResponse: string;
  advisorName: string;
}) {
  try {
    const result = await db
      .update(consultations)
      .set({
        advisorResponse: data.advisorResponse,
        advisorName: data.advisorName,
        status: 'resolu',
        resolvedAt: new Date(),
      })
      .where(eq(consultations.id, data.consultationId))
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error('Database query failed in answerConsultation:', error);
    throw new Error('Impossible d\'enregistrer la réponse du conseiller.', { cause: error });
  }
}

// --- Market Prices ---
export async function getMarketPrices() {
  try {
    return await db
      .select()
      .from(marketPrices)
      .orderBy(marketPrices.cropType);
  } catch (error) {
    console.error('Database query failed in getMarketPrices:', error);
    throw new Error('Impossible de charger les cours des marchés agricoles.', { cause: error });
  }
}

// --- Agricultural Guides ---
export async function getAgriculturalGuides() {
  try {
    return await db
      .select()
      .from(agriculturalGuides)
      .orderBy(agriculturalGuides.cropType);
  } catch (error) {
    console.error('Database query failed in getAgriculturalGuides:', error);
    throw new Error('Impossible de charger les fiches techniques agricoles.', { cause: error });
  }
}

// --- Dashboard Aggregated Metrics ---
export async function getDashboardStats(userId: number) {
  try {
    const userParcelles = await db
      .select()
      .from(parcelles)
      .where(eq(parcelles.userId, userId));

    const userHarvests = await db
      .select()
      .from(harvests)
      .where(eq(harvests.userId, userId));

    const userConsultations = await db
      .select()
      .from(consultations)
      .where(eq(consultations.userId, userId));

    const totalArea = userParcelles.reduce((sum, p) => sum + (parseFloat(p.areaHectares) || 0), 0);
    const totalHarvestKg = userHarvests.reduce((sum, h) => sum + (h.quantityKg || 0), 0);
    const totalRevenueFcfa = userHarvests.reduce((sum, h) => {
      if (h.salePriceFcfa && h.quantityKg) {
        return sum + (h.salePriceFcfa * h.quantityKg);
      }
      return sum;
    }, 0);
    const pendingConsultations = userConsultations.filter(c => c.status === 'en_attente').length;
    const resolvedConsultations = userConsultations.filter(c => c.status === 'resolu').length;

    return {
      parcellesCount: userParcelles.length,
      totalAreaHectares: Math.round(totalArea * 10) / 10,
      totalHarvestKg,
      totalRevenueFcfa,
      pendingConsultations,
      resolvedConsultations,
    };
  } catch (error) {
    console.error('Database query failed in getDashboardStats:', error);
    throw new Error('Impossible de calculer les statistiques du tableau de bord.', { cause: error });
  }
}
