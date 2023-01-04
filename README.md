# [CRUD-API](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md)

simple CRUD API using in-memory database underneath.

## To start up, do the following

```text
git clone git@github.com:PartyZzzan77/CRUD-API.git
cd CRUD-API
git checkout dev
npm i
npm run start:prod
```

## You can use, for example, Postman to test request must contain the following structure

```json
{
    "username": "Amigo",
    "age": "24",
    "hobbies": ["running", "diving"]
}
```

## In Postman, select the GET method and specify the following address

```text
http://localhost:4000/api/users
```

## API

```text
GET http://localhost:4000/api/users

POST http://localhost:4000/api/users

PUT http://localhost:4000/api/users

DELETE http://localhost:4000/api/users
```

body

```json
{
    "username": "Amigo",
    "age": "24",
    "hobbies": ["running", "diving"]
}
```

An example of POST method response

```json
{
    "id": "8eaecde6-9f2a-4f84-b81c-756462dbd0c6"
    "username": "Amigo",
    "age": "24",
    "hobbies": ["running", "diving"],
}
```

GET api/users/${userId}

GET method response example in Postman

api/users/8eaecde6-9f2a-4f84-b81c-756462dbd0c6

PUT api/users/{userId}

PUT method response example in Postman

api/users/8eaecde6-9f2a-4f84-b81c-756462dbd0c6
body

```json
{
    "username": "Amigo1",
    "age": "42",
    "hobbies": ["running", "diving"]
}
```

An example of POST method response

```json
{
    "username": "Amigo1",
    "age": "42",
    "hobbies": ["running", "diving"],
    "id": "8eaecde6-9f2a-4f84-b81c-756462dbd0c6"
}
```

DELETE api/users/{userId}

api/users/8eaecde6-9f2a-4f84-b81c-756462dbd0c6
