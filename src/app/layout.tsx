// src/app/layout.tsx

import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <title>Kolonia - Monetize Your Assets</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
