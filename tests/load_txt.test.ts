import {mat} from '../mat/Mat'
import {join} from 'path';
describe('Testing load_text function', () => {

    test('Test that file is read', () => {
        let data: string[][] = mat.load_txt(join(__dirname, '../examples/data/breast-cancer.csv'));
        expect(Array.isArray(data));
    });
})