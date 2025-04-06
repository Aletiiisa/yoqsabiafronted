document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const depositForm = document.getElementById("depositForm");

    // Función de login (usando username y password)
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

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
        });
    }

    // Función de registro (usando username y password)
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

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

            const response = await fetch('https://backendnose-production.up.railway.app/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                const balanceEl = document.getElementById("userBalance");
                const nameEl = document.getElementById("userName");

                if (balanceEl) balanceEl.textContent = `${data.balance} USDT`;
                // Como tu endpoint devuelve "name", lo usamos para mostrar el usuario
                if (nameEl) nameEl.textContent = `Bienvenido, ${data.name}`;
            } else {
                alert("Error: " + (data.msg || "Error desconocido"));
                window.location.href = 'login.html';
            }
        })();
    }

    // Función para comprar programas
    async function buyProgram(programCost) {
        const token = localStorage.getItem("authToken");

        if (!token) {
            alert("Por favor, inicia sesión para realizar una compra.");
            return;
        }

        // Usamos la misma ruta /api/balance para obtener el saldo
        const response = await fetch('https://backendnose-production.up.railway.app/api/balance', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.balance >= programCost) {
            alert(`Compra exitosa de Programa por ${programCost} USDT.`);
        } else {
            alert("No tienes suficiente saldo para comprar este programa.");
        }
    }

    // Eventos para botones de compra
    const btn1 = document.getElementById("buyProgram1");
    const btn2 = document.getElementById("buyProgram2");
    const btn3 = document.getElementById("buyProgram3");

    if (btn1) btn1.addEventListener("click", () => buyProgram(20));
    if (btn2) btn2.addEventListener("click", () => buyProgram(35));
    if (btn3) btn3.addEventListener("click", () => buyProgram(45));

    // Subir comprobante de pago
    if (depositForm) {
        depositForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const token = localStorage.getItem("authToken");
            if (!token) {
                alert("Por favor, inicia sesión para realizar un depósito.");
                return;
            }

            const transactionId = document.getElementById("transactionId").value;
            const file = document.getElementById("file").files[0];

            if (!file) {
                alert("Por favor, selecciona un archivo.");
                return;
            }

            const formData = new FormData();
            formData.append("transactionId", transactionId);
            formData.append("file", file);

            const response = await fetch('https://backendnose-production.up.railway.app/api/deposit', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                alert("Comprobante subido correctamente. Espera a que sea aprobado.");
            } else {
                alert("Error: " + data.message);
            }
        });
    }
});
