import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
// Garantindo as importações do banco de dados para buscar o nome do usuário
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-database.js";

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
const db = getDatabase(app); // Inicializa o banco de dados

// Monitora se o usuário está logado e busca o nome dele
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        // Se NÃO estiver logado, expulsa para a raiz do projeto (onde está o index.html)
        window.location.href = '../../index.html';
    } else {
        const infoUsuario = document.getElementById('home-user-info');
        if (infoUsuario) {
            try {
                // Busca o nó do usuário baseado no UID dele no banco de dados
                const dbRef = ref(db);
                const snapshot = await get(child(dbRef, `usuarios/${user.uid}`));

                if (snapshot.exists() && snapshot.val().nome) {
                    // Substitui o "Estudante" pelo Nome Real cadastrado!
                    infoUsuario.innerHTML = `Olá, ${snapshot.val().nome}! ❤️`;
                } else {
                    // Plano B caso não encontre o nome completo no banco
                    const nomeFallback = user.displayName || user.email.split('@')[0];
                    infoUsuario.innerHTML = `Olá, ${nomeFallback}! ❤️`;
                }
            } catch (error) {
                console.error("Erro ao buscar nome do usuário:", error);
                // Plano C para o app não travar caso a conexão falhe
                infoUsuario.innerHTML = `Olá! ❤️`;
            }
        }
    }
});

// Configuração do botão de sair (mantido igual)
document.addEventListener('DOMContentLoaded', () => {
    const btnSair = document.getElementById('btn-logout');
    if (btnSair) {
        btnSair.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await auth.signOut();
                window.location.href = '../../index.html';
            } catch (error) {
                console.error("Erro ao encerrar sessão:", error);
            }
        });
    }
});