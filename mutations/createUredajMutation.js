import {
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
} from 'graphql';
import humps from 'humps';
import uredajType from '../types/uredajType';
import { storage } from '../google_cloud_storage/index';
import { GraphQLUpload } from 'graphql-upload'
import fs from 'fs';

const UredajInputType = new GraphQLInputObjectType({
    name: 'UredajInput',
    fields: {
        nazivUredaja: { type: GraphQLNonNull(GraphQLString) },
        serijskiBroj: { type: GraphQLNonNull(GraphQLString) },
        cijena: { type: GraphQLString },
        napomena: { type: GraphQLString },
        specifikacije: { type: GraphQLString },
        kategorijaId: { type: GraphQLNonNull(GraphQLID)}
    }
});

async function pipeToServer(filename, stream){
    return new Promise(resolve => {
        const writeStream = fs.createWriteStream(filename);

        stream.pipe(writeStream);

        writeStream.on('finish', (res) => resolve(res));
    })
}

const createUredajMutation = async ({ input: { nazivUredaja, serijskiBroj, cijena, napomena, specifikacije, kategorijaId }, file}, database) => {

    const existingUredaj = await database('uredaj')
        .select()
        .where( 'serijski_broj', '=', serijskiBroj )
        .then(res => res[0]);

    if(existingUredaj) throw new Error('Uređaj već postoji');

    if(file) {
        const slika = await file;

        const {filename, mimetype, encoding, createReadStream} = slika;

        const stream = createReadStream();

        const bucket = storage.bucket('evidencija-laboratorijske-opreme');

        await pipeToServer(filename, stream);

        const image = await bucket.upload(filename, {
            destination: filename,
            metadata: {
                contentType: mimetype,
                encoding
            }
        }).then(res => res[0]);

        await fs.unlinkSync(filename);

        const metadata = await image.getMetadata();

        return await database('uredaj').insert({
            naziv_uredaja: nazivUredaja,
            serijski_broj: serijskiBroj,
            cijena,
            napomena,
            specifikacije,
            kategorija_id: kategorijaId,
            slika_url: metadata[0].mediaLink,
            stanje_id: 1
        }).then(res => database.select().from('uredaj').where({ id: res[0] }).then(res => humps.camelizeKeys(res[0])));
    } else {
        return await database('uredaj').insert({
            naziv_uredaja: nazivUredaja,
            serijski_broj: serijskiBroj,
            cijena,
            napomena,
            specifikacije,
            kategorija_id: kategorijaId,
            slika_url: null,
            stanje_id: 1
        }).then(res => database.select().from('uredaj').where({ id: res[0] }).then(res => humps.camelizeKeys(res[0])));
    }

};

module.exports = {
    type: uredajType,
    args: {
        input: { type: GraphQLNonNull(UredajInputType)},
        file: { type: GraphQLUpload }
    },
    resolve(obj, args, { database }){
        return createUredajMutation(args, database);
    }
};