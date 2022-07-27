import { Custodian } from './core/Custodian';
import { Signatory } from './core/Signatory';
import * as utils from './core/utils';
import { issueRandomVC } from './core/lib'

async function main() {
    if (!utils.debug) {
        console.warn("ATTENTION: debug mode is disabled, so console.log is not shown. Enable it in utils.ts.")
    }
    await issueRandomVC("LD_PROOF");
}

main()