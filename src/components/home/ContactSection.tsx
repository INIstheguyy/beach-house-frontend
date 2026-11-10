import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppIcon from "@/components/common/WhatsAppIcon";
import { PHONE_DISPLAY, PHONE_TEL, WHATSAPP_URL } from "@/lib/contact";

/**
 * Combined "Host your property" CTA + general contact block.
 * Reachable via id="contact" (hash link from footer / nav).
 */
const ContactSection = () => {
  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-r from-accent via-accent-600 to-accent-700 text-white"
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
          Own a beach house or shortlet property?
        </h2>

        <p className="text-xl mb-4 text-white/90 max-w-2xl mx-auto">
          Partner with us to maximize your rental income while we handle the
          details. Let&apos;s turn your property into a top-earning gateway!
        </p>

        <p className="text-base mb-10 text-white/75 max-w-xl mx-auto">
          Have a question or just want to say hello? Reach us directly — we
          typically respond within a few hours.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* WhatsApp */}
          <Button
            asChild
            size="lg"
            className="h-12 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-8 font-semibold [&_svg]:size-5"
          >
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="mr-2 size-5 shrink-0" />
              Chat on WhatsApp
            </a>
          </Button>

          {/* Call */}
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 border-white/60 bg-white/10 hover:bg-white/20 text-white px-8 font-semibold [&_svg]:size-5"
          >
            <a href={`tel:${PHONE_TEL}`}>
              <Phone className="mr-2 size-5 shrink-0" />
              {PHONE_DISPLAY}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
