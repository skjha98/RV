export const cleanData = (data: Record<string, any>) => {
  Object.keys(data).forEach(key => {
    const value = data[key];
    if (typeof value === 'string') {
      const trimmed  = value.trim();
      if (trimmed === "") {
        data[key] = null;
      }
      else if (key === 'owner_type' || key === 'type') {
        data[key] = trimmed.toUpperCase();
      }
    }
  });
};