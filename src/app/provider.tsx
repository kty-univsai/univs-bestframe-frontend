'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from "react-hot-toast";
import { Color } from '@/styles/color';

const queryClient = new QueryClient();

type TProps = {
  children: ReactNode,
}

export const Providers = ({ children  }: TProps) => {

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            className: 'custom-toast',
            duration: 3000,
            style: {
              maxWidth: "600px",
            },
            success: {
              style:{
                background: Color.AlertSuccess,
              },
            },
            error: {
              style:{
                background: Color.AlertError,
              },
            }
          }}
        />
      </QueryClientProvider>
    </SessionProvider>
  );
}