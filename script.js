let mensagens = [];
let usuario;
let ID;


// setTimeout(cadastroNome, 3000);
buscarMensagens();

//Cadastra e forma o objeto com o nome de usuário
function cadastroNome() {
    document.querySelector('input').placeholder = 'Escreva Aqui...';
    const nome = prompt('Informe seu nome de usuário:');
    usuario = {
        name: nome
    }
    entrarNaSala();
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
    cadastroNome();
}

function loginConfirmado(resposta) {
    console.log("Usuário autenticado");
    console.log(resposta);

    ID = setInterval(avisoLogado, 5000);
}

function avisoLogado() {
    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario);
    promessa.then(userOnline); //se der tudo certo com a resposta do servidor
    promessa.catch(ErroOnline); // ser der erro com a resposta do servidor
}

function userOnline() {
    console.log("Usuário Online");
}

function ErroOnline(erro) {
    console.log('Erro na confirmação de usuário logado')
    console.log(erro);
}


function buscarMensagens() {
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promessa.then(mostrarMensagens); //se der tudo certo com a resposta do servidor
    promessa.catch(ErroMensagens); // ser der erro com a resposta do servidor

}

function mostrarMensagens(resposta) {
    console.log(resposta);
    mensagens = resposta.data


    const chat = document.querySelector('.mensagens');


    for (let i = 0; i < mensagens.length; i++) {
        if (mensagens[i].type === "status") {
            chat.innerHTML += `
            <div class="status">
            <span>(${mensagens[i].time})</span>
            <strong>${mensagens[i].from}</strong> 
            ${mensagens[i].text}
            </div>
            `;
        }

        if (mensagens[i].type === "message") {
            chat.innerHTML += `
            <div class="msg">
            <span>(${mensagens[i].time})</span>
            <strong>${mensagens[i].from}</strong>
            para <strong>${mensagens[i].to}</strong>: 
            ${mensagens[i].text}
            </div>
            `;
        }

        if (mensagens[i].type === "private_message") {
            chat.innerHTML += `
            <div class="rsv">
            <span>(${mensagens[i].time})</span>
            <strong>${mensagens[i].from}</strong>
            para <strong>${mensagens[i].to}</strong>: 
            ${mensagens[i].text}
            </div>
            `;
        }
    }
}

function ErroMensagens(erro) {
    console.log('Erro no download das mensagens')
    console.log(erro);
}


//Etapa 1: Comunicação entre a pagina e o servidor -> Bibliotexa Axios
//Etapa 2: Pegar as receitas no servidor (request)
//Etapa 3: receber a resposta (response) do servidor
//Etapa 4: mostrar da tela (renderizar) as respostas
