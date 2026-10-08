import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://qepyxcepuatqlmqolrvy.supabase.co";
const SUPABASE_KEY = "sb_publishable_QKq1AjqnBye6MPl3afvfOw_h1UPQr9i";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const usersTable = document.getElementById("usersTable");
const message = document.getElementById("message");
const logoutBtn = document.getElementById("logoutBtn");

async function initAdmin() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = "login.html";
    return;
  }
  loadUsers();
}

async function loadUsers() {
  const { data, error } = await supabase
    .from("profiles")
    .select("name, email, phone, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    message.textContent = "ERROR: " + error.message;
    console.error(error);
    return;
  }

  message.textContent = `${data.length} user(s) registered`;
  document.getElementById("totalUsers").textContent = data.length;
  usersTable.innerHTML = "";

  data.forEach((user) => {
    const row = document.createElement("tr");
    const date = new Date(user.created_at).toLocaleString("en-IN");

    row.innerHTML = `
      <td>${user.name || "-"}</td>
      <td>${user.email || "-"}</td>
      <td>${user.phone || "-"}</td>
      <td>${date}</td>
    `;

    usersTable.appendChild(row);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.href = "login.html";
  });
}

initAdmin();