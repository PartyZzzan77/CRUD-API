import { checkId } from '../../helpers/checkId';

describe('checkId', () => {
    const reqGood = { url: '/api/users/8bf0dee1-3243-49e5-9553-35cedf8c6dab' };
    const reqBad = { url: '/api/users/8bf0dee1-3243-49e5-9553-35c45edf8asc6dab' };

    it('Should be true', () => {
        expect(checkId(reqGood)).toBeTruthy();
    });

    it('Should be false', () => {
        expect(checkId(reqBad)).toBeFalsy();
    });
});
