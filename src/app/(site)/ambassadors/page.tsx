import type { Metadata } from "next";
import { Trophy, Link as LinkIcon } from "lucide-react";
import { ambassadorRepository } from "@/lib/repositories/ambassador-repository";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/shared/container";
import { PageHeading, ProductHeading, Body, Metadata as MetaText } from "@/components/ui/typography";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { InstagramIcon, FacebookIcon, YoutubeIcon, TiktokIcon } from "@/components/icons/social-icons";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function socialIconFor(platform: string) {
  const key = platform.trim().toLowerCase();
  if (key.includes("instagram")) return InstagramIcon;
  if (key.includes("facebook")) return FacebookIcon;
  if (key.includes("youtube")) return YoutubeIcon;
  if (key.includes("tiktok")) return TiktokIcon;
  return LinkIcon;
}

export const metadata: Metadata = buildMetadata({
  title: "Brand Ambassadors",
  description:
    "Meet the cricketers and athletes who represent Martin Sports on and off the field.",
  path: "/ambassadors",
});

export default async function AmbassadorsPage() {
  const ambassadors = await ambassadorRepository.list();

  return (
    <Container className="max-w-5xl py-16 sm:py-20">
      <PageHeading>Brand Ambassadors</PageHeading>
      <Body className="mt-2">
        Placeholder profiles — real ambassador details coming soon.
      </Body>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {ambassadors.map((ambassador) => (
          <div
            key={ambassador.id}
            className="rounded-lg border border-border bg-card p-6"
          >
            <div className="flex items-start gap-4">
              <Avatar size="lg" className="size-14">
                {ambassador.photo && <AvatarImage src={ambassador.photo} alt={ambassador.name} />}
                <AvatarFallback className="text-base">
                  {initials(ambassador.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <ProductHeading as="h2">{ambassador.name}</ProductHeading>
                <MetaText className="mt-1 block text-brand normal-case">
                  {ambassador.role}
                </MetaText>
              </div>
            </div>

            <Body className="mt-4">{ambassador.bio}</Body>

            {ambassador.achievements.length > 0 && (
              <ul className="mt-4 space-y-1.5">
                {ambassador.achievements.map((achievement) => (
                  <li
                    key={achievement}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Trophy className="mt-0.5 size-3.5 shrink-0 text-brand" aria-hidden="true" />
                    {achievement}
                  </li>
                ))}
              </ul>
            )}

            {ambassador.socialLinks.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {ambassador.socialLinks.map((link) => {
                  const Icon = socialIconFor(link.platform);
                  return (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${ambassador.name} on ${link.platform}`}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Icon className="size-5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </Container>
  );
}
