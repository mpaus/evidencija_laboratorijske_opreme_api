import {
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLString
} from 'graphql';
import humps from 'humps';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { korisnikType } from '../types';

const loginInputType = new GraphQLInputObjectType({
    name: 'LoginInput',
    fields: {
        email: { type: GraphQLNonNull(GraphQLString) },
        lozinka: { type: GraphQLNonNull(GraphQLString) },
    }
});

const loginMutation = async ({ input: { email, lozinka }}, database) => {
    const user = await database.select().from('korisnik').where({ email }).then(res => humps.camelizeKeys(res[0]));

    console.log(user);

    if (!user) {
        throw new Error('User does not exist!');
    }

    const isEqual = await bcrypt.compare(lozinka, user.lozinka);

    if (!isEqual) {
        throw new Error('Password is incorrect!');
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email },
        'somesupersecretkey',
        {
            expiresIn: '1h'
        }
    );
    return { userId: user.id, token: token, tokenExpiration: 1 };
};

module.exports = {
    args: {
        input: { type: GraphQLNonNull(loginInputType)}
    },
    resolve(obj, args, { database }){
        return loginMutation(args, database);
    }
};