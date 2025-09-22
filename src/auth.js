const ROLE_KEY = "vaultrex_role_v1";

export const Roles = {
  Admin: "admin",
  Buyer: "buyer",
  Picker: "picker",
  Viewer: "viewer",
};

export function getRole() {
  const stored = localStorage.getItem(ROLE_KEY);
  return stored || Roles.Admin;
}

export function setRole(role) {
  localStorage.setItem(ROLE_KEY, role);
}

export function canConsume(role) {
  return role === Roles.Admin || role === Roles.Picker || role === Roles.Buyer;
}

export function canAdjust(role) {
  return role === Roles.Admin || role === Roles.Buyer;
}

export function canSendPO(role) {
  return role === Roles.Admin || role === Roles.Buyer;
}

export function canReceivePO(role) {
  return role === Roles.Admin || role === Roles.Buyer;
}


