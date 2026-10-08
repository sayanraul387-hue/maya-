import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// তোমার Supabase Project URL
const SUPABASE_URL = "https://qepyxcepuatqlmqolrvy.supabase.co";

// তোমার Supabase Publishable Key
const SUPABASE_KEY = "sb_publishable_QKq1AjqnBye6MPl3afvfOw_h1UPQr9i";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;

  const message = document.getElementById("message");
  const button = document.getElementById("registerBtn");

  message.textContent = "";
  button.disabled = true;
  button.textContent = "Creating account...";

  try {

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,

      options: {
        data: {
          name: name,
          phone: phone
        }
      }
    });

    if (error) {
      throw error;
    }

    message.textContent =
      "Account created successfully!";

    registerForm.reset();

  } catch (error) {

    message.textContent = error.message;

  } finally {

    button.disabled = false;
    button.textContent = "Create Account";

  }

});