export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("user");
};

export const logout = () => {
  localStorage.removeItem("user");
};