import {
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
    GraphQLInt
} from 'graphql';
import humps from 'humps';
import bcrypt from 'bcryptjs';
import toArray from 'stream-to-array';
import ulogaType from '../types/ulogaType';
import { storage } from '../google_cloud_storage/index';
import { GraphQLUpload } from 'graphql-upload'
import fs from 'fs';

import { korisnikType } from '../types';

const deleteUserMutation = async ({ input }, database) => {

        console.log(input, 'DELETE');

        return await database('korisnik')
            .where('id', input)
            .del()
            .then( () => ( { id: input }));
};

module.exports = {
    type: korisnikType,
    args: {
        input: { type: GraphQLNonNull(GraphQLID)},
    },
    resolve(obj, args, { database }){
        return deleteUserMutation(args, database);
    }
};