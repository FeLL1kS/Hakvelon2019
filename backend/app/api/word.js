const {
    ValidationError,
    AccessError
} = require('../class/Error');
const Word = require('../models/Word');

module.exports = {
    async lookup({
        word
    }) {
        return Word.lookup(word);
    }
};