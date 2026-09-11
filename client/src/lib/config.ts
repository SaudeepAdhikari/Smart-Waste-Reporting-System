const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error(
    'NEXT_PUBLIC_API_URL environment variable is not set. Please configure it in .env.local'
  );
}

export const config = {
  apiUrl,
} as const;
