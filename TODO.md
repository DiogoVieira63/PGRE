# users
## fields
- email (_id)
- username 
- name
- level
- active
- affiliation (optional)
- registerDate
- lastAccess 
- password
- notifications:
    - message
    - read (boolean)

## actions
- register ✅
- login ✅
- update ✅
- delete ✅

---
# meta
## fields
- type (livros, artigos, aplicações, trabalhos de alunos, monografias ,relatórios, relatório, tese, artigo, aplicação, slides,
teste/exame, problema resolvido)
- title
- subtitle
- description
- creationDate (optional)
- registationDate (entrada no sistema)
- visibility (who can see (alunos ou apenas professores|adminstradores))
- tags
- theme
- ratings 
- author
- uploadBy
- course
- mimetype
- size


## actions
- create ✅
- getOne ✅
- getByCourse ✅
- update✅
- remove ✅
- addRating ✅
- removeRating ✅
- editRating ✅
- suggestType (Professor) ✅
- approveType (Admin) ✅
- rejectType (Admin) ✅

--- 
# courses
## fields
- name
- description
- students
- professors
- posts: 
    - title
    - description
    - comments
    - publishBy 
    - _id do recurso (optional)
- type (Public | Private | Invite-only)
- regente( Permissão para remover alunos/professors )


## actions
- getAll(Public | Private) 
- create ✅
- remove ✅(+/-)
- addStudent ✅
- findByAluno ✅
- removeStudent ✅ acho eu 
- addProfessor ✅
- findByProfessor ✅
- removeProfessor ✅
- addPost ✅
- editPost ✅
- addCommentPost ✅
- editCommentPost ✅
- removeCommentPost ✅
- removePost 
- hasPermission (check if user has permission to access course) ✅ acho eu
- isProfessor ✅ 

--- 

# Interface

## Forms
- Login ✅
- Register ✅
- Edit Profile ✅
- Create Course ✅


## Navigation Bar
- Content:
    - Home
    - Search
- Notifications
- Options
    - Profile
    - Logout

## Initial Page

- My Courses ✅
- Posts (from courses) | titulo, descricao, publishedBy, data

## Search Page
- Search Bar
- Options
    - Sort
    - Filter
- Lista Cursos ✅

## Course Page

- Course Info
- Posts
- Resources

## Profile Page
- User Info ✅
- Edit Info ✅


## Pedidos


### Professor
- Acesso Curso (Aluno)

### Admin
- Adicionar Tipo
- Criar Curso
- Remover Curso

