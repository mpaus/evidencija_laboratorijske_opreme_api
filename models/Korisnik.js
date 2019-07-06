import { korisnikType } from '../types';
import humps from 'humps';

class Korisnik {
    getAll(obj, args, database) {
        return Object.entries(args).length === 0 ? database.select().from('korisnik').then(res => humps.camelizeKeys(res)) : database.select().from('korisnik').where({ uloga_id: args.ulogaId }).then(res => humps.camelizeKeys(res));
    }
    getAllWhere(obj, args, database) {
        return database.select().from('korisnik').where({ id: obj.korisnikId }).then(res => humps.camelizeKeys(res[0])).catch(err => console.log(err));
    }
    getOdobritelj(obj, args, database) {
        console.log(obj, '1');
        return database.select().from('korisnik').where({ id: obj.odobritelj }).then(res => humps.camelizeKeys(res[0])).catch(err => console.log(err));
    }
}

export default new Korisnik({ type: korisnikType });
