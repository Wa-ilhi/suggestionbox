import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'
import { CONFIG } from './config.js'; 

const supabaseUrl = CONFIG.SUPABASE_URL;
const supabaseKey = CONFIG.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);    

document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name');
    const suggestionInput = document.getElementById('suggestion');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const submitSpinner = document.getElementById('submitSpinner');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const enableBtn = document.getElementById('enableBtn');
    const welcomeScreen = document.getElementById('welcome-screen');
    const suggestionContainer = document.getElementById('suggestion-container');
    const fadeEls = welcomeScreen.querySelectorAll('.fade-in');  
    const typewriterElement = document.getElementById("typewriter"); 
    const text = "Hi there! 👋 I’m offering a complimentary one-page landing page for your business or products. Share your suggestion below, and I’ll reach out to you shortly.";
    const messengerInput = document.getElementById("messenger-link");

    nameInput.addEventListener("input", () => {
    const username = nameInput.value.trim().replace(/\s+/g, "");
    messengerInput.value = username ? `https://m.me/${username}` : "";
    });

    submitBtn.addEventListener('click', async () => {
    const name = nameInput.value.trim();
    const suggestion = suggestionInput.value.trim();
    const link = document.getElementById("messenger-link").value.trim();

    
    if (!name || !suggestion) {
    showError("Please enter your name and a suggestion before submitting.");
    setTimeout(() => {
        const errorBox = document.getElementById("errorMessage");
        if (errorBox) {
            errorBox.style.display = "none";
        }
    }, 1000);
    return;
}


    // Show loading state
    submitBtn.disabled = true;
    submitText.textContent = "Submitting...";
    submitSpinner.style.display = "inline-block";
    errorMessage.style.display = "none";

    try {
        // Insert the user name into the users table
        const { data: user, error: userError } = await supabase
            .from('users')
            .insert([{ name }])
            .select();  

        if (userError) throw userError;

    

        // Insert the suggestion into suggestion_table
        const { data: suggestionData, error: suggestionError } = await supabase
            .from('suggestion_table')
            .insert([
                {
                    content: suggestion,link,
                    created_at: new Date().toISOString(),
                    user_id: user[0].id,
                }
            ]);

        if (suggestionError) throw suggestionError;

        // Show success
        successMessage.style.display = "block";
        nameInput.value = "";
        suggestionInput.value = "";

        setTimeout(() => {
            successMessage.style.display = "none";
        }, 3000);
    } catch (err) {
        console.error("Error submitting:", err);
        showError("Failed to submit. Please try again.");
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitText.textContent = "Submit Suggestion";
        submitSpinner.style.display = "none";
    }
});


     fadeEls.forEach(el => {
    el.style.animationPlayState = 'running';
  });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = "block";
    }

    enableBtn.addEventListener('click', () => {
    welcomeScreen.classList.add('hidden');
    suggestionContainer.classList.remove('hidden');
  });

  let index = 0;

  function type() {
    if (index < text.length) {
      typewriterElement.innerHTML += text.charAt(index);
      index++;
      setTimeout(type, 35); // Adjust speed here
    }
  }

  // Get visitor IP
    async function getUserIP() {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        return data.ip;
      } catch (error) {
        console.error("Failed to fetch IP:", error);
        return null;
      }
    }

    // Add visitor if new
    async function addVisitor(ip) {
      const { data, error } = await supabase
        .from("visitors")
        .select("id")
        .eq("ip_address", ip)
        .single();

      if (!data) {
        const { error: insertError } = await supabase
          .from("visitors")
          .insert([{ ip_address: ip }]);

        if (insertError) console.error("Insert failed:", insertError);
      }
    }

    // Fetch total visitor count
    async function getVisitorCount() {
      const { count, error } = await supabase
        .from("visitors")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("Error fetching visitor count:", error);
        return 0;
      }

      return count;
    }

    // Initialize counter
    window.addEventListener("load", async () => {
      const ip = await getUserIP();
      if (ip) {
        await addVisitor(ip);
      }
      const total = await getVisitorCount();
      document.getElementById("visitors").textContent = total;
    });

  window.addEventListener("DOMContentLoaded", type);

  

    
});


