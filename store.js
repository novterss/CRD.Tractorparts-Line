export const userCarts = new Map();
export const userPoints = new Map();
export const userOrders = new Map();
export const pendingSlips = new Map(); // userId -> { total, imageUrl, timestamp }
export let adminId = 'U9113d402b5b45ffb3f45ec48ad14440a';

export function setAdminId(id) {
  adminId = id;
}
