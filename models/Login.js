import { loginType } from '../types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import humps from 'humps';

class Login {
    async getWhere(obj, args, database) {

        console.log('tu san');

        if(args.email && args.lozinka) {
            console.log(obj, 'OBJ');
            console.log(args, 'ARGS');
            console.log(database, 'DATABASE');

            const user = await database.select().from('korisnik').where({email: args.email}).then(res => humps.camelizeKeys(res[0]));

            if (!user) {
                throw new Error('User does not exist!');
            }
            const isEqual = await bcrypt.compare(args.lozinka, user.lozinka);

            console.log(2);

            if (!isEqual) {
                throw new Error('Password is incorrect!');
            }
            const token = jwt.sign(
                {userId: user.id, email: user.email},
                'somesupersecretkey',
                {
                    expiresIn: '1h'
                }
            );

            console.log(user, token);

            return [{user: user, token: token, tokenExpiration: 1}];
        } else {
            return null;
        }
    }
}

export default new Login({ type: loginType });