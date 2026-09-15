import Image from "next/image";

/** Pinned banner: sticks to the top of the viewport for the wrapper's extra
 * height (190vh vs. the 90vh sticky child = 100vh of "locked" scroll).
 * TestimonialsSection is pulled up by exactly the image's own height
 * (-mt-[90vh]) so it takes that same 100vh to rise from off-screen to fully
 * covering the banner — arriving right as the sticky pin runs out of room
 * and releases, instead of releasing early while still partly visible. */
export function DeliverySection() {
  return (
    <div className="relative h-[190vh]">
      <div className="sticky top-0 h-[90vh] w-full overflow-hidden">
        <Image
          src="/banner-main.png"
          alt="Martin Sports"
          fill
          sizes="100vw"
          className="object-cover"
          priority={false}
        />
      </div>
    </div>
  );
}
