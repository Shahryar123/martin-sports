import { AMBASSADORS, OWNER_PROFILE } from "@/lib/data/ambassadors";
import type { Ambassador, AmbassadorSocialLink, OwnerProfile } from "@/types";

export type AmbassadorCreateInput = {
  slug: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
  achievements: string[];
  socialLinks: AmbassadorSocialLink[];
  published: boolean;
};

export type AmbassadorUpdateInput = Partial<AmbassadorCreateInput>;

export interface AmbassadorRepository {
  list(): Promise<Ambassador[]>;
  getBySlug(slug: string): Promise<Ambassador | null>;
  getOwnerProfile(): Promise<OwnerProfile>;

  adminList(): Promise<Ambassador[]>;
  adminGetById(id: string): Promise<Ambassador | null>;
  create(input: AmbassadorCreateInput): Promise<Ambassador>;
  update(id: string, input: AmbassadorUpdateInput): Promise<Ambassador>;
  delete(id: string): Promise<void>;
  setPublished(id: string, published: boolean): Promise<Ambassador>;
  updateOwnerProfile(input: OwnerProfile): Promise<OwnerProfile>;
}

class InMemoryAmbassadorRepository implements AmbassadorRepository {
  private ambassadors: Ambassador[];
  private ownerProfile: OwnerProfile;

  constructor(seed: Ambassador[], ownerProfile: OwnerProfile) {
    this.ambassadors = [...seed];
    this.ownerProfile = { ...ownerProfile };
  }

  async list(): Promise<Ambassador[]> {
    return this.ambassadors.filter((a) => a.published);
  }

  async getBySlug(slug: string): Promise<Ambassador | null> {
    return this.ambassadors.find((a) => a.slug === slug && a.published) ?? null;
  }

  async getOwnerProfile(): Promise<OwnerProfile> {
    return this.ownerProfile;
  }

  async adminList(): Promise<Ambassador[]> {
    return [...this.ambassadors];
  }

  async adminGetById(id: string): Promise<Ambassador | null> {
    return this.ambassadors.find((a) => a.id === id) ?? null;
  }

  async create(input: AmbassadorCreateInput): Promise<Ambassador> {
    if (this.ambassadors.some((a) => a.slug === input.slug)) {
      throw new Error(`An ambassador with slug "${input.slug}" already exists.`);
    }

    const now = new Date().toISOString();
    const ambassador: Ambassador = {
      id: `amb-${Math.random().toString(36).slice(2, 10)}`,
      ...input,
      isPlaceholder: false,
      createdAt: now,
      updatedAt: now,
    };
    this.ambassadors.push(ambassador);
    return ambassador;
  }

  async update(id: string, input: AmbassadorUpdateInput): Promise<Ambassador> {
    const index = this.ambassadors.findIndex((a) => a.id === id);
    if (index === -1) throw new Error("Ambassador not found");

    if (input.slug && this.ambassadors.some((a) => a.id !== id && a.slug === input.slug)) {
      throw new Error(`An ambassador with slug "${input.slug}" already exists.`);
    }

    const updated: Ambassador = {
      ...this.ambassadors[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    this.ambassadors[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.ambassadors = this.ambassadors.filter((a) => a.id !== id);
  }

  async setPublished(id: string, published: boolean): Promise<Ambassador> {
    return this.update(id, { published });
  }

  async updateOwnerProfile(input: OwnerProfile): Promise<OwnerProfile> {
    this.ownerProfile = { ...input };
    return this.ownerProfile;
  }
}

export const ambassadorRepository: AmbassadorRepository = new InMemoryAmbassadorRepository(
  AMBASSADORS,
  OWNER_PROFILE,
);
