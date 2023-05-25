# users
## fields
- username 
- name
- email
- level
- active (?)
- filiação (?) 
- registerDate
- lastAccess 
- password

## actions
- register 
- login
- changePassword
- changeUsername (?)

---
# meta
## fields
- type
- title
- subtitle
- creationDate
- registationDate (entrada no sistema)
- visibility (who can see (alunos apenas ou professores|adminstradores))

## actions
- create
- get
- update
- remove

--- 
# courses
## fields
- name
- description
- students
- professors
- posts
- type (Public | Private | Invite-only)

## actions
- getAll(Public | Private)
- create
- remove
- addStudent
- getByAluno
- removeStudent
- addProfessor
- getByProfessor
- removeProfessor

