import { AMBASSADORS, OWNER_PROFILE } from "@/lib/data/ambassadors";
import type { Ambassador, OwnerProfile } from "@/types";

export interface AmbassadorRepository {
  list(): Promise<Ambassador[]>;
  getBySlug(slug: string): Promise<Ambassador | null>;
  getOwnerProfile(): Promise<OwnerProfile>;
}

class InMemoryAmbassadorRepository implements AmbassadorRepository {
  async list(): Promise<Ambassador[]> {
    return AMBASSADORS;
  }

  async getBySlug(slug: string): Promise<Ambassador | null> {
    return AMBASSADORS.find((a) => a.slug === slug) ?? null;
  }

  async getOwnerProfile(): Promise<OwnerProfile> {
    return OWNER_PROFILE;
  }
}

export const ambassadorRepository: AmbassadorRepository =
  new InMemoryAmbassadorRepository();
