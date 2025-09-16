import { ReactNode } from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

type BaseLayoutProps = {
  children: ReactNode;
  headerTitle?: string;
  userDisplayName?: string;
  companyName?: string;
  footerDescription?: string;
  showNavigation?: boolean;
  showFooterLinks?: boolean;
};

export default function BaseLayout({
  children,
  headerTitle,
  userDisplayName,
  companyName,
  footerDescription,
  showNavigation = true,
  showFooterLinks = true,
}: BaseLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">{children}</main>

      <Footer
        companyName={companyName}
        description={footerDescription}
        showLinks={showFooterLinks}
      />
    </div>
  );
}
