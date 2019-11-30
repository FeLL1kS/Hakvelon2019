const WordNet = require('node-wordnet');
const wordnet = new WordNet();

module.exports = {
    lookup: async (word) => {
        return wordnet.lookupAsync(word);
    }
};