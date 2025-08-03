import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const supabaseUrl = 'https://xotjeiftthajvmbfzyeh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvdGplaWZ0dGhhanZtYmZ6eWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxODkxOTksImV4cCI6MjA2OTc2NTE5OX0.yGIZwFkZ5qw7Reu3OJleHw-dye4GmxZ1eNJZQIeFvUQ';
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
    const text = "Hello, I’m working on building a helpful mobile application that aims to make daily tasks easier and more efficient for users. If you have any suggestions or ideas, I’d love to hear them!";
 

    submitBtn.addEventListener('click', async () => {
    const name = nameInput.value.trim();
    const suggestion = suggestionInput.value.trim();
    
    if (!name || !suggestion) {
        showError("Please enter your name and a suggestion before submitting.");
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
                    content: suggestion,
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

  window.addEventListener("DOMContentLoaded", type);

    
});


