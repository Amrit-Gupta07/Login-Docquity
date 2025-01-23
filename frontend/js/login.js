document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessageElement = document.getElementById('error-message'); 


    errorMessageElement.textContent = '';

    
    if (!email || !password) {
        errorMessageElement.textContent = 'Email and Password are required';
        errorMessageElement.style.color = 'red';
        return;
    }

    try {
        const response = await fetch('http://localhost:4000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            errorMessageElement.textContent = data.message || 'Login failed. Please try again.';
            errorMessageElement.style.color = 'red';
        } else {
            
            window.location.href = '/dashboard';  
        }
    } catch (error) {
        errorMessageElement.textContent = 'An error occurred. Please try again later.';
        errorMessageElement.style.color = 'red';
    }
});
