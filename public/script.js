document.addEventListener("DOMContentLoaded", () => {
    const depositForm = document.getElementById("depositForm");

    // Función de depósito (usando ID de transacción)
    if (depositForm) {
        depositForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const transactionId = document.getElementById("transactionId").value;
            const token = localStorage.getItem("authToken");

            if (!token) {
                alert("Por favor, inicia sesión primero.");
                window.location.href = 'login.html';
                return;
            }

            // Enviar el ID de transacción al backend
            try {
                const response = await fetch('https://backendnose-production.up.railway.app/api/deposit', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify({ transactionId })
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Depósito enviado exitosamente. Esperando aprobación.");
                    window.location.href = 'dashboard.html'; // Redirigir al dashboard
                } else {
                    alert("Error: " + data.message);
                }
            } catch (error) {
                console.error("Error al procesar el depósito:", error);
                alert("Hubo un problema al procesar tu depósito.");
            }
        });
    }

    // Función de login (usando username y password)
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch('https://backendnose-production.up.railway.app/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Login exitoso");
                    localStorage.setItem("authToken", data.token);
                    window.location.href = 'dashboard.html';
                } else {
                    alert("Error: " + data.message);
                }
            } catch (error) {
                console.error("Error en el login:", error);
                alert("Hubo un problema al intentar iniciar sesión.");
            }
        });
    }

    // Función de registro (usando username y password)
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch('https://backendnose-production.up.railway.app/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Registro exitoso, por favor inicia sesión.");
                    window.location.href = 'login.html';
                } else {
                    alert("Error: " + data.message);
                }
            } catch (error) {
                console.error("Error en el registro:", error);
                alert("Hubo un problema al intentar registrarte.");
            }
        });
    }

    // Mostrar el saldo y nombre del usuario en el dashboard
    if (window.location.pathname.includes("dashboard.html")) {
        (async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                window.location.href = 'login.html';
                return;
            }

            try {
                const response = await fetch('https://backendnose-production.up.railway.app/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const data = await response.json();

                if (response.ok) {
                    const balanceEl = document.getElementById("userBalance");
                    const nameEl = document.getElementById("userName");

                    if (balanceEl) balanceEl.textContent = `${data.balance} USDT`;
                    if (nameEl) nameEl.textContent = `Bienvenido, ${data.name}`;
                } else {
                    alert("Error: " + (data.msg || "Error desconocido"));
                    window.location.href = 'login.html';
                }
            } catch (error) {
                console.error("Error al obtener datos del usuario:", error);
                alert("Hubo un problema al obtener la información del usuario.");
            }
        })();
    }
});
