const API_BASE = "";

function getStoredUser() {
  try { return JSON.parse(localStorage.getItem("pldiosUser") || "null"); } catch { return null; }
}

function requireLogin() {
  const user = getStoredUser();
  if (!user) { window.location.href = "/LOGIN.html"; return null; }
  return user;
}

async function getDistributorContext() {
  const user = requireLogin();
  if (!user) return null;
  const profileData = await apiRequest(`/api/profile?userId=${user.id}`);
  const profile = profileData.profile || {};
  return {
    user, profile,
    complete: profileData.complete,
    displayName: profile.distributorName || user.outlet || user.name,
    displayArea: profile.address || user.area || "",
  };
}

function applyDistributorIdentity(context) {
  if (!context) return;
  document.querySelectorAll("#userName, [data-distributor-name]").forEach(el => { el.textContent = context.displayName; });
  document.querySelectorAll("#userArea, [data-distributor-area]").forEach(el => { el.textContent = context.displayArea; });
}

function logout() {
  localStorage.removeItem("pldiosUser");
  localStorage.removeItem("pldiosToken");
  localStorage.removeItem("pldiosPendingOrder");
  window.location.href = "/LOGIN.html";
}

function redirectByRole(user) {
  const map = {
    master: "/master.html",
    admin_pertamina: "/admin%20pertamina.html",
    sam_retail: "/sam%20retail.html",
    sam_industri: "/sam%20industri.html",
  };
  window.location.href = map[user.role] || "/menu%20utama.html";
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || "Request gagal diproses.");
  return payload;
}

function formatDate(isoDate) {
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(isoDate));
}

function statusClass(status) {
  if (["qt_uploaded","payment_uploaded","completed"].includes(status)) return "approved";
  if (status === "expired") return "process";
  return "pending";
}

function statusLabel(status) {
  const labels = { pending_po:"Pending PO", qt_uploaded:"QT Uploaded", payment_uploaded:"Payment Uploaded", completed:"Completed", expired:"Expired", rejected:"Rejected" };
  return labels[status] || status;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value || 0));
}

function setActiveMenu() {
  const currentPath = decodeURIComponent(window.location.pathname);
  document.querySelectorAll(".sidebar-menu a[href], .sidebar a[href]").forEach(link => {
    const href = decodeURIComponent(link.getAttribute("href") || "");
    const isLogout = href === "#";
    link.classList.toggle("active", !isLogout && href && currentPath === href);
  });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) { resolve(""); return; }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setActiveMenu);
} else { setActiveMenu(); }
