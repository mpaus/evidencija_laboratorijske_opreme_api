import { stanjeType } from '../types';
import humps from "humps";

class Stanje {
  getAll(obj, args, database) {
    console.log(args);
    return Object.entries(args).length === 0 ? database.select().from('stanje').then(res => humps.camelizeKeys(res)) : database.select().from('stanje').where({ id: args.id }).then(res => humps.camelizeKeys(res));
  }

  getAllWhere(obj, args, database) {
    return database.select().from('stanje').where({ id: obj.stanjeId }).then(res => humps.camelizeKeys(res[0])).catch(err => console.log(err));
  }
}

export default new Stanje({ type: stanjeType });
