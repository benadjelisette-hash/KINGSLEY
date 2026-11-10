import { Router, Response } from 'express';
import { requireAuth, optionalAuth, AuthRequest } from '../middleware/auth.ts';
import { getOrCreateUser, getUserByUid, updateUserProfile } from '../db/users.ts';
import {
  getParcellesByUserId,
  createParcelle,
  deleteParcelle,
  getHarvestsByUserId,
  createHarvest,
  deleteHarvest,
  getConsultations,
  createConsultation,
  answerConsultation,
  getMarketPrices,
  getAgriculturalGuides,
  getDashboardStats,
} from '../db/queries.ts';

export const apiRouter = Router();

// Helper to get or create DB user from authenticated Firebase request
async function getDbUser(req: AuthRequest) {
  if (!req.user || !req.user.uid) {
    throw new Error('Utilisateur non authentifié');
  }
  return await getOrCreateUser({
    uid: req.user.uid,
    email: req.user.email || 'non-specifie@agriconseil.ci',
    displayName: req.user.name || (req.user.email ? req.user.email.split('@')[0] : 'Agriculteur'),
  });
}

// 1. Auth Sync
apiRouter.post('/auth/sync', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await getDbUser(req);
    res.json({ success: true, user });
  } catch (error: any) {
    console.error('Error syncing user:', error);
    res.status(500).json({ error: error.message || 'Erreur lors de la synchronisation du profil' });
  }
});

// 2. Profile
apiRouter.get('/user/profile', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await getDbUser(req);
    res.json(user);
  } catch (error: any) {
    console.error('Error getting profile:', error);
    res.status(500).json({ error: error.message || 'Erreur profil' });
  }
});

apiRouter.put('/user/profile', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.uid) {
      return res.status(401).json({ error: 'Non authentifié' });
    }
    const { displayName, role, phone, region } = req.body;
    const updated = await updateUserProfile(req.user.uid, { displayName, role, phone, region });
    res.json(updated);
  } catch (error: any) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: error.message || 'Erreur mise à jour profil' });
  }
});

// 3. Dashboard stats
apiRouter.get('/dashboard', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await getDbUser(req);
    const stats = await getDashboardStats(user.id);
    res.json(stats);
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: error.message || 'Erreur statistiques' });
  }
});

// 4. Parcelles
apiRouter.get('/parcelles', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await getDbUser(req);
    const list = await getParcellesByUserId(user.id);
    res.json(list);
  } catch (error: any) {
    console.error('Error fetching parcelles:', error);
    res.status(500).json({ error: error.message || 'Erreur parcelles' });
  }
});

apiRouter.post('/parcelles', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await getDbUser(req);
    const { name, cropType, areaHectares, location, soilType, plantingDate, notes } = req.body;
    if (!name || !cropType || !areaHectares || !location) {
      return res.status(400).json({ error: 'Champs requis manquants (nom, culture, superficie, localisation)' });
    }
    const created = await createParcelle({
      userId: user.id,
      userUid: user.uid,
      name,
      cropType,
      areaHectares: String(areaHectares),
      location,
      soilType,
      plantingDate,
      notes,
    });
    res.status(201).json(created);
  } catch (error: any) {
    console.error('Error creating parcelle:', error);
    res.status(500).json({ error: error.message || 'Erreur création parcelle' });
  }
});

apiRouter.delete('/parcelles/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await getDbUser(req);
    const parcelleId = parseInt(req.params.id, 10);
    const deleted = await deleteParcelle(parcelleId, user.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Parcelle non trouvée ou non autorisée' });
    }
    res.json({ success: true, deleted });
  } catch (error: any) {
    console.error('Error deleting parcelle:', error);
    res.status(500).json({ error: error.message || 'Erreur suppression parcelle' });
  }
});

// 5. Harvests
apiRouter.get('/harvests', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await getDbUser(req);
    const list = await getHarvestsByUserId(user.id);
    res.json(list);
  } catch (error: any) {
    console.error('Error fetching harvests:', error);
    res.status(500).json({ error: error.message || 'Erreur récoltes' });
  }
});

apiRouter.post('/harvests', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await getDbUser(req);
    const { parcelleId, cropType, quantityKg, qualityGrade, salePriceFcfa, harvestDate, buyer, notes } = req.body;
    if (!parcelleId || !cropType || !quantityKg || !harvestDate) {
      return res.status(400).json({ error: 'Champs requis manquants (parcelle, culture, quantité kg, date)' });
    }
    const created = await createHarvest({
      userId: user.id,
      parcelleId: Number(parcelleId),
      cropType,
      quantityKg: Number(quantityKg),
      qualityGrade,
      salePriceFcfa: salePriceFcfa ? Number(salePriceFcfa) : undefined,
      harvestDate,
      buyer,
      notes,
    });
    res.status(201).json(created);
  } catch (error: any) {
    console.error('Error creating harvest:', error);
    res.status(500).json({ error: error.message || 'Erreur enregistrement récolte' });
  }
});

apiRouter.delete('/harvests/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await getDbUser(req);
    const harvestId = parseInt(req.params.id, 10);
    const deleted = await deleteHarvest(harvestId, user.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Récolte introuvable' });
    }
    res.json({ success: true, deleted });
  } catch (error: any) {
    console.error('Error deleting harvest:', error);
    res.status(500).json({ error: error.message || 'Erreur suppression récolte' });
  }
});

// 6. Consultations (Conseil & Diagnostic)
apiRouter.get('/consultations', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    let userId: number | undefined;
    if (req.user?.uid) {
      const user = await getUserByUid(req.user.uid);
      if (user) {
        userId = user.id;
      }
    }
    // If authenticated, get user consultations, otherwise community list
    const list = await getConsultations(userId);
    res.json(list);
  } catch (error: any) {
    console.error('Error fetching consultations:', error);
    res.status(500).json({ error: error.message || 'Erreur consultations' });
  }
});

apiRouter.post('/consultations', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await getDbUser(req);
    const { parcelleId, title, category, cropType, urgency, description } = req.body;
    if (!title || !category || !cropType || !description) {
      return res.status(400).json({ error: 'Champs requis manquants (titre, catégorie, culture, description)' });
    }
    const created = await createConsultation({
      userId: user.id,
      parcelleId: parcelleId ? Number(parcelleId) : null,
      title,
      category,
      cropType,
      urgency: urgency || 'normale',
      description,
    });
    res.status(201).json(created);
  } catch (error: any) {
    console.error('Error creating consultation:', error);
    res.status(500).json({ error: error.message || 'Erreur création consultation' });
  }
});

apiRouter.post('/consultations/:id/reply', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await getDbUser(req);
    const consultationId = parseInt(req.params.id, 10);
    const { advisorResponse } = req.body;
    if (!advisorResponse || !advisorResponse.trim()) {
      return res.status(400).json({ error: 'Réponse vide' });
    }
    const advisorName = user.displayName || 'Conseiller Agronome AgriConseil';
    const updated = await answerConsultation({
      consultationId,
      advisorResponse: advisorResponse.trim(),
      advisorName,
    });
    res.json(updated);
  } catch (error: any) {
    console.error('Error answering consultation:', error);
    res.status(500).json({ error: error.message || 'Erreur réponse consultation' });
  }
});

// 7. Market Prices (Public / SIM CI)
apiRouter.get('/market-prices', async (_req, res: Response) => {
  try {
    const prices = await getMarketPrices();
    res.json(prices);
  } catch (error: any) {
    console.error('Error fetching market prices:', error);
    res.status(500).json({ error: error.message || 'Erreur mercuriales de marché' });
  }
});

// 8. Agricultural Guides (Public)
apiRouter.get('/guides', async (_req, res: Response) => {
  try {
    const guides = await getAgriculturalGuides();
    res.json(guides);
  } catch (error: any) {
    console.error('Error fetching guides:', error);
    res.status(500).json({ error: error.message || 'Erreur fiches techniques' });
  }
});
