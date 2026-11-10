import { timingSafeEqual } from 'node:crypto';

// The admin password comes from the ADMIN_PASSWORD environment variable.
// If it is not set, every admin feature stays disabled.
export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function isAdminPassword(candidate) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof candidate !== 'string') return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

// Express middleware for /api/admin/* routes. The dashboard sends the password
// in the X-Admin-Key header after the admin logs in.
export function requireAdmin(req, res, next) {
  if (!isAdminConfigured()) {
    return res.status(503).json({ error: 'Admin access is disabled: ADMIN_PASSWORD is not set' });
  }
  if (!isAdminPassword(req.get('x-admin-key'))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
