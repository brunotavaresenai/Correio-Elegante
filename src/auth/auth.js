import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

// CREDENCIAIS OFICIAIS CORRIGIDAS (Trocado o 'O' por '0' na apiKey)
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

// Inicializa o Firebase e o serviço de Autenticação
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Monitor de Sessão: Se o aluno já estiver logado, pula essa tela e vai para a Home
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = '../home/home.html';
    }
});

// Executa as configurações assim que os elementos HTML carregarem na tela
document.addEventListener('DOMContentLoaded', () => {

    // Elementos de Interface das Abas e Formulários
    const tabLogin = document.getElementById('tab-login');
    const tabCadastro = document.getElementById('tab-cadastro');
    const formLogin = document.getElementById('form-login');
    const formCadastro = document.getElementById('form-cadastro');
    const msgBox = document.getElementById('auth-msg');

    // 🔄 ALTERNÂNCIA DE TELAS (ENTRAR VS CADASTRAR)
    if (tabLogin && tabCadastro) {
        tabLogin.addEventListener('click', () => {
            if (formLogin) formLogin.style.display = 'block';
            if (formCadastro) formCadastro.style.display = 'none';
            tabLogin.classList.add('active');
            tabCadastro.classList.remove('active');
            if (msgBox) msgBox.innerText = "";
        });

        tabCadastro.addEventListener('click', () => {
            if (formLogin) formLogin.style.display = 'none';
            if (formCadastro) formCadastro.style.display = 'block';
            tabCadastro.classList.add('active');
            tabLogin.classList.remove('active');
            if (msgBox) msgBox.innerText = "";
        });
    }

    // 🔐 FUNÇÃO PRINCIPAL: Criar Conta do Usuário
    async function realizarCadastro() {
        const nomeInput = document.getElementById('cad-nome');
        const emailInput = document.getElementById('cad-email');
        const senhaInput = document.getElementById('cad-senha');

        if (!emailInput || !senhaInput) {
            if (msgBox) msgBox.innerText = "Erro: Componentes do formulário sumiram no HTML.";
            return;
        }

        const nome = nomeInput ? nomeInput.value.trim() : "";
        const email = emailInput.value.trim();
        const senha = senhaInput.value;

        if (!email || !senha) {
            if (msgBox) {
                msgBox.className = "text-danger small mt-2 text-center fw-bold";
                msgBox.innerText = "Preencha o e-mail e a senha! 💕";
            }
            return;
        }
        if (senha.length < 6) {
            if (msgBox) {
                msgBox.className = "text-danger small mt-2 text-center fw-bold";
                msgBox.innerText = "A senha precisa ter no mínimo 6 caracteres! 🔑";
            }
            return;
        }

        try {
            if (msgBox) {
                msgBox.className = "text-warning small mt-2 text-center fw-bold";
                msgBox.innerText = "Criando sua conta...";
            }

            // Manda a requisição oficial para o Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);

            // Vincula o nome/apelido digitado ao registro dele
            await updateProfile(userCredential.user, {
                displayName: nome ? nome : "Estudante"
            });

            // Redireciona para o painel de enviar bilhetes
            window.location.href = '../home/home.html';

        } catch (error) {
            if (msgBox) {
                msgBox.className = "text-danger small mt-2 text-center fw-bold";
                if (error.code === 'auth/email-already-in-use') {
                    msgBox.innerText = "Este e-mail já está em uso!";
                } else if (error.code === 'auth/invalid-email') {
                    msgBox.innerText = "E-mail com formato inválido.";
                } else {
                    msgBox.innerText = `Erro: ${error.message}`;
                }
            }
        }
    }

    // 🔓 FUNÇÃO AUXILIAR: Efetuar o Login existente
    async function realizarLogin() {
        const emailInput = document.getElementById('login-email');
        const senhaInput = document.getElementById('login-senha');

        if (!emailInput || !senhaInput) return;

        const email = emailInput.value.trim();
        const senha = senhaInput.value;

        if (!email || !senha) {
            if (msgBox) {
                msgBox.className = "text-danger small mt-2 text-center fw-bold";
                msgBox.innerText = "Por favor, preencha o e-mail e a senha.";
            }
            return;
        }

        try {
            if (msgBox) {
                msgBox.className = "text-warning small mt-2 text-center fw-bold";
                msgBox.innerText = "Entrando...";
            }
            await signInWithEmailAndPassword(auth, email, senha);
            window.location.href = '../home/home.html';
        } catch (error) {
            if (msgBox) {
                msgBox.className = "text-danger small mt-2 text-center fw-bold";
                msgBox.innerText = "E-mail ou senha inválidos. ❌";
            }
        }
    }

    // GATILHOS DE CLIQUE DOS BOTÕES VERMELHOS
    const btnLogin = document.getElementById('btn-fazer-login');
    if (btnLogin) {
        btnLogin.addEventListener('click', (e) => {
            e.preventDefault();
            realizarLogin();
        });
    }

    const btnCadastrar = document.getElementById('btn-fazer-cadastro');
    if (btnCadastrar) {
        btnCadastrar.addEventListener('click', (e) => {
            e.preventDefault();
            realizarCadastro();
        });
    }
});