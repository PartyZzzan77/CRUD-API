import request from 'supertest';
import { MESSAGES } from '../../constants/MESSAGES';
import { STATUS_CODE } from '../../constants/STATUS_CODE';
import { URL_CONSTANTS } from '../../constants/URL_CONSTANTS';
import { db } from '../../DB/DB';
import Router from '../../Router/Router';
import Server from '../../Server/Server';

describe('Server', () => {
    describe('Scenario #1', () => {
        const server = request(new Server(new Router(), db).testServer());
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
});
