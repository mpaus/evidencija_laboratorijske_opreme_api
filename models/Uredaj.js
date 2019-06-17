import { uredajType } from '../types';
import humps from 'humps';

class Uredaj {
  getAll(obj, args, database) {
    return database.select().from('uredaj').then(res => humps.camelizeKeys(res));
  }

  getAllWhere(obj, args, database) {
    return database.select().from('uredaj').where({ id: obj.uredaj_id }).then(res => humps.camelizeKeys(res[0]));
  }
}

export default new Uredaj({ type: uredajType });
