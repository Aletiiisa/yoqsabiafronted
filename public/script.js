// Función de login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch('https://backendnose-production.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
        alert("Login exitoso");
        // Guardar token en localStorage
        localStorage.setItem("authToken", data.token);
        window.location.href = 'dashboard.html';
    } else {
        alert("Error: " + data.message);
    }
});

// Función de registro
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch('https://backendnose-production.up.railway.app/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
        alert("Registro exitoso, por favor inicia sesión.");
        window.location.href = 'login.html';
    } else {
        alert("Error: " + data.message);
    }
});

// Mostrar el saldo y nombre del usuario en el dashboard
window.onload = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
        window.location.href = 'login.html';
    }

    const response = await fetch('https://backendnose-production.up.railway.app/api/balance', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (response.ok) {
        // Mostrar el saldo
        document.getElementById("userBalance").textContent = `${data.balance} USDT`;

        // Mostrar el nombre del usuario
        document.getElementById("userName").textContent = `Bienvenido, ${data.name}`;

        // Puedes agregar más lógica si deseas mostrar otros datos del usuario, como el correo
    } else {
        alert("Error: " + data.message);
        window.location.href = 'login.html';
    }
};

// Función para comprar programas en la tienda
async function buyProgram(programCost) {
    const token = localStorage.getItem("authToken");

    if (!token) {
        alert("Por favor, inicia sesión para realizar una compra.");
        return;
    }

    const response = await fetch('https://backendnose-production.up.railway.app/api/balance', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (data.balance >= programCost) {
        // Si el saldo es suficiente, realizar la compra
        alert(`Compra exitosa de Programa ${programCost} USDT.`);
    } else {
        // Si no tiene saldo suficiente
        alert("No tienes suficiente saldo para comprar este programa.");
    }
}

// Asignar eventos de compra de programas en la tienda
document.getElementById("buyProgram1").addEventListener("click", () => buyProgram(20));
document.getElementById("buyProgram2").addEventListener("click", () => buyProgram(35));
document.getElementById("buyProgram3").addEventListener("click", () => buyProgram(45));

// Función para subir el comprobante de pago
document.getElementById("depositForm").addEventListener("submit", async (e) => {
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
