import { Custodian } from './core/Custodian';
import { Signatory } from './core/Signatory';
import * as utils from './core/utils';
import { issueRandomVC } from './core/lib'

async function main() {
    let [cred, ] = await issueRandomVC("LD_PROOF");
    console.log(JSON.stringify(cred))
}

main()