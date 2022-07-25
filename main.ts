import { Custodian } from './core/Custodian';
import { Signatory } from './core/Signatory';
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
        let key = await Custodian.generateKey("RSA");
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
    let c = await Signatory.issueRandomVC("LD_PROOF");
    console.log(JSON.stringify(c));
    // await Custodian.deleteAllKeys();
    // let key = await Custodian.generateKey("RSA");
    // key = await Custodian.getKey(key.keyId.id);
    // let exported = await Custodian.exportKey(key, "JWK", true);
    // await Custodian.deleteKey(key.keyId.id);
    // let imported = await Custodian.importKey(exported);
    // Custodian.printKeys();
}

main()