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
    let [cred, ] = await Signatory.issueRandomVC("LD_PROOF");
    console.log(1)
    console.log(cred)
    await Custodian.storeCredential("MIA", cred);
    let stored = await Custodian.getCredential("MIA");
    console.log(2)
    console.log(stored)
    await Custodian.deleteCredential("MIA");
    console.log(3)
    await Custodian.getCredential("MIA");
}

main()