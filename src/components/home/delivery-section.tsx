"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Section } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";

export function DeliverySection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <Section container={false} className="-mt-16 pt-0 sm:-mt-20">
      <Reveal>
        <div ref={ref} className="relative aspect-[1296/540] w-full overflow-hidden">
          <motion.div style={{ y }} className="absolute inset-x-0 -top-[15%] h-[130%]">
            <Image
              src="/banner-main.png"
              alt="Martin Sports"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      </Reveal>
    </Section>
  );
}
