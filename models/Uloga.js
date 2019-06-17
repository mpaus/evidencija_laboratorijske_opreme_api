import { ulogaType } from '../types';
import humps from 'humps';

class Uloga {
    getAll(obj, args, database) {
        return database.select().from('uloga').then(res => humps.camelizeKeys(res));
    }

    getAllWhere(obj, args, database) {
        console.log(obj);
        return database.select().from('uloga').where({ id: obj.ulogaId }).then(res => humps.camelizeKeys(res[0])).catch(err => console.log(err));
    }
}

export default new Uloga({ type: ulogaType });
