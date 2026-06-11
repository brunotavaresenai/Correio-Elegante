import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-database.js";

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

let usuarioAtual = null;

// Segurança: Garante que enxerga o login active do aluno
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // ✨ CORRIGIDO: Volta dois níveis para encontrar o index.html na raiz do projeto
        window.location.href = '../../index.html';
    } else {
        usuarioAtual = user;
    }
});

// Evento para atualizar visualmente o preço na caixa azul conforme muda o select
const seletorItem = document.getElementById('carta-tipo-item');
if (seletorItem) {
    seletorItem.addEventListener('change', () => {
        const opcaoSelecionada = seletorItem.options[seletorItem.selectedIndex];
        const preco = parseFloat(opcaoSelecionada.getAttribute('data-preco'));
        const pixExibido = document.getElementById('pix-valor-exibido');
        if (pixExibido) {
            pixExibido.innerText = `R$ ${preco.toFixed(2).replace('.', ',')}`;
        }
    });
}

// Evento do botão principal (Salvar Pedido)
const btnEnviar = document.getElementById('btn-enviar-carta');
if (btnEnviar) {
    btnEnviar.addEventListener('click', async () => {
        const destinatario = document.getElementById('carta-destinatario').value.trim();
        const mensagem = document.getElementById('carta-mensagem').value.trim();
        const anonimo = document.getElementById('carta-anonimo').checked;
        const msgBox = document.getElementById('carta-msg');

        if (!seletorItem) return;

        const opcaoSelecionada = seletorItem.options[seletorItem.selectedIndex];
        const nomeItem = opcaoSelecionada.text.split('—')[0].trim();
        const valorPresente = parseFloat(opcaoSelecionada.getAttribute('data-preco'));

        if (!destinatario || !mensagem) {
            if (msgBox) {
                msgBox.className = "text-danger small";
                msgBox.innerText = "Preencha todos os campos! 🌟";
            }
            return;
        }

        if (!usuarioAtual) {
            if (msgBox) {
                msgBox.className = "text-danger small";
                msgBox.innerText = "Erro: Usuário não identificado. Faça login novamente.";
            }
            return;
        }

        try {
            if (msgBox) {
                msgBox.className = "text-warning small";
                msgBox.innerText = "Salvando pedido... Aguarde! ⏳";
            }

            const cartasRef = ref(db, 'cartas');

            // Salva as informações completas no Firebase Realtime Database
            await push(cartasRef, {
                user_id: usuarioAtual.uid,
                remetente: anonimo ? "Anônimo" : (usuarioAtual.displayName || "Estudante"),
                destinatario: destinatario,
                mensagem: mensagem,
                item_adicional: nomeItem,
                valor: valorPresente,
                entregue: false,
                pago: false,
                criado_em: Date.now()
            });

            if (msgBox) {
                msgBox.className = "text-success small";
                msgBox.innerText = "Pedido salvo com sucesso! Abrindo o Pix...";
            }

            // ====== 📄 CONFIGURAÇÃO DA CHAVE PIX DIRETA ======
            const inputPix = document.getElementById('pix-copia-cola');
            const modalPix = document.getElementById('love-pix-modal');

            if (inputPix) {
                inputPix.value = "terceirologg@gmail.com";
            }

            if (modalPix) {
                modalPix.style.display = 'flex';
            } else {
                console.error("Erro: O elemento com id 'love-pix-modal' não foi localizado no seu HTML.");
            }

        } catch (e) {
            if (msgBox) {
                msgBox.className = "text-danger small";
                msgBox.innerText = `Erro ao salvar: ${e.message}`;
            }
        }
    });
}

// Ação de copiar a Chave Pix
const btnCopiar = document.getElementById('btn-copiar-pix');
if (btnCopiar) {
    btnCopiar.addEventListener('click', () => {
        const inputPix = document.getElementById('pix-copia-cola');
        if (inputPix) {
            inputPix.select();
            inputPix.setSelectionRange(0, 99999);
            navigator.clipboard.writeText(inputPix.value);
            btnCopiar.innerText = "Chave Copiada! 📋";
            setTimeout(() => { btnCopiar.innerText = "Copiar Chave"; }, 2000);
        }
    });
}

// Fecha o modal, gera o link do WhatsApp com aviso de anonimato e joga para o histórico
const btnFecharModal = document.getElementById('btn-fechar-modal-pix');
if (btnFecharModal) {
    btnFecharModal.addEventListener('click', async () => {
        const destinatario = document.getElementById('carta-destinatario').value.trim();
        const seletorItem = document.getElementById('carta-tipo-item');
        const opcaoSelecionada = seletorItem.options[seletorItem.selectedIndex];
        const nomeItem = opcaoSelecionada.text.split('—')[0].trim();
        const valorPresente = opcaoSelecionada.getAttribute('data-preco');
        const anonimo = document.getElementById('carta-anonimo').checked;

        const usuarioLogadoAgora = auth.currentUser;
        let textoRemetente = "Estudante";

        if (anonimo) {
            textoRemetente = "❌ ANÔNIMO (Não colocar nome na carta!)";
        } else if (usuarioLogadoAgora) {
            try {
                const { get, child } = await import("https://www.gstatic.com/firebasejs/12.14.0/firebase-database.js");
                const dbRef = ref(db);
                const snapshot = await get(child(dbRef, `usuarios/${usuarioLogadoAgora.uid}`));

                if (snapshot.exists() && snapshot.val().nome) {
                    textoRemetente = snapshot.val().nome;
                } else {
                    textoRemetente = usuarioLogadoAgora.displayName || usuarioLogadoAgora.email.split('@')[0];
                }
            } catch (err) {
                textoRemetente = usuarioLogadoAgora.displayName || usuarioLogadoAgora.email.split('@')[0];
            }
        }

        const numeroWhats = "5571996764885";
        const textoMensagem = `Olá! Acabei de enviar um Correio Elegante pelo App! \n\n` +
            ` *Para:* ${destinatario}\n` +
            ` *Remetente:* ${textoRemetente}\n` +
            ` *Combo:* ${nomeItem}\n` +
            ` *Valor:* R$ ${valorPresente}\n\n` +
            ` _Estou enviando o comprovante do Pix enviado para o e-mail do Terceirão em anexo para aprovação!_`;

        const linkWhatsapp = `https://api.whatsapp.com/send?phone=${numeroWhats}&text=${encodeURIComponent(textoMensagem)}`;

        window.open(linkWhatsapp, '_blank');
        window.location.href = '../historico/historico.html';
    });
}