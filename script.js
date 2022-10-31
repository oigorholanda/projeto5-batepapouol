let chat = [];
let chatOld = [];
let mensagem = [];
let nome;
let usuario;
let onlineID;
let ChatID;

//desabilita o botão no início
document.getElementById("botao").disabled = true;

//cria um event listener para o input
document.getElementById("input").addEventListener("input", function(event){
    
  //busca conteúdo do input
    var conteudo = document.getElementById("input").value;
  
    //valida conteudo do input 
    if (conteudo !== null && conteudo !== '') {
      //habilita o botão
      document.getElementById("botao").disabled = false;
      const botao = document.querySelector('.login button');
      botao.classList.add('habilitado');
    } else {
      //desabilita o botão se o conteúdo do input ficar em branco
      document.getElementById("botao").disabled = true;
      const botao = document.querySelector('.login button');
      botao.classList.remove('habilitado');
    }
});

//Cadastra e forma o objeto com o nome de usuário
function cadastroNome() {
    const input = document.querySelector('.login input');
    input.classList.add('hidden');
    const botao = document.querySelector('.login button');
    botao.classList.add('hidden');
    const gif = document.querySelector('.login .gif');
    gif.classList.remove('hidden');
    const texto = document.querySelector('.login .texto');
    texto.classList.remove('hidden');

    nome = document.querySelector('.login input').value;
    usuario = {
        name: nome
    }
    entrarNaSala();
    ChatID = setInterval(buscarMensagens, 3000);
}

//Requisita a autenticação do usuário
function entrarNaSala() {
    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario);
    promessa.then(loginConfirmado); //se der tudo certo com a resposta do servidor
    promessa.catch(errologin); // ser der erro com a resposta do servidor
}

function errologin(erro) {
    if (erro.response.status === 400) {
        alert(`Oops!
Nome de usuário inválido ou já em uso, por favor escolha outro.
        `);
    }
    window.location.reload();
}

function loginConfirmado(resposta) {
    console.log("Usuário autenticado");
    console.log(resposta);
    const libera = document.querySelector('.login');
    libera.classList.add('hidden');
    onlineID = setInterval(avisoLogado, 5000);
}

function avisoLogado() {
    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario);
    promessa.then(() => console.log("Usuário Online")); //se der tudo certo com a resposta do servidor
    promessa.catch(() => console.log('Erro na confirmação de usuário logado')); // ser der erro com a resposta do servidor
}

function buscarMensagens() {
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promessa.then(mostrarMensagens); //se der tudo certo com a resposta do servidor
    promessa.catch(() => console.log('Erro no download das mensagens')); // ser der erro com a resposta do servidor
}

function mostrarMensagens(resposta) {
    chat = resposta.data

    if (chat !== chatOld) {

        console.log(chatOld);
        console.log(chat);
        const divchat = document.querySelector('.mensagens');
        divchat.innerHTML = "";

        for (let i = 0; i < chat.length; i++) {
            if (chat[i].type === "status") {
                divchat.innerHTML += `
            <li>
                <div class="status">
                <span>(${chat[i].time})</span>
                <strong>${chat[i].from}</strong> 
                ${chat[i].text}
                </div>
            </li>
            `;
            }

            if (chat[i].type === "message") {
                divchat.innerHTML += `
            <li>
                <div class="msg">
                <span>(${chat[i].time})</span>
                <strong>${chat[i].from}</strong>
                para <strong>${chat[i].to}</strong>: 
                ${chat[i].text}
                </div>
            </li>
            `;
            }

            if (chat[i].type === "private_message") {
                divchat.innerHTML += `
            <li>
                <div class="rsv">
                <span>(${chat[i].time})</span>
                <strong>${chat[i].from}</strong>
                para <strong>${chat[i].to}</strong>: 
                ${chat[i].text}
                </div>
            </li>
            `;
            }
        }

        chatOld = chat;
        const msgRecente = document.querySelector('.mensagens').lastElementChild;
        msgRecente.scrollIntoView();
        
    }
}


function enviarMensagens() {
    const texto = document.querySelector('.texto input').value;
    document.querySelector('.texto input').value = '';

    mensagem = {
        from: nome,
        to: 'Todos',
        text: texto,
        type: "message" // ou "private_message" para o bônus 
    }

    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', mensagem)
    promessa.then(msgEnviada); //se der tudo certo com a resposta do servidor
    promessa.catch(erroMSG); // ser der erro com a resposta do servidor

}

function msgEnviada() {
    console.log('Mensagem enviada');

    buscarMensagens();
}

function erroMSG(erro) {
    console.log('Erro no upload das mensagens')
    console.log(erro);

    if (confirm("Erro no envio de mensagens, deseja recarregar a pagina?")) {
        window.location.reload();
    };
}


//Etapa 1: Comunicação entre a pagina e o servidor -> Bibliotexa Axios
//Etapa 2: Pegar as receitas no servidor (request)
//Etapa 3: receber a resposta (response) do servidor
//Etapa 4: mostrar da tela (renderizar) as respostas
