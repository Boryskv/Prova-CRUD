//simula um banco de dados em memória
var clientes = []

//guarda o objeto que está sendo alterado
var clienteAlterado = null

function adicionar() {
    //libera para digitar o CPF
    document.getElementById("cpf").disabled = false
    clienteAlterado = null
    mostrarModal()
    limparForm()
}
function alterar(cpf) {

    //procurar o cliente que tem o CPF clicado no alterar
    for (let i = 0; i < clientes.length; i++) {
        let cliente = clientes[i]
        if (cliente.cpf == cpf) {
            //achou o cliente, entao preenche o form
            document.getElementById("nome").value = cliente.nome
            document.getElementById("cpf").value = cliente.cpf
            document.getElementById("telefone").value = cliente.telefone
            document.getElementById("ndg").value = cliente.ndg
            document.getElementById("ndp").value = cliente.ndp

            clienteAlterado = cliente
        }
    }
    //bloquear o cpf para nao permitir alterá-lo
    document.getElementById("cpf").disabled = true
    mostrarModal()
}
function excluir(cpf) {
    if (confirm("Você deseja realmente excluir?")) {
        fetch("http://localhost:3000/excluir/" + cpf ,{
            headers: {
                "Content-type": "application/json"
            },
            method: "DELETE"
        }).then((response) =>{
            //após terminar de excluir, recarrega a lista de clientes
            recarregarClientes();
            alert("Cliente excluído com sucesso")
        }).catch((error) => {
            console.log(error)
            alert("Não foi possível excluir o cliente")
        })

        exibirDados()
    }
}
function mostrarModal() {
    let containerModal = document.getElementById("container-modal")
    containerModal.style.display = "flex"
}
function ocultarModal() {
    let containerModal = document.getElementById("container-modal")
    containerModal.style.display = "none"
}
function cancelar() {
    ocultarModal()
    limparForm()
}
function salvar() {
    let nome = document.getElementById("nome").value
    let cpf = document.getElementById("cpf").value
    let telefone = document.getElementById("telefone").value
    let ndg = document.getElementById("ndg").value 
    let ndp = document.getElementById("ndp").value 


    //se não estiver alterando ninguém, adiciona no vetor
    if (clienteAlterado == null) {
        let cliente = {
            "nome": nome,
            "cpf": cpf,
            "telefone": telefone,
            "ndg": ndg,
            "ndp" : ndp
        }

        //salva o cliente no back-end
        fetch("http://localhost:3000/cadastrar", {
            headers: {
                "Content-type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(cliente)
        }).then(() => {
            clienteAlterado = null
            //limpa o form
            limparForm()
            ocultarModal()
            
            recarregarClientes();
            alert("Cliente cadastrado com sucesso!")
        }).catch(() => {
            alert("Ops... algo deu errado!")
        })

       
    } else {
        clienteAlterado.nome = nome
        clienteAlterado.cpf = cpf
        clienteAlterado.telefone = telefone
        clienteAlterado.ndg = ndg
        clienteAlterado.ndp = ndp

        fetch("http://localhost:3000/alterar/",{
            headers: {
                "Content-type": "application/json"
            },
            method: "PUT",
            body:  JSON.stringify(clienteAlterado)
        }).then((response) => {
            
            clienteAlterado = null
            //limpa o form
            limparForm()
            ocultarModal()

            recarregarClientes();
            alert("Cliente Alterado com sucesso!")
        }).catch((error) => {
            alert("Não foi possível alterar o cliente")
        })
    }

}

function exibirDados() {
    
    clientes.sort((a, b) => a.nome.localeCompare(b.nome));
    let tbody = document.querySelector("#table-customers tbody")

    //antes de listar os clientes, limpa todas as linhas
    tbody.innerHTML = ""

    for (let i = 0; i < clientes.length; i++) {
        let linha = `
        <tr>
            <td>${clientes[i].nome}</td>
            <td>${clientes[i].cpf}</td>
            <td>${clientes[i].telefone}</td>
            <td>${clientes[i].ndg}</td>
            <td>${clientes[i].ndp}</td>
            <td>
                <button onclick="alterar('${clientes[i].cpf}')">Alterar</button>
                <button onclick="excluir('${clientes[i].cpf}')" class="botao-excluir">Excluir</button>
            </td>
        </tr>`

        let tr = document.createElement("tr")
        tr.innerHTML = linha

        tbody.appendChild(tr)
    }

}


function buscarDados() {
    let buscar = document.getElementById("busca").value.toLowerCase();
    let tbody = document.querySelector("#table-customers tbody");
    tbody.innerHTML = "";

    let clientesFiltrados = clientes.filter(cliente =>
        cliente.nome.toLowerCase() === buscar
    );
    if (buscar === "") {
        exibirDados(); // Se a busca estiver vazia, exibir todos os clientes
        return;
    } else{
    for (let i = 0; i < clientesFiltrados.length; i++) {
        let linha = `
                    <tr>
                        <td>${clientesFiltrados[i].nome}</td>
                        <td>${clientesFiltrados[i].cpf}</td>
                        <td>${clientesFiltrados[i].telefone}</td>
                        <td>${clientesFiltrados[i].ndg}</td>
                        <td>${clientesFiltrados[i].ndp}</td>
                        <td>
                            <button onclick="alterar('${clientesFiltrados[i].cpf}')">Alterar</button>
                            <button onclick="excluir('${clientesFiltrados[i].cpf}')" class="botao-excluir">Excluir</button>
                        </td>
                    </tr>`;

        let tr = document.createElement("tr");
        tr.innerHTML = linha;
        tbody.appendChild(tr);
    }
    }
}


function limparForm() {
    document.getElementById("nome").value = ""
    document.getElementById("cpf").value = ""
    document.getElementById("telefone").value = ""
    document.getElementById("ndg").value = ""
    document.getElementById("ndp").value = ""

}

function recarregarClientes() {
    fetch("http://localhost:3000/listar", {
        headers: {
            "Content-type": "application/json"
        },
        method: "GET"
    }).then((response) => response.json()) //converte a resposta para JSON
        .then((response) => {
            console.log(response)
            clientes = response
            exibirDados()
        }).catch((error) => {
            alert("Erro ao listar os clientes")
        })
}

//Exercício de lógica na prova
//Inserir uma caixa de busca no front-end e um botão Buscar.
//Quando o botão for clicado, fazer a busca no banco de dados do back-end e atualizar a tabela de clientes.
//Ordenar a lista de clientes pelo nome.

