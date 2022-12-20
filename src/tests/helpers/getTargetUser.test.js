import { getTargetUser } from '../../helpers/getTargetUser';

describe('getTargetUser', () => {
    const reqGood = { url: '/api/users/8bf0dee1-3243-49e5-9553-35c45edf8asc6dab' };
    const reqBad = { url: 'api/users/8bf0dee1-3243-49e5-9553-35c45edf8asc6dab=4f5h78-s2' };
    const dataGood = [
        {
            id: '8bf0dee1-3243-49e5-9553-35c45edf8asc6dab',
            username: 'John',
            age: 42,
            hobbies: ['cinema', 'run ', 'programming'],
        },
        {
            id: '8bf0dee1-3243-49e5-9553-35c45edf8asc6dab-a2s22as2as',
            username: 'Neo',
            age: 24,
            hobbies: ['jiu-jitsu ', 'jump ', 'programming'],
        },
    ];
    const dataBad = [
        {
            id: '8bf0dee1-3243-49e5-9553-35c45edf8asc6dab-35c45edf',
            username: 'John',
            age: 42,
            hobbies: ['cinema', 'run ', 'programming'],
        },
        {
            id: '8bf0dee1-3243-49e5-9553-35c45edf8asc6dab-a2s22as2as',
            username: 'Neo',
            age: 24,
            hobbies: ['jiu-jitsu ', 'jump ', 'programming'],
        },
    ];

    it('Should return user', () => {
        expect(getTargetUser(dataGood, reqGood)).toHaveProperty('id');
    });
    
    it('Should be undefined', () => {
        expect(getTargetUser(dataBad, reqBad)).toBeUndefined();
    });
});
