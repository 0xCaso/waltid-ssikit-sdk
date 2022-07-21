import { Custodian } from './core/Custodian';
import { Key } from './core/utils';

async function custodianKeys() {
    console.log(`    
    /*//////////////////////////////////////////////////////////////
                             KEY MANAGEMENT
    //////////////////////////////////////////////////////////////*/
    `)
    await Custodian.deleteAllKeys();
    console.log("|| Creating 5 keys...");
    let keys: Array<Key> = [];
    for (let i = 0; i < 5; i++) {
        let key = await Custodian.generateKey();
        keys.push(key);
    }
    await Custodian.printKeys();
    console.log("|| Deleting first 2 keys...");
    await Custodian.deleteKey(keys[0]);
    await Custodian.deleteKey(keys[1]);
    await Custodian.printKeys();
}

async function main() {
    await custodianKeys();
}

main()