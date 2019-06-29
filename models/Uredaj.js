import { uredajType } from '../types';
import humps from 'humps';

class Uredaj {
  getAll(obj, args, database) {
    console.log(args);
    return Object.entries(args).length === 0 ? database.select().from('uredaj').then(res => humps.camelizeKeys(res)) : database.select().from('uredaj').where({ stanje_id: args.stanjeId }).then(res => humps.camelizeKeys(res));
  }

  getAllWhere(obj, args, database) {
    return database.select().from('uredaj').where({ id: obj.uredajId }).then(res => humps.camelizeKeys(res[0]));
  }
}

export default new Uredaj({ type: uredajType });
