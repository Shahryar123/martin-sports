import { ABOUT_CONTENT, CONTACT_CONFIG, HOMEPAGE_CONTENT } from "@/lib/data/content";
import type { AboutContent, ContactConfig, HomepageContent } from "@/types";

export interface ContentRepository {
  getAbout(): Promise<AboutContent>;
  updateAbout(input: Omit<AboutContent, "updatedAt">): Promise<AboutContent>;

  getHomepage(): Promise<HomepageContent>;
  updateHomepage(input: Omit<HomepageContent, "updatedAt">): Promise<HomepageContent>;

  getContact(): Promise<ContactConfig>;
  updateContact(input: Omit<ContactConfig, "updatedAt">): Promise<ContactConfig>;
}

class InMemoryContentRepository implements ContentRepository {
  private about: AboutContent;
  private homepage: HomepageContent;
  private contact: ContactConfig;

  constructor(about: AboutContent, homepage: HomepageContent, contact: ContactConfig) {
    this.about = { ...about };
    this.homepage = { ...homepage };
    this.contact = { ...contact };
  }

  async getAbout(): Promise<AboutContent> {
    return this.about;
  }

  async updateAbout(input: Omit<AboutContent, "updatedAt">): Promise<AboutContent> {
    this.about = { ...input, updatedAt: new Date().toISOString() };
    return this.about;
  }

  async getHomepage(): Promise<HomepageContent> {
    return this.homepage;
  }

  async updateHomepage(input: Omit<HomepageContent, "updatedAt">): Promise<HomepageContent> {
    this.homepage = { ...input, updatedAt: new Date().toISOString() };
    return this.homepage;
  }

  async getContact(): Promise<ContactConfig> {
    return this.contact;
  }

  async updateContact(input: Omit<ContactConfig, "updatedAt">): Promise<ContactConfig> {
    this.contact = { ...input, updatedAt: new Date().toISOString() };
    return this.contact;
  }
}

export const contentRepository: ContentRepository = new InMemoryContentRepository(
  ABOUT_CONTENT,
  HOMEPAGE_CONTENT,
  CONTACT_CONFIG,
);
