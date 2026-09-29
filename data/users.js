// Roles for the newsroom back office. Stored on User.role as a plain string
// (SQLite has no enums), so this file defines what is valid.
//
// EDITOR can write and publish posts. ADMIN can additionally manage accounts.
// Both reach the same editor UI; the difference is only what /admin/users allows.
export const ROLES = [
  { id: 'EDITOR', label: 'Editor' },
  { id: 'ADMIN', label: 'Administrator' },
];

export const ROLE_IDS = ROLES.map((r) => r.id);

export const isAdmin = (user) => user?.role === 'ADMIN';
