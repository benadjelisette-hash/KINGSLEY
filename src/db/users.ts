import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export interface UserProfileData {
  uid: string;
  email: string;
  displayName?: string | null;
  role?: string;
  phone?: string | null;
  region?: string | null;
}

export async function getOrCreateUser(userData: UserProfileData) {
  try {
    const result = await db
      .insert(users)
      .values({
        uid: userData.uid,
        email: userData.email,
        displayName: userData.displayName || 'Agriculteur',
        role: userData.role || 'agriculteur',
        phone: userData.phone || null,
        region: userData.region || 'Abidjan',
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email: userData.email,
          ...(userData.displayName ? { displayName: userData.displayName } : {}),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed in getOrCreateUser:', error);
    throw new Error('Database operation failed while synchronizing user profile.', { cause: error });
  }
}

export async function getUserByUid(uid: string) {
  try {
    const result = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Database query failed in getUserByUid:', error);
    throw new Error('Database query failed while fetching user profile.', { cause: error });
  }
}

export async function updateUserProfile(uid: string, updates: Partial<{ displayName: string; role: string; phone: string; region: string }>) {
  try {
    const result = await db
      .update(users)
      .set(updates)
      .where(eq(users.uid, uid))
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error('Database query failed in updateUserProfile:', error);
    throw new Error('Database query failed while updating user profile.', { cause: error });
  }
}
