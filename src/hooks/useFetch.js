import { useState, useCallback } from "react";

export default function useFetch(asyncFn) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      try {
        setIsLoading(true);
        setError(null);
        return await asyncFn(...args);
      } catch (err) {
        setError(err.message ?? "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    },
    [asyncFn],
  );

  return { execute, isLoading, error };
}
