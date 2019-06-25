import { stanjeType } from '../types';
import humps from "humps";

class Stanje {
  getAll(obj, args, database) {
    return database.select().from('stanje').then(res => res);
  }

  getAllWhere(obj, args, database) {
    return database.select().from('stanje').where({ id: obj.stanjeId }).then(res => humps.camelizeKeys(res[0])).catch(err => console.log(err));
  }
}

export default new Stanje({ type: stanjeType });
