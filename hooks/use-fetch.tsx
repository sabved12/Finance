import { useState } from "react";
import { toast } from "sonner";

const useFetch = <T = any>(cb: (...args: any[]) => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Accept any arguments to pass to cb
  const fn = async (...args: any[]) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response);
      setError(null);
    } catch (error) {
      // TypeScript: error is unknown, so use type assertion or runtime check
      let message = "An error occurred";
      if (error instanceof Error) {
        message = error.message;
      }
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;
