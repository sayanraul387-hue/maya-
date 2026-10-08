import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://qepyxcepuatqlmqolrvy.supabase.co";
const SUPABASE_KEY = "sb_publishable_QKq1AjqnBye6MPl3afvfOw_h1UPQr9i";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const message = document.getElementById("message");
  const button = document.getElementById("loginBtn");

  message.textContent = "";
  button.disabled = true;
  button.textContent = "Logging in...";

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      throw error;
    }

    message.textContent = "Login successful!";

    // আপাতত এখানে index.html-এ পাঠাবে
    setTimeout(() => {
      window.location.href = "index.html";
    }, 800);

  } catch (error) {

    message.textContent = error.message;

  } finally {

    button.disabled = false;
    button.textContent = "Login";

  }
});