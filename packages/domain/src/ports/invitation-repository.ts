import type { Invitation } from '../entities/invitation';

/** Taklifnomalar ombori (port). Infrastructure Supabase bilan amalga oshiradi. */
export interface InvitationRepository {
  findById(id: string): Promise<Invitation | null>;
  findBySlug(slug: string): Promise<Invitation | null>;
  existsBySlug(slug: string): Promise<boolean>;
  listByOwner(ownerId: string): Promise<Invitation[]>;
  save(invitation: Invitation): Promise<void>;
  setPremium(id: string, isPremium: boolean): Promise<void>;
  delete(id: string): Promise<void>;
}
