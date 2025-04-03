import "./styles/globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Kolonia - Monetize Your Assets",
  description: "Monetize your assets and property with Kolonia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
