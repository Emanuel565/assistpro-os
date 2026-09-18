export const getAuthToken = (): string | null => {
  return localStorage.getItem('assistpro_token') || localStorage.getItem('scooby_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('assistpro_token', token);
  localStorage.setItem('scooby_token', token); // Garantir retrocompatibilidade total
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('assistpro_token');
  localStorage.removeItem('scooby_token');
};
