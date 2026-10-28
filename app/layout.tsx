import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import { FloatingButtons } from "@/components/floating-buttons";
import { PresencePing } from "@/components/presence-ping";
import { InstallProvider } from "@/components/install-app";
import { LanguageProvider } from "@/components/language-provider";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: {
    default: "OMT | Optima Mobile Team",
    template: "%s | OMT",
  },
  description:
    "أكاديمية تصليح الهواتف والمايكروسولدرينغ في الحراش. اشترك في الدورة المسجلة مع Optima Mobile Team.",
  applicationName: "OMT",
  appleWebApp: {
    capable: true,
    title: "OMT",
    statusBarStyle: "default",
  },
  icons: {
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  verification: {
    google: "M-2MRH8gLLKgC2vKKrl2dVgjfNOXhuj_spQ1_fIJRwQ",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffe500",
};

const localeScript = `(function(){try{var l=localStorage.getItem("omt-locale");var lang=l==="fr"||l==="en"||l==="es"||l==="ar"?l:"ar";document.documentElement.lang=lang;document.documentElement.dir=lang==="ar"?"rtl":"ltr";}catch(e){}})();`;
const themeScript = `(function(){try{var t=localStorage.getItem("omt-theme");document.documentElement.setAttribute("data-theme",t==="dark"?"dark":"light");}catch(e){document.documentElement.setAttribute("data-theme","light");}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" data-theme="light" className={`${cairo.variable} h-full`} suppressHydrationWarning>
      <body className={`${cairo.className} min-h-full bg-white text-ink antialiased`}>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: localeScript }} />
        <LanguageProvider>
          <InstallProvider>
            {children}
            <PresencePing />
            <FloatingButtons />
          </InstallProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
