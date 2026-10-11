import Image from "next/image";

export function DeliverySection() {
  return (
    <div className="relative aspect-[1296/540] w-full overflow-hidden">
      <Image
        src="/banner-main.png"
        alt="Martin Sports Gear — Believe & Achieve"
        fill
        sizes="100vw"
        className="object-cover"
      />
    </div>
  );
}
