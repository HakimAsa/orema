const { CONS } = require('../../../constants/constants');

describe('CONSTANTS Object', () => {
    it('should have blog property', () => {
        expect(CONS.BLOG).toBe('blog');
    });

    it('should have category property', () => {
        expect(CONS.CATEGORY).toBe('category');
    });

    it('should have contact property', () => {
        expect(CONS.CONTACT).toBe('contact');
    });

    it('should have product property', () => {
        expect(CONS.PRODUCT).toBe('product');
    });
})