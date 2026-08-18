import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloatingButton from "@/components/layout/WhatsAppFloatingButton";
import ReferralCapture from "@/components/common/ReferralCapture";
import ReferEarnPopup from "@/components/common/ReferEarnPopup";
import AuroraBackdrop from "@/components/common/AuroraBackdrop";
import ScrollProgress from "@/components/common/ScrollProgress";
import PublicAuthProvider from "@/components/providers/PublicAuthProvider";

export default function PublicLayout({ children }) {
  return (
    <PublicAuthProvider>
      <Suspense fallback={null}>
        <ReferralCapture />
      </Suspense>
      <Suspense fallback={null}>
        <ReferEarnPopup />
      </Suspense>
      <AuroraBackdrop />
      <ScrollProgress />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloatingButton />
    </PublicAuthProvider>
  );
}
