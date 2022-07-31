import { TablesList } from "types";
import { writeFile, stat, mkdir } from 'node:fs/promises';

export default class jsonDB {
    private tables: TablesList[];
    private databasePath: string;

    constructor(databasePath: string) {
        this.createFolder(databasePath)
        this.databasePath = databasePath;
    }

    private async createFolder(path: string) {
        try {
            try {
                await stat(path)
                console.log('database connected with name: [ ' + path.split('/')[path.split('/').length - 1] + ' ]');
                console.log('database folder path: [ ' + this.databasePath + ' ]');
            } catch (error) {
                console.log(error.message);
                await mkdir(path);
                await writeFile(this.databasePath + '/key.json', JSON.stringify([]));
                console.log('Databse created on path: [' + path + ']');
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            this.tables = this.loadKeys();
        }
    }

    private freeKey() {
        /*
            This will free keys data from ram 
        */
        delete require.cache[require.resolve(this.databasePath + '/key.json')]
    }

    private loadKeys() {
        /*
            Loading list of table of that database from json file to ram
        */
        return require(this.databasePath + '/key.json') as TablesList[];
    }

    private async updateKeys(newData: TablesList[]) {
        await writeFile(this.databasePath + '/key.json', JSON.stringify(newData));
    }

    private async writeDcoument(options: TablesList) {
        try {
            await writeFile(this.databasePath + '/' + options.name + '.json', JSON.stringify('{}'));
            let keys: TablesList[] = this.loadKeys();
            options.filePath = this.databasePath + '/' + options.name + '.json';
            keys.push(options);
            this.tables = keys;
            await this.updateKeys(keys);
            this.freeKey();

            console.log('Document created with name: [' + options.name + ']');
        } catch (error) {
            throw new Error(error.message);
        }
    }


    public async createDocument(options: TablesList) {
        try {
            try {
                await stat(this.databasePath + '/' + options.name + '.json')
            } catch (error) {
                try {
                    await this.writeDcoument(options);
                } catch (error) {
                    throw new Error(error.message);
                }
            }
        } catch (error) {
            throw new Error(error.message);
        } finally {
            this.tables = this.loadKeys();
        }
    }

    public showDocuments() {
        return this.tables;
    }
}

