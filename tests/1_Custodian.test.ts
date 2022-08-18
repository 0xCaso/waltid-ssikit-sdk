import { Custodian } from '../core/Custodian';
import { issueRandomVC } from '../core/lib'
import * as utils from '../core/utils';

describe('Custodian Class', () => {

    /*//////////////////////////////////////////////////////////////
                             KEY MANAGEMENT
    //////////////////////////////////////////////////////////////*/

    describe('Key Management', () => {

        beforeEach(async () => {
            await Custodian.deleteAllKeys();
        })
        
        describe('generateKey', () => {
            it('should generate a key', async () => {
                let key: utils.Key = await Custodian.generateKey("RSA");
                expect(key).toBeInstanceOf(Object);
                let keyId = utils.getId(key, "key");
                expect(keyId).not.toBe("");
            })
        })
        describe('getKeys', () => {
            it('should return an array of keys', async () => {
                await Custodian.deleteAllKeys();
                for (let i = 0; i < 5; i++) {
                    await Custodian.generateKey("RSA");
                }
                let keys: utils.Key[] = await Custodian.getKeys();
                let keyId = utils.getId(keys[0], "key");
                expect(keys).toBeInstanceOf(Array);
                expect(keys.length).toBe(5);
                expect(keyId).not.toBe("");
            });
        }),
        describe('getKey', () => {
            it('should return a key', async () => {
                let key: utils.Key = await Custodian.generateKey("RSA");
                let keyId = utils.getId(key, "key");
                key = await Custodian.getKey(keyId);
                let retrievedKeyId = utils.getId(key, "key");
                expect(key).toBeInstanceOf(Object);
                expect(retrievedKeyId).not.toBe("");
            });
            it('should throw an error if the key does not exist', async () => {
                try {
                    await Custodian.getKey('BUEAGAIME=JEIG(HAP');
                } catch (error) {
                    expect(error).toBeInstanceOf(Error);
                }
            })
        }),
        describe('deleteKey', () => {
            it('should delete a key', async () => {
                let key: utils.Key = await Custodian.generateKey("RSA");
                await Custodian.deleteKey(key);
                let keys: utils.Key[] = await Custodian.getKeys();
                expect(keys.length).toBe(0);
            }),
            it('should throw an error if the key does not exist', async () => {
                try {
                    await Custodian.deleteKey('123');
                } catch (error) {
                    expect(error).toBeInstanceOf(Error);
                }
            })
        }),
        describe('exportKey', () => {
            it('should export a key', async () => {
                let key: utils.Key = await Custodian.generateKey("RSA");
                let exported = await Custodian.exportKey(key, "JWK", true);
                expect(exported).toBeInstanceOf(Object);
                expect(typeof exported.kid).toBe('string');
            }),
            it('should throw an error if the key does not exist', async () => {
                try {
                    await Custodian.exportKey('123', "JWK", true);
                } catch (error) {
                    expect(error).toBeInstanceOf(Error);
                }
            })
        }),
        describe('importKey', () => {
            it('should import a key', async () => {
                let key: utils.Key = await Custodian.generateKey("RSA");
                let exported = await Custodian.exportKey(key, "JWK", true);
                await Custodian.deleteKey(key);
                let imported = await Custodian.importKey(exported);
                expect(typeof imported).toBe('string');
            }),
            it('should throw an error if the parameter is badly formatted', async () => {
                try {
                    await Custodian.importKey({});
                } catch (error) {
                    expect(error).toBeInstanceOf(Error);
                }
            })
            it('should throw an error if the key already exists', async () => {
                let key: utils.Key = await Custodian.generateKey("RSA");
                let exported = await Custodian.exportKey(key, "JWK", true);
                try {
                    await Custodian.importKey(exported);
                } catch (error) {
                    expect(error).toBeInstanceOf(Error);
                }
            })
        })

    })

    /*//////////////////////////////////////////////////////////////
                             DID MANAGEMENT
    //////////////////////////////////////////////////////////////*/

    describe('DID Management', () => {

        beforeEach(async () => {
            await Custodian.deleteAllDIDs();
        })

        describe('getDIDs', () => {
            it('should return an array of DIDs', async () => {
                let key: utils.Key = await Custodian.generateKey("EdDSA_Ed25519");
                await Custodian.createDID("key", key);
                let dids = await Custodian.getDIDs();
                expect(dids).toBeInstanceOf(Array);
                expect(typeof dids[0]).toBe('string')
            })
        })
        describe('getDID', () => {
            it('should return a DID', async () => {
                let key: utils.Key = await Custodian.generateKey("EdDSA_Ed25519");
                await Custodian.createDID("key", key);
                let dids = await Custodian.getDIDs();
                let did = await Custodian.getDID(dids[0]);
                expect(did).toBeInstanceOf(Object);
                expect(did.id).toBe(dids[0]);
                expect(did["@context"]).toBeInstanceOf(Object);
            }),
            it('should throw an error if the DID does not exist', async () => {
                try {
                    await Custodian.getDID('did:monokee:123456789');
                } catch (error) {
                    expect(error).toBeInstanceOf(Error);
                }
            })
        })
        describe('createDID', () => {
            it('should create a DID', async () => {
                let key: utils.Key = await Custodian.generateKey("EdDSA_Ed25519");
                let did = await Custodian.createDID("key", key);
                expect(typeof did).toBe('string');
                let didParts = did.split(':');
                expect(didParts[0]).toBe("did");
                expect(didParts[1]).toBe("key");
            }),
            it('should throw an error if the DID already exists', async () => {
                try {
                    let key: utils.Key = await Custodian.generateKey("EdDSA_Ed25519");
                    await Custodian.createDID("key", key);
                    await Custodian.createDID("key", key);
                } catch (error) {
                    expect(error).toBeInstanceOf(Error);
                }
            })
        })
        describe('deleteDID', () => {
            it('should delete a DID', async () => {
                let key: utils.Key = await Custodian.generateKey("EdDSA_Ed25519");
                let did = await Custodian.createDID("key", key);
                await Custodian.deleteDID(did);
                let dids = await Custodian.getDIDs();
                expect(dids.length).toBe(0);
            }),
            it('should throw an error if the DID does not exist', async () => {
                try {
                    await Custodian.deleteDID('did:monokee:123456789');
                } catch (error) {
                    expect(error).toBeInstanceOf(Error);
                }
            })
        })
        describe('resolveDID', () => {
            it('should resolve a DID', async () => {
                let key: utils.Key = await Custodian.generateKey("EdDSA_Ed25519");
                let did = await Custodian.createDID("key", key);
                let resolved = await Custodian.resolveDID(did);
                expect(resolved).toBeInstanceOf(Object);
                expect(resolved.id).toBe(did);
                expect(resolved["@context"]).toBeInstanceOf(Object);
            }),
            it('should throw an error if the DID does not exist', async () => {
                try {
                    await Custodian.resolveDID('did:monokee:123456789');
                } catch (error) {
                    expect(error).toBeInstanceOf(Error);
                }
            })
        })
        describe('importDID', () => {
            it('should import a DID', async () => {
                let key: utils.Key = await Custodian.generateKey("EdDSA_Ed25519");
                let did = await Custodian.createDID("key", key);
                await Custodian.importDID(did);
            }),
            it('should throw an error if the DID already exists', async () => {
                let key: utils.Key = await Custodian.generateKey("EdDSA_Ed25519");
                let did = await Custodian.createDID("key", key);
                try {
                    await Custodian.importDID(did);
                } catch (error) {
                    expect(error).toBeInstanceOf(Error);
                }
            })
            it('should throw an error if the DID doesn\'t exist', async () => {
                try {
                    await Custodian.importDID("did:monokee:123456789");
                } catch (error) {
                    expect(error).toBeInstanceOf(Error);
                }
            })
        })

    })

    /*//////////////////////////////////////////////////////////////
                         CREDENTIALS MANAGEMENT
    //////////////////////////////////////////////////////////////*/

    describe('Credentials Management', () => {

        describe('getCredentials', () => {
            it('should return an array of credentials', async () => {
                let credentials = await Custodian.getCredentials();
                expect(credentials).toBeInstanceOf(Array);
            })
        }),
        describe('storeCredential - getCredential - deleteCredential', () => {
            it('should store a credential, and delete it', async () => {
                let subjectKey = await Custodian.generateKey("EdDSA_Ed25519");
                let subjectDID = await Custodian.createDID("key", subjectKey);
                let lastPart = subjectDID.split(':').pop();
                let [credential,] = await issueRandomVC("LD_PROOF", subjectDID);
                let listBefore = await Custodian.getCredentials();
                let alias = `Test${lastPart}`;
                await Custodian.storeCredential(alias, credential);
                let listAfter = await Custodian.getCredentials();
                expect(listAfter.length - listBefore.length).toBe(1);
                let added = listAfter[listAfter.length -1];
                expect(added).toBeInstanceOf(Object);
                expect(added.id).toBe(credential.id);
                await Custodian.deleteCredential(alias);
                credential = await Custodian.getCredential(added.id);
                expect(credential).toBe(undefined);
            }),
            it('should throw an error if the credential already exists', async () => {
                let [credential,] = await issueRandomVC("LD_PROOF");
                let lastPart = credential.id.split(':').pop();
                let alias = `Test${lastPart}`
                await Custodian.storeCredential(alias, credential);
                try {
                    await Custodian.storeCredential(alias, credential);
                } catch (error) {
                    expect(error).toBeInstanceOf(Error);
                }
                await Custodian.deleteCredential(alias);
            }),
            it('should return a credential', async () => {
                let [credential,] = await issueRandomVC("LD_PROOF")
                let lastPart = credential.id.split(':').pop();
                let alias = `Test${lastPart}`
                await Custodian.storeCredential(alias, credential);
                let retrieved = await Custodian.getCredential(alias);
                expect(retrieved).toBeInstanceOf(Object);
                expect(retrieved.id).toBe(credential.id);
                expect(retrieved["@context"]).toBeInstanceOf(Object);
                await Custodian.deleteCredential(alias);
            }),
            it('should throw an error if the credential does not exist', async () => {
                try {
                    await Custodian.getCredential('did:monokee:123456789');
                } catch (error) {
                    expect(error).toBeInstanceOf(Error);
                }
            })
        });
        describe('should list all credential ids', () => {
            it('should return an array of credential ids', async () => {
                let [credential,] = await issueRandomVC("LD_PROOF")
                let lastPart = credential.id.split(':').pop();
                let alias = `Test${lastPart}`
                await Custodian.storeCredential(alias, credential);
                let retrieved = await Custodian.getCredentialIDs();
                expect(retrieved).toBeInstanceOf(Array);
                expect(retrieved.length).toBeGreaterThan(-1);
                await Custodian.deleteCredential(alias);
            })
        });
        describe('should create a Verifiable Presentation', () => {
            it('given credential(s)', async () => {
                let key: utils.Key = await Custodian.generateKey("EdDSA_Ed25519");
                let subjectDID = await Custodian.createDID("key", key);
                let [credential1,] = await issueRandomVC("LD_PROOF");
                let [credential2,] = await issueRandomVC("LD_PROOF");
                let vcs = [credential1, credential2];
                let vcsStrings = vcs.map(vc => JSON.stringify(vc))
                let request: utils.PresentCredentialsRequest = {
                    vcs: vcsStrings, 
                    holderDid: subjectDID,
                    discriminator: "presentCredentialsRequest"
                }
                let vp = await Custodian.presentCredentials(request);
                expect(vp).toBeInstanceOf(Object);
                expect(vp.verifiableCredential[0].id).toBe(credential1.id);
                expect(vp.verifiableCredential[1].id).toBe(credential2.id);
                expect(vp["@context"]).toBeInstanceOf(Object);
            })
            it('given credential id(s) ', async () => {
                let key: utils.Key = await Custodian.generateKey("EdDSA_Ed25519");
                let subjectDID = await Custodian.createDID("key", key);
                let [credential1,] = await issueRandomVC("LD_PROOF");
                let lastPart1 = credential1.id.split(':').pop();
                let alias1 = `Test${lastPart1}`
                await Custodian.storeCredential(alias1, credential1);
                let [credential2,] = await issueRandomVC("LD_PROOF");
                let lastPart2 = credential2.id.split(':').pop();
                let alias2 = `Test${lastPart2}`
                await Custodian.storeCredential(alias2, credential2);
                let request: utils.PresentCredentialIDsRequest = {
                    vcIds: [alias1, alias2],
                    holderDid: subjectDID,
                    discriminator: "presentCredentialIDsRequest"
                }
                let vp = await Custodian.presentCredentials(request);
                expect(vp).toBeInstanceOf(Object);
                expect(vp.verifiableCredential[0].id).toBe(credential1.id);
                expect(vp.verifiableCredential[1].id).toBe(credential2.id);
                expect(vp["@context"]).toBeInstanceOf(Object);
                await Custodian.deleteCredential(alias1);
                await Custodian.deleteCredential(alias2);
            })
        });
    });
})
