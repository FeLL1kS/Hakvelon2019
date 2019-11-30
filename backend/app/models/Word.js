const db = require('thesaurus-com');

module.exports = {
    lookup: async (word) => {
        return db.search(word);
    }
};