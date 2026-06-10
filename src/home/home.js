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

// Monitora se o usuário está logado de verdade dentro da Home
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Se NÃO estiver logado, expulsa para a raiz do projeto (onde está o index.html)
        window.location.href = '../../index.html';
    } else {
        // Se estiver logado, atualiza o texto de boas-vindas
        const infoUsuario = document.getElementById('home-user-info');
        if (infoUsuario && user.displayName) {
            infoUsuario.innerHTML = `Olá, ${user.displayName}! ❤️`;
        }
    }
});
// Configuração das ações assim que a página carregar
document.addEventListener('DOMContentLoaded', () => {
    const btnSair = document.getElementById('btn-logout');

    if (btnSair) {
        btnSair.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                // Remove a sessão do Firebase
                await auth.signOut();
                // Como home.html está em src/home/, volta dois níveis para achar o index.html na raiz
                window.location.href = '../../index.html';
            } catch (error) {
                console.error("Erro ao encerrar sessão:", error);
            }
        });
    }
});