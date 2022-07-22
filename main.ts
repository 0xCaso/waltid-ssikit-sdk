import { Custodian } from './core/Custodian';
import { KeyAlgorithm, KeyFormat } from './core/utils';

async function custodianKeys() {
    console.log(`    
    /*//////////////////////////////////////////////////////////////
                             KEY MANAGEMENT
    //////////////////////////////////////////////////////////////*/
    `)
    await Custodian.deleteAllKeys();
    console.log("Creating 5 keys...\n");
    let keys: Array<any> = [];
    for (let i = 0; i < 5; i++) {
        let key = await Custodian.generateKey(KeyAlgorithm.RSA);
        keys.push(key);
    }
    await Custodian.printKeys();
    console.log("Deleting first 2 keys...\n");
    await Custodian.deleteKey(keys[0].keyId.id);
    await Custodian.deleteKey(keys[1].keyId.id);
    await Custodian.printKeys();
}

async function main() {
    // await custodianKeys();

    await Custodian.deleteAllKeys();
    let key = await Custodian.generateKey(KeyAlgorithm.RSA);
    key = await Custodian.getKey(key.keyId.id);
    let exported = await Custodian.exportKey(key, KeyFormat.JWK, true);
    await Custodian.deleteKey(key.keyId.id);
    let imported = await Custodian.importKey(exported);
    Custodian.printKeys();
}

main()