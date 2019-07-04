import { zahtjevPosudbeType } from '../types';
import humps from 'humps';

class ZahtjevPosudbe {
  getAll(obj, args, database) {
    console.log(args);
    return Object.entries(args).length === 0 ? database.select().from('zahtjev_posudbe').then(res => humps.camelizeKeys(res)) : database.select().from('zahtjev_posudbe').where({ stanje_id: args.stanjeId }).then(res => humps.camelizeKeys(res));
  }

  getAllWhere(obj, args, database) {
    return database.select().from('zahtjev_posudbe').where({ id: obj.zahtjev_posudbe_id }).then(res => humps.camelizeKeys(res[0]));
  }
}

export default new ZahtjevPosudbe({ type: zahtjevPosudbeType });
