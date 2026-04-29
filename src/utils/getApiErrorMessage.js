export default function getApiErrorMessage(err) {
  const data = err?.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data && typeof data === "object") {
    if (typeof data.message === "string" && data.message.trim()) {
      if (typeof data.error === "string" && data.error.trim()) {
        return `${data.message}: ${data.error}`;
      }
      return data.message;
    }
    if (typeof data.error === "string" && data.error.trim()) return data.error;
    try {
      return JSON.stringify(data);
    } catch {
      // fall through
    }
  }

  if (typeof err?.message === "string" && err.message.trim()) {
    return err.message;
  }

  return "Error connecting backend";
}
