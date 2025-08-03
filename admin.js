import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

document.addEventListener('DOMContentLoaded', () => {
const supabaseUrl = 'https://xotjeiftthajvmbfzyeh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvdGplaWZ0dGhhanZtYmZ6eWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxODkxOTksImV4cCI6MjA2OTc2NTE5OX0.yGIZwFkZ5qw7Reu3OJleHw-dye4GmxZ1eNJZQIeFvUQ';
const supabase = createClient(supabaseUrl, supabaseKey);

  const container = document.getElementById('suggestions-container');

  async function loadSuggestions() {
  const { data, error } = await supabase
    .from('suggestion_table')
    .select('content, created_at, users(name)')
    .order('created_at', { ascending: false }); // If 'created_at' exists; otherwise remove this line


  const container = document.getElementById('suggestions-container');

  if (error) {
    container.innerHTML = '<p>Error loading suggestions.</p>';
    console.error(error);
    return;
  }

  container.innerHTML = '';

  data.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'suggestion-card';

    card.innerHTML = `
  <div class="suggestion-header">
    <span class="sender-name">${item.users?.name ?? 'Anonymous'}</span>
    <span class="suggested-at">${new Date(item.created_at).toLocaleString()}</span>
  </div>
  <div class="suggestion-content">
    ${item.content}
  </div>
`;


    container.appendChild(card);
  });
}

  loadSuggestions();
});
