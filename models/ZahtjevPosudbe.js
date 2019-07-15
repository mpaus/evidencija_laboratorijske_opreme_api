import { zahtjevPosudbeType } from '../types';
import humps from 'humps';

class ZahtjevPosudbe {
  getAll(obj, args, database) {
    return database.select().from('zahtjev_posudbe').then(res => humps.camelizeKeys(res));
  }

  getAllWhere(obj, args, database) {
    if(args.stanjeId){
      return database.select().from('zahtjev_posudbe').where({ stanje_id: args.stanjeId }).then(res => humps.camelizeKeys(res));
    } else if(args.korisnikId){
      return database.select().from('zahtjev_posudbe').where({ korisnik_id: args.korisnikId }).then(res => humps.camelizeKeys(res));
    } else if(args.odobritelj){
      return database.select().from('zahtjev_posudbe').where({ odobritelj: args.odobritelj }).then(res => humps.camelizeKeys(res));
    }
    return database.select().from('zahtjev_posudbe').where({ id: obj.zahtjev_posudbe_id }).then(res => humps.camelizeKeys(res[0]));
  }
}

export default new ZahtjevPosudbe({ type: zahtjevPosudbeType });
