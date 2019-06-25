import { kategorijaType } from '../types';
import humps from 'humps';

class Kategorija {
  getAll(obj, args, database) {
    return database.select().from('kategorija').then(res => humps.camelizeKeys(res));
  }

  getAllWhere(obj, args, database) {
    return database.select().from('kategorija').where({ id: obj.kategorijaId }).then(res => humps.camelizeKeys(res[0])).catch(err => console.log(err));
  }
}

export default new Kategorija({ type: kategorijaType });
