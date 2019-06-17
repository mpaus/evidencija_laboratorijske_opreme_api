import { korisnikType } from '../types';
import humps from 'humps';

class Korisnik {
    getAll(obj, args, database) {
        return database.select().from('korisnik').then(res => humps.camelizeKeys(res));
    }
}

export default new Korisnik({ type: korisnikType });
