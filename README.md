<p align="center">
    <img src="interface/public/images/logo.png" width="50%">
</p>

# **Plataforma de Gestão e Disponibilização de Recursos Educativos**

A Aplicação Web desenvolvilda consiste, assim como o próprio nome indica, numa aplicação que gere e disponibiliza recursos educativos. A aplicação é destinada quer a alunos como a professores.

## ⚙️ **Setup**



## 🎯 **Objetivos**
A conceção da Aplicação Web apresenta os seguintes requisitos base:

- Disponibilizar recursos educativos de vários tipos: livros, artigos, aplicações, trabalhos de alunos, monografias, relatórios, ...

- Permitir adicionar novos tipos de recursos e novos recursos;

- Ter os recursos classificados por ano, tipo, tema, ...(utilização de hashtags ou de uma taxonomia classificativa);

- Permitir que um utilizador faça um Post sobre um recurso;

- Permitir que os outros utilizadores comentem Posts;

- Criar um sistema de ranking para os recursos (atribuição de estrelas pelos utilizadores);

## 🧱 **Estrutura do Projeto, Conceção/Desenho da Resolução**

O projeto encontra-se dividido em 3 partes: 
- Servidor de Autenticação
- API de dados
- Interface

### **Servidor de Autenticação**

Assim como sugerido e já mencionado anteriormente, deverão existir 3 tipos de utilizadores, sendo eles: alunos, professores e administrador. 

Quando é registado um utilizador, o mesmo tem que indicar os seguintes campos: e-mail, nome, tipo de utilizador, palavra passe e filiação.

Adicionalmente, quando um utilizador inicia sessão, é gerada uma *cookie* de sessão (*JsonWebToken*). 

Esta cookie é utilizada sempre que o utilizador pretende realizar uma operação no sistema de modo a verificar a sua validade, ou seja se o login do utilizador é válido.


### **API de dados**

Para a API de dados, dividimos em 5 estrutras:
- Cursos
- Meta Files
- Meta Types
- Noticias
- Universidades

### Cursos

Para guardar toda a informação relativa aos cursos temos a seguinte estrutura:
```js
const commentSchema = new mongoose.Schema({
    "comment": String,
    "idUser": String
})

const postSchema = new mongoose.Schema({
    "title": String,
    "description": String,
    "comments": [commentSchema],
    "publishedBy": String,
    "id_meta": String,
})

const cursoSchema = new mongoose.Schema({
    "nome": String,
    "descricao": String,
    "professores": Array,
    "alunos": Array,
    "posts": [postSchema],
    "visibilidade": String,
    "regente": String,
    "estado": Boolean
})
```
Cada curso contém o nome assim como uma descrição.

Assim como a lista de alunos e professores nele presentes, identificados pelo seu _id.

A visibilidade poderá ser:
- privado
- público

Ao criar um curso o estado será false, e passará a true ao 
após à aprovação do admin. Os alunos só poderão aceder ao curso depois deste ser aprovado.A

Cada curso, terá posts que poderão conter comentários, assim como atruibutos que descritivos.

Cada curso terá um regente que será o responsável por aceitar e remover alunos.

### Meta Files

Para guardar a meta informação relativa aos recursos de cada curso:
```js
const ratingSchema = new mongoose.Schema({
    "id": String,
    "value": Number
})

const metaSchema = new mongoose.Schema({
    "id":String,
    "name": String,
    "type": String,
    "title": String,
    "subtitle": String,
    "description": String,
    "creationDate": Date,
    "registationDate": Date,
    "tags": [String],
    "theme": String,
    "ratings": [ratingSchema],
    "author": String,
    "uploadBy": String,
    "course": String,
    "mimetype": String,
    "size": Number,
})
```

Cada ficheiro terá os atributos mencionados acima que o descrevem.
Alguns destes podem ser editados, outros não.
Especial destaque para os ratings que são dados pelos alunos, cada rating será o identificador do aluno assim como um número de 1 a 5.

### Meta Types

Para guardar informação relativa aos tipos de ficheiros presenter
```js
const typeSchema = new mongoose.Schema({
    "id": String,
    "state": String // ('active', 'inactive','pending')
})
```

O id corresponde ao nome do tipo de ficheiro, e o state corresponde ao estado deste tipo, que poderá ser:
- active
- inactive
- pending

Neste momento, estamos a utilizar apenas o estado active, pois apenas permitimos que seja o admin a adicionar novos tipos de ficheiros.
Futuramente, poderá ser adicionada a funcionalidade de professores sugerirem novos tipos de ficheiros, que terão de ser aprovados pelo admin.


### Notícias

Para guardar tanto notificações como pedidos relativos a cada utilizador temos:
```js
const notificationSchema = new mongoose.Schema({
    "descricao": String,
    "lida": Boolean,
    "link": String,
})


const pedidoSchema = new mongoose.Schema({
    "tipo": String,
    "feitoPor": String,
    "info": String,
    "respondido": Boolean,
    "aceite":Boolean,
    "curso": String
})


const noticiasSchema = new mongoose.Schema({
    "username" : String,
    "notificacao": [notificationSchema],
    "pedido": [pedidoSchema]
})
```

Para cada utilizador iremos ter uma lista de notificações e pedidos.

Cada notificação tem uma descrição, a informação se esta foi lida ou não e uma hiperligação.

Para os pedidos, temos o tipo de pedido. Neste momento, temos 2 tipos:
- Entrar num Curso
- Criar um Curso

Depois, temos informação relativa a se este foi respondido e se foi aceite, por quem foi realizado, e qual o curso a que está associdado. 
Ainda contém uma info, com uma pequena descrição do pedido.


### Universidade

Para guardar informação relativamente às universidade e departamentos disponivéis, temos:
```js
const uniSchema = new mongoose.Schema({
    "nome": String,
    "departamentos": [String],
})
```
Que será o nome da universidade com uma lista de departamentos associada.


### **Interface**
Na interface foram definidas diversas páginas de modo a apresentar a informação ao utilizador de uma forma simples, intuitiva e detalhada.

Para ajudar o utilizador na navegação entre as diversas funcionalidades da plataforma, decidimos criar uma barra de navegação com uma hiperligação para as seguintes funcionalidades:
- Lista de Cursos em que o utilizador está inscrito (Página Inicial)
- Lista de todos os Cursos existentes (Pesquisar Cursos)
- Notificações e Pedidos
- Perfil do Utilizador
- Terminar Sessão

Para além da barra de navegação e das principais páginas já mencionadas, a plataforma apresenta mais algumas páginas relevantes tais como:
- Página de Curso, onde é apresentada a informação sobre o mesmo, os posts e os recursos associados ao mesmo
- Listagem de alunos de cada Curso
- Diversos FORM de edição e adição de informação (Criar Curso, Adicionar Post, Adicionar Recurso, Editar Perfil, etc...)

## 🧰 **Funcionalidades**

A Aplicação Web desenvolvida apresenta as seguintes funcionalidades:

- Cursos:
    - Adicionar (Professor)
    - Editar (Professor)
    - Remover alunos (Professor)
    - Info
    - Pedir acesso
    - Lista alunos
    - Lista do utilizador
    - Lista de todos 
    - Posts:
        - Adicionar 
        - Editar
        - Comentários:
            - Adicionar
            - Remover
            - Editar
    - Recursos:
        - Adicionar
        - Rating:
            - Adicionar
            - Editar
            - Remover
        - Download
        - Lista
        - Info
- Utilizador
    - Registo
    - Iniciar Sessão
    - Terminar Sessão
    - Pedidos
        - Lista
    - Notificações
        - Lista
        - Adicionar (Admin)
    - Perfil:
        - Editar

## 🏁 **Conclusões e Trabalho Futuro**

Concluindo, consideramos que os objetivos do projetos foram cumpridos. Todos os objetivos base e funcionalidades foram implementados/as na íntegra.

Como trabalho futuro pretendemos melhorar as intefaces desenvolvidas e adicionar algumas funcionalidades tais como sugerir ao administrador adicionar ao sistema a possibilidade de os professores fazerem upload de um novo tipo de ficheiro que ainda não é permitido.

Por fim, acreditamos que o desenvolvimento desta aplicação nos permitiu não só consolidar a matéria lecionada na unidade curricular mas também desenvolver imenso, as capacidades que tínhamos para desenvolvimento de aplicações Web.

---

### Autores

- [Diogo Vieira - PG50518](https://github.com/DiogoVieira63)
- [Eduardo Magalhães - PG50352](https://github.com/edumagalhaes10)

---

01 de julho de 2023
