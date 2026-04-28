const ALLOWED_ADMIN_EMAILS = [
  "karrivishalreddy6@gmail.com",
  "ravigunisetti99@gmail.com",
  "lonelymanwastaken@gmail.com"
];

export function normalizeAdminEmail(email) {
  return (email || "").trim().toLowerCase();
}

export function isAllowedAdminEmail(email) {
  return ALLOWED_ADMIN_EMAILS.includes(normalizeAdminEmail(email));
}

export function getStoredAdminEmail() {
  return normalizeAdminEmail(localStorage.getItem("admin"));
}

export function hasAllowedAdminSession() {
  return isAllowedAdminEmail(getStoredAdminEmail());
}

export { ALLOWED_ADMIN_EMAILS };
