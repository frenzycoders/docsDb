import jsonDB from './jsonDb';
import { join } from 'node:path';

let path = join(__dirname + '/db');

let jsonDb = new jsonDB(path);

(async () => {
    await jsonDb.createDocument({ name: 'user' });
    await jsonDb.createDocument({ name: 'machines' });
    // console.log(jsonDb.showDocuments())
})()