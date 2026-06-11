import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-database.js";

// 1. Configuração do Firebase (Mantida a sua Oficial)
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
const db = getDatabase(app);

// 2. Proteção de Rota / Persistência
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = 'src/home/home.html';
    }
});

// 3. Controle das Abas e Fluxos (Aguarda o DOM)
document.addEventListener('DOMContentLoaded', () => {
    const tabLogin = document.getElementById('tab-login');
    const tabCadastro = document.getElementById('tab-cadastro');
    const formLogin = document.getElementById('form-login');
    const formCadastro = document.getElementById('form-cadastro');
    const msgErro = document.getElementById('auth-msg');

    // Elementos de Login
    const emailLogin = document.getElementById('login-email');
    const senhaLogin = document.getElementById('login-senha');
    const btnFazerLogin = document.getElementById('btn-fazer-login');

    // Elementos de Cadastro
    const nomeCad = document.getElementById('cad-nome');
    const emailCad = document.getElementById('cad-email');
    const senhaCad = document.getElementById('cad-senha');
    const btnFazerCadastro = document.getElementById('btn-fazer-cadastro');

    // 🔄 ALTERNÂNCIA DAS ABAS
    if (tabLogin && tabCadastro && formLogin && formCadastro) {
        tabLogin.addEventListener('click', () => {
            tabLogin.classList.add('active');
            tabCadastro.classList.remove('active');
            formLogin.style.display = 'block';
            formCadastro.style.display = 'none';
            if (msgErro) msgErro.textContent = '';
        });

        tabCadastro.addEventListener('click', () => {
            tabCadastro.classList.add('active');
            tabLogin.classList.remove('active');
            formCadastro.style.display = 'block';
            formLogin.style.display = 'none';
            if (msgErro) msgErro.textContent = '';
        });
    }

    // 🔑 LÓGICA DE LOGIN
    if (btnFazerLogin) {
        btnFazerLogin.addEventListener('click', async () => {
            const email = emailLogin.value.trim();
            const senha = senhaLogin.value.trim();

            if (!email || !senha) {
                msgErro.textContent = "Preencha todos os campos para entrar!";
                return;
            }

            try {
                btnFazerLogin.textContent = "Entrando...";
                btnFazerLogin.disabled = true;
                await signInWithEmailAndPassword(auth, email, senha);
            } catch (error) {
                console.error(error);
                msgErro.textContent = "E-mail ou senha incorretos!";
                btnFazerLogin.textContent = "Entrar no App";
                btnFazerLogin.disabled = false;
            }
        });
    }

    // 📝 LÓGICA DE CADASTRO
    if (btnFazerCadastro) {
        btnFazerCadastro.addEventListener('click', async () => {
            const nome = nomeCad.value.trim();
            const email = emailCad.value.trim();
            const senha = senhaCad.value.trim();

            if (!email || !senha) {
                msgErro.textContent = "E-mail e Senha são obrigatórios!";
                return;
            }
            if (senha.length < 6) {
                msgErro.textContent = "A senha deve ter pelo menos 6 caracteres!";
                return;
            }

            const nomeFinal = nome || "Estudante Anonimizado";

            try {
                btnFazerCadastro.textContent = "Criando Conta...";
                btnFazerCadastro.disabled = true;

                const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
                const user = userCredential.user;

                await updateProfile(user, { displayName: nomeFinal });

                await set(ref(db, `usuarios/${user.uid}`), {
                    nome: nomeFinal,
                    email: email,
                    uid: user.uid
                });

            } catch (error) {
                console.error(error);
                if (error.code === 'auth/email-already-in-use') {
                    msgErro.textContent = "Este e-mail já está cadastrado!";
                } else {
                    msgErro.textContent = "Erro ao criar conta. Tente novamente!";
                }
                btnFazerCadastro.textContent = "Criar Minha Conta";
                btnFazerCadastro.disabled = false;
            }
        });
    }
});