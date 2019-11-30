const words = ["bubble","maid","rose","steel","boundary","pizzas","bucket","pollution","wash","river","sort","liquid","cakes","morning","back","purpose","coil","women","competition","children","bikes","muscle","start","ticket","market","coat","shoe","design","thumb","nation","man","kittens","lock","office","store","control","mist","smile","riddle","porter","team","join","stretch","sound","bomb","plant","cattle","connection","shop","hate","thought","bottle","foot","mom","eye","egg","view","juice","underwear","pigs","driving","representative","existence","zipper","bead","growth","grape","error","war","snail","friction","sleet","record","plane","trick","branch","wax","reward","snow","substance","scale","air","bridge","drain","system","trees","cave","spade","top","verse","knife","room","coast","rabbit","value","quicksand","loss","tray","uncle","discussion","place","chalk","angle","show","pear","finger","worm","pump","receipt","hands","passenger","drink","square","fang","work","airplane","turkey","grandfather","chess","attraction","detail","account","spoon","rest","home","silver","robin","rub","things","instrument","basin","celery","birthday","glove","tent","blood","ink","suggestion","horn","play","giraffe","tail","cats","laugh","rat","minister","eggs","cover","curve","zebra","authority","order","rhythm","quince","produce","milk","nut","company","seashore","appliance","eggnog","surprise","bee","mark","side","plantation","effect","yarn","relation","laborer","popcorn","waste","shape","doctor","cub","marble","jellyfish","governor","time","crack","walk","yoke","lamp","coal","fold","bone","pan","frogs","route","neck","sack","clover","stem","wheel","animal","sleep","quiver","lake","stomach","sun"];
const names = ((_) => {
    let a = {
        f: [],
        s: []
    };
    _.forEach(e => {
        s = e.split(' ');
        a.f.push(s[0]);
        a.s.push(s[1]);
    });
    return a;
})(["Terina Wheeless", "Dominque Matamoros", "Avery Farney", "Ignacia Hames", "Luisa Goggin", "Maisha Yonts", "Tasha Wolfgram", "Senaida Eisenberg", "Billi Merino", "Sharie Mehring", "Doria Buschman", "Neal Cathey", "Krysta Cargle", "Virgil Hatten", "Nelia Colquitt", "Elinor Dansby", "Ernestina Silver", "Jaimee Lyvers", "Norris Towler", "Golda Overturf", "Mario Ulrey", "Raquel Rocco", "Paulita Gathings", "Burt Chavarria", "Caron Bradway", "Ka Gotto", "Denae Prigge", "Belkis Presley", "Laronda Maclennan", "Julius Drapeau", "Irving Howie", "Caroyln Pinheiro", "Alethea Asmussen", "Imelda Benny", "Shameka Soderstrom", "Danyelle Scroggs", "Melaine Cespedes", "Dorene Lanphere", "Rona Hui", "Madeline Harten", "Charissa Stanford", "Latonia Fling", "Mercy Klaus", "Phyliss Renfrew", "Cara Northington", "Edythe Redding", "Elizebeth Hornstein", "Hui Litke", "Cristin Marietta", "Jestine Landeros"]);

const minWords = 6;
const maxWords = 20;

const users = 10;


const User = require('../backend/app/models/User');
const db = require('../backend/app/components/db');

const rint = (min, max) => Math.round(Math.random() * (max - min) + min);
const login = (name) => name.toLowerCase().replace(' ', '');


(async () => {
    for (let i = 0; i < users; i++) {
        const user = {};
        user.name = names.f.splice(rint(0, names.f.length), 1) + ' ' + names.s.splice(rint(0, names.s.length), 1);
        user.login = login(user.name) + rint(1, 200);
        user.password = user.login;
        user.role = 1;
        user.interests = words.sort(() => Math.random() - 0.5).slice(0, rint(minWords, maxWords)).join(',');

        console.log(await User.create(...Object.values(user)));
    }

    db.end();
})();