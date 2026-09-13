import { contentRepository } from "@/lib/repositories/content-repository";
import { ambassadorRepository } from "@/lib/repositories/ambassador-repository";
import { testimonialRepository } from "@/lib/repositories/testimonial-repository";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AboutForm } from "@/components/admin/content/about-form";
import { HomepageForm } from "@/components/admin/content/homepage-form";
import { ContactForm } from "@/components/admin/content/contact-form";
import { TestimonialsManager } from "@/components/admin/content/testimonials-manager";

export default async function AdminContentPage() {
  const [about, owner, homepage, contact, testimonials] = await Promise.all([
    contentRepository.getAbout(),
    ambassadorRepository.getOwnerProfile(),
    contentRepository.getHomepage(),
    contentRepository.getContact(),
    testimonialRepository.adminList(),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Content"
        description="Manage the site's About, Homepage, Testimonials and Contact content."
      />

      <Tabs defaultValue="about">
        <TabsList>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="mt-4 max-w-2xl">
          <AboutForm about={about} owner={owner} />
        </TabsContent>
        <TabsContent value="homepage" className="mt-4 max-w-2xl">
          <HomepageForm homepage={homepage} />
        </TabsContent>
        <TabsContent value="testimonials" className="mt-4">
          <TestimonialsManager testimonials={testimonials} />
        </TabsContent>
        <TabsContent value="contact" className="mt-4 max-w-2xl">
          <ContactForm contact={contact} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
