import type { Metadata } from "next";
import React from 'react';

import { Providers } from '@/app/provider';
import '@/styles/globals.css';
import '@/styles/reset.css';

export const metadata: Metadata = {
  title: "Univs Studio",
  description: "Universe AI SDK Studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
