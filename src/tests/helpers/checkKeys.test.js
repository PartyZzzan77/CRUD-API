import { checkKeys } from '../../helpers/checkKeys';

describe('checkKeys:', () => {
    it('Should be true', () => {
        const keys = ['id', 'username', 'age', 'hobbies'];
        const target = {
            id: 'test',
            username: 'Amigo',
            age: 24,
            hobbies: ['hob1', 'hob2'],
        };

        expect(checkKeys(target, keys)).toBeTruthy();
    });

    it('Should be false', () => {
        const keys = ['id', 'userName', 'age', 'hobbies'];
        const target = { id: 'test', username: 'a', age: 24, hobbies: ['1', '2'] };

        expect(checkKeys(target, keys)).toBeFalsy();
    });
});
