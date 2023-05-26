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
- changePassword
- changeUsername
- changeName
- changeAffiliation
- deleteAccount

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

## actions
- getAll(Public | Private) 
- create ✅
- remove
- addStudent ✅
- findByAluno ✅
- removeStudent
- addProfessor ✅
- findByProfessor ✅
- removeProfessor
- addPost
- editPost
- addCommentPost
- editCommentPost
- removeCommentPost
- removePost
- hasPermission (check if user has permission to access course)
- isProfessor 
- isAdmin 

--- 

# Interface

## Navigation Bar
- Content:
    - Home
    - Search
- Notifications
- Options
    - Profile
    - Logout

## Initial Page

- My Courses
- Posts (from courses)

## Search Page
- Search Bar
- Options
    - Sort
    - Filter
- Lista Cursos

## Course Page

- Course Info
- Posts
- Resources

## Profile Page
- User Info
- Edit Info
