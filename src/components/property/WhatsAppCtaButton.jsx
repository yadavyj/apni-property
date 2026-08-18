import WhatsAppIcon from "@/components/common/WhatsAppIcon";
import Button from "@/components/ui/Button";
import { BUSINESS } from "@/lib/constants";
import { buildPropertyWhatsAppLink } from "@/lib/whatsapp";

export default function WhatsAppCtaButton({ property, className }) {
  const pageUrl = `${BUSINESS.siteUrl}/properties/${property.slug}`;

  return (
    <Button
      href={buildPropertyWhatsAppLink(property, pageUrl)}
      target="_blank"
      rel="noopener noreferrer"
      variant="whatsapp"
      size="lg"
      className={className}
    >
      <WhatsAppIcon className="h-5 w-5" />
      Enquire on WhatsApp
    </Button>
  );
}

