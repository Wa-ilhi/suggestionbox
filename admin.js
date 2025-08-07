import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'
import { CONFIG } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
const supabaseUrl = CONFIG.SUPABASE_URL;
const supabaseKey = CONFIG.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

  const container = document.getElementById('suggestions-container');

  async function loadSuggestions() {
  const { data, error } = await supabase
    .from('suggestion_table')
    .select('content, created_at, users(name)')
    .order('created_at', { ascending: false }); 

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

  // Auto refresh every 30 seconds
setInterval(loadSuggestions, 30000); 
});
