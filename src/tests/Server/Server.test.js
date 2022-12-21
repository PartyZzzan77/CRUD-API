import request from 'supertest';
import { MESSAGES } from '../../constants/MESSAGES';
import { STATUS_CODE } from '../../constants/STATUS_CODE';
import { URL_CONSTANTS } from '../../constants/URL_CONSTANTS';
import { db } from '../../DB/DB';
import Router from '../../Router/Router';
import Server from '../../Server/Server';

describe('Server', () => {
    const server = request(new Server(new Router(), db).testServer());

    describe('Scenario #1 Description in the technical specification', () => {
        let testId = '';

        it('Get all records with a GET api/response request (an empty array is expected)', async () => {
            const response = await server.get(URL_CONSTANTS.BASE);

            expect(response.statusCode).toBe(STATUS_CODE.OK);
            expect(response.body).toEqual([]);
        });

        it('A new object is created by POST api/response (a response containing the newly created record is expected)', async () => {
            const newUser = {
                username: 'John',
                age: 24,
                hobbies: ['skiing', 'diving ', 'programming'],
            };

            const response = await server.post(URL_CONSTANTS.BASE).send(newUser);
            testId = response.body.id;
            newUser.id = testId;

            expect(response.statusCode).toBe(STATUS_CODE.CREATED);
            expect(response.body).toEqual(newUser);
        });

        it('By requesting GET api/user/{userId} we try to get the created record by its id(expected created record)', async () => {
            const testUser = {
                username: 'John',
                age: 24,
                hobbies: ['skiing', 'diving ', 'programming'],
            };

            testUser.id = testId;

            const response = await server.get(URL_CONSTANTS.BASE_ID + testId);

            expect(response.statusCode).toBe(STATUS_CODE.OK);
            expect(response.body).toEqual(testUser);
        });

        it('Try to update the created record with the PUT api/users/{userId} query (expect a response containing the updated object with the same id)', async () => {
            const testUser = {
                username: 'Bob',
                age: 42,
                hobbies: ['skiing', 'diving ', 'programming'],
            };

            const response = await server.put(URL_CONSTANTS.BASE_ID + testId).send(testUser);
            testUser.id = response.body.id;

            expect(response.statusCode).toBe(STATUS_CODE.OK);
            expect(response.body).toEqual(testUser);
        });

        it('Use the DELETE api/users/{userId} query to delete the created object by id (confirmation of successful deletion expected)', async () => {
            const response = await server.delete(URL_CONSTANTS.BASE_ID + testId);

            expect(response.statusCode).toBe(STATUS_CODE.DELETED);
        });

        it('By requesting GET api/users/{userId} we try to get a remote object by its id (the expected answer is no such object)', async () => {
            const response = await server.get(URL_CONSTANTS.BASE_ID + testId);

            expect(response.statusCode).toBe(STATUS_CODE.NOT_FOUND);
            expect(response.text).toBe(MESSAGES.NOT_FOUND);
        });
    });

    describe('Scenario 2 errors in queries', () => {
        const invalidID = '8bf0dee1-3243-49e5-9553-35c45edf8asc6dab';
        const validID = '8bf0dee1-3243-49e5-9553-35cedf8c6dab';
        const invalidUser = { name: 'Elusive Joe' };

        it('When trying to make a GET request to an invalid URL it should be Not Found', async () => {
            const response = await server.get(`${URL_CONSTANTS.BASE}s`);

            expect(response.statusCode).toBe(STATUS_CODE.NOT_FOUND);
        });

        it('When trying to find a user with an invalid ID there should be a BAD REQUEST', async () => {
            const response = await server.get(URL_CONSTANTS.BASE_ID + invalidID);

            expect(response.statusCode).toBe(STATUS_CODE.BAD_REQUEST);
        });

        it('The server should respond with a 404 status code and an appropriate message if the record with id === userId does not exist', async () => {
            const response = await server.get(URL_CONSTANTS.BASE_ID + validID);

            expect(response.statusCode).toBe(STATUS_CODE.NOT_FOUND);
        });

        it('Server should answer with status code 400 and corresponding message if request body does not contain required fields', async () => {
            const response = await server.post(URL_CONSTANTS.BASE).send(invalidUser);

            expect(response.statusCode).toBe(STATUS_CODE.BAD_REQUEST);
        });

        it('PUT api/users/{userId} Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)', async () => {
            const response = await server.put(URL_CONSTANTS.BASE_ID + invalidID);

            expect(response.statusCode).toBe(STATUS_CODE.BAD_REQUEST);
        });

        it('PUT api/users/{userId} Server should answer with status code 404 and corresponding message if record with id === userId ', async () => {
            const response = await server.put(URL_CONSTANTS.BASE_ID + validID);

            expect(response.statusCode).toBe(STATUS_CODE.NOT_FOUND);
        });

        it('DELETE api/users/{userId} Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)', async () => {
            const response = await server.delete(URL_CONSTANTS.BASE_ID + invalidID);

            expect(response.statusCode).toBe(STATUS_CODE.BAD_REQUEST);
        });

        it('DELETE api/users/{userId}  Server should answer with status code 404 and corresponding message if record with id === userId ', async () => {
            const response = await server.delete(URL_CONSTANTS.BASE_ID + validID);

            expect(response.statusCode).toBe(STATUS_CODE.NOT_FOUND);
        });
    });
});
