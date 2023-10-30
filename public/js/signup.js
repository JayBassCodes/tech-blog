async function signupFormHandler(event) {
  event.preventDefault();

  // Collect values from the signup form
  const username = document.querySelector('#username-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();

  // If both fields have content
  if (username && password) {
    // POST the new user to the user table in the database
    const response = await fetch('/api/users', {
      method: 'post',
      body: JSON.stringify({
        username,
        password
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    // If the response is okay, log the user in
    if (response.ok) {
      console.log('success');
      
      document.location.replace('/dashboard');
    } else {
      alert(response.statusText);
    }
  }
};

// Listen for the signup form button
document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);