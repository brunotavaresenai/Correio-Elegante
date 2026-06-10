import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAiOLS0LSGbxPs2cwnmL6PBRtaNjETtywI",
    authDomain: "correio-elegante-terceirao.firebaseapp.com",
    databaseURL: "https://correio-elegante-terceirao-default-rtdb.firebaseio.com",
    projectId: "correio-elegante-terceirao",
    storageBucket: "correio-elegante-terceirao.firebasestorage.app",
    messagingSenderId: "274696833582",
    appId: "1:274696833582:web:e07515eeee068472676dbf",
    measurementId: "G-EF8W91XPP9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Monitora o login ativo do estudante
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Se a sessão caiu ou deslogou, manda pro login
        window.location.href = '../auth/index.html';
    } else {
        // Atualiza a frase "Olá!" com o nome real cadastrado do aluno
        const infoUsuario = document.getElementById('home-user-info');
        if (infoUsuario && user.displayName) {
            infoUsuario.innerHTML = `Olá, ${user.displayName}! ❤️`;
        }
    }
});

// Executa as ações assim que a página carregar os elementos na tela
document.addEventListener('DOMContentLoaded', () => {
    const btnSair = document.getElementById('btn-logout');

    if (btnSair) {
        btnSair.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                // Remove o token de login do navegador via Firebase
                await auth.signOut();
                // Redireciona trancando a página
                window.location.href = '../auth/index.html';
            } catch (error) {
                console.error("Erro ao encerrar sessão:", error);
            }
        });
    }
});