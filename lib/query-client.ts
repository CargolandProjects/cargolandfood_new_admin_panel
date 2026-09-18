import { QueryClient } from "@tanstack/react-query";

export const getQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retryDelay: 500,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        retry: (failureCount, error: any) => {
          //          // Don't retry for 4xx errors (client errors)
          if (error?.statusCode >= 400 && error?.statusCode < 500) {
            return false;
          }
          // Retry for 5xx errors (server errors) up to 2 times
          return failureCount < 2;
        },
        gcTime: 30 * 60 * 1000, // 30 mins
      },

      mutations: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        retry: (failureCount, error: any) => {
          // Don't retry for 4xx errors (client errors)
          if (error?.statusCode >= 400 && error?.statusCode < 500) {
            return false;
          }
          // Retry for 5xx errors (server errors) once
          return failureCount < 1;
        },
      },
    },
  });
