import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

// SUAS CREDENCIAIS REAIS DO FIREBASE (ATUALIZADO)
const firebaseConfig = {
    apiKey: "AIzaSyAiOLSOLSGbxPs2cwnmL6PBRtaNjETtywI",
    authDomain: "correio-elegante-terceirao.firebaseapp.com",
    databaseURL: "https://correio-elegante-terceirao-default-rtdb.firebaseio.com",
    projectId: "correio-elegante-terceirao",
    storageBucket: "correio-elegante-terceirao.firebasestorage.app",
    messagingSenderId: "274696833582",
    appId: "1:274696833582:web:e07515eeee068472676dbf",
    measurementId: "G-EF8W91XPP9"
};

// Inicializa o app passando a configuração correta
const app = initializeApp(firebaseConfig);

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, get, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = { /* Cole suas credenciais aqui */ };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

onAuthStateChanged(auth, (user) => {
    if (!user) { window.location.href = 'index.html'; }
    else { carregarCartas(user.uid); }
});

async function carregarCartas(uid) {
    const container = document.getElementById('cartas-container');
    try {
        const cartasRef = ref(db, 'cartas');
        const consulta = query(cartasRef, orderByChild('user_id'), equalTo(uid));
        const snapshot = await get(consulta);

        container.innerHTML = "";
        if (!snapshot.exists()) { container.innerHTML = "<p class='text-muted small text-center'>Nenhuma carta.</p>"; return; }

        const lista = [];
        snapshot.forEach(c => { lista.push(c.val()); });
        lista.reverse().forEach(dados => {
            const statusText = dados.entregue ? "Entregue ✨" : "Aguardando Pix 📲";
            const statusClass = dados.entregue ? "entregue" : "pendente";
            container.innerHTML += `
                <div class="cyber-card">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <strong style="color: var(--vermelho)">Para: ${dados.destinatario}</strong>
                        <span class="status-badge ${statusClass}">${statusText}</span>
                    </div>
                    <p class="small mb-1 text-dark">"${dados.mensagem}"</p>
                </div>`;
        });
    } catch (e) { container.innerHTML = "<p class='text-danger small'>Erro ao carregar.</p>"; }
}