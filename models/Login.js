import { loginType } from '../types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import humps from 'humps';

class Login {
    async getWhere(obj, args, database) {

        if(args.email && args.lozinka) {

            const korisnik = await database.select().from('korisnik').where({email: args.email}).then(res => humps.camelizeKeys(res[0]));

            if (!korisnik) {
                throw new Error('Korisnik ne postoji!');
            }
            const isEqual = await bcrypt.compare(args.lozinka, korisnik.lozinka);

            if (!isEqual) {
                throw new Error('Lozinka je netočna!');
            }
            const token = jwt.sign(
                {userId: korisnik.id, email: korisnik.email},
                'somesupersecretkey',
                {
                    expiresIn: '1h'
                }
            );

            return [{korisnik: korisnik, token: token, tokenExpiration: 1}];
        } else {
            return null;
        }
    }
}

export default new Login({ type: loginType });