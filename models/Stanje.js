import { stanjeType } from '../types';

class Stanje {
  getAll(obj, args, database) {
    return database.select().from('stanje').then(res => res);
  }

  getAllWhere(obj, args, database) {
    return database.select().from('stanje').where({ id: obj.stanje_id }).then(res => res[0]);
  }
}

export default new Stanje({ type: stanjeType });
