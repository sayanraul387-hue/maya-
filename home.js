import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://qepyxcepuatqlmqolrvy.supabase.co";
const SUPABASE_KEY = "sb_publishable_QKq1AjqnBye6MPl3afvfOw_h1UPQr9i";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkUserSession() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = "login.html";
  }
}
checkUserSession();

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.href = "login.html";
  });
}

const startQuizBtn = document.getElementById("startQuizBtn");
if (startQuizBtn) {
  startQuizBtn.addEventListener("click", () => {
    window.location.href = "quiz.html";
  });
}