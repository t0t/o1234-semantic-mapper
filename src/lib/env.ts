// Environment variables management

// Get API key from environment variables or other secure sources
export const getApiKey = (): string => {
  // In production, only use environment variables
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_OPENAI_API_KEY || "";
  }

  // In development, allow using localStorage as fallback
  return (
    import.meta.env.VITE_OPENAI_API_KEY ||
    localStorage.getItem("OPENAI_API_KEY") ||
    ""
  );
};
