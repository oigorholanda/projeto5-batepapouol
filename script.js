let array = [];


function armazenarDados() {

    //Definir os elementos dos campos de informação de dados do usuário
    const elementoNome = document.querySelector('.nome-usuario');
    const elementoPrivado = document.querySelector('.privado');
    const elementoMensagem = document.querySelector('.mensagem');

    //Armazenar no Array em formato de objeto
    array = [
        {}
    ]
}



//Etapa 1: Comunicação entre a pagina e o servidor -> Bibliotexa Axios

//Etapa 2: Pegar as receitas no servidor (request)
function pegarDados() {
    const promessa = axios.get('URL');
    promessa.then(DadosChegaram); //se der tudo certo com a resposta do servidor
    promessa.catch(Erro); // ser der erro com a resposta do servidor

}
pegarDados();

//Etapa 3: receber a resposta (response) do servidor
function DadosChegaram(resposta) {
    console.log("Chegaram os dados");
    console.log(resposta.data);

    //Etapa 4: mostrar da tela (renderizar) as respostas
    array = resposta.data;

    mostrarDadosNaTela();
}

function Erro(erro) {
    console.log(erro);
    if (erro.response.status === 404) {
        alert("Sem comunicação com o servidor!");
    }

    if (erro.response.status === 409) {
        alert("Essa receita já existe, escolha um outro nome.");
    }

    if (erro.response.status === 422) {
        alert("O campo de receitas precisa ter pelo menos 03 caracteres e o demais 10 caracteres.");
    }

}

function mostrarDadosNaTela() {
    const elementoNome = document.querySelector('.nome');
    const elementoPrivado = document.querySelector('.privado');
    const elementoMensagem = document.querySelector('.mensagem');

    elementoNome.innerHTML = array.nome;
    elementoPrivado.innerHTML = array.privado;
    elementoMensagem = array.mensagem;

    for (let i = 0; i < array.length; i++) {
        elemento.innerHTML += `
        <li>${array[i].name}</li>
        `;
    }
}

function UparDados() {
    const promessa = axios.push('URL', array)
    promessa.then(DadosChegaram); //se der tudo certo com a resposta do servidor
    promessa.catch(Erro); // ser der erro com a resposta do servidor
}