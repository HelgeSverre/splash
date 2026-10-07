const form = document.querySelector('#login');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = form.querySelector('button');
  const error = document.querySelector('#error');
  button.disabled = true;
  error.textContent = '';
  try {
    const response = await fetch('/login', { method: 'POST', headers: { 'content-type': 'text/plain' }, body: document.querySelector('#token').value });
    if (!response.ok) throw new Error(await response.text());
    location.reload();
  } catch (e) { error.textContent = e.message || 'Could not connect. Check the server or SSH tunnel.'; }
  finally { button.disabled = false; }
});
