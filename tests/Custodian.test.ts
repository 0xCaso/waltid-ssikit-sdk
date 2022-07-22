import { Custodian } from '../core/Custodian';

describe('Custodian Class', () => {

    describe('Key Management', () => {

        beforeEach(async () => {
            await Custodian.deleteAllKeys();
        })
        
        describe('generateKey', () => {
            it('should generate a key', async () => {
                let key = await Custodian.generateKey("RSA");
                expect(key).toBeInstanceOf(Object);
                expect(typeof key.keyId.id).toBe('string');
            })
        })
        describe('getKeys', () => {
            it('should return an array of keys', async () => {
                for (let i = 0; i < 5; i++) {
                    await Custodian.generateKey("RSA");
                }
                let keys = await Custodian.getKeys();
                expect(keys).toBeInstanceOf(Array);
                expect(keys.length).toBe(5);
                expect(typeof keys[0].keyId.id).toBe('string');
            });
        }),
        describe('getKey', () => {
            it('should return a key', async () => {
                let key = await Custodian.generateKey("RSA");
                key = await Custodian.getKey(key.keyId.id);
                expect(key).toBeInstanceOf(Object);
                expect(typeof key.keyId.id).toBe('string');
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
                let key = await Custodian.generateKey("RSA");
                await Custodian.deleteKey(key.keyId.id);
                let keys = await Custodian.getKeys();
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
                let key = await Custodian.generateKey("RSA");
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
                let key = await Custodian.generateKey("RSA");
                let exported = await Custodian.exportKey(key, "JWK", true);
                await Custodian.deleteKey(key.keyId.id);
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
                let key = await Custodian.generateKey("RSA");
                let exported = await Custodian.exportKey(key, "JWK", true);
                try {
                    await Custodian.importKey(exported);
                } catch (error) {
                    expect(error).toBeInstanceOf(Error);
                }
            })
        })

    })

    describe('DID Management', () => {

        beforeEach(async () => {
            await Custodian.deleteAllDIDs();
        })

        describe('getDIDs', () => {
            it('should return an array of DIDs', async () => {
                let key = await Custodian.generateKey("EdDSA_Ed25519");
                await Custodian.createDID("key", key.keyId.id);
                let dids = await Custodian.getDIDs();
                expect(dids).toBeInstanceOf(Array);
                expect(typeof dids[0]).toBe('string')
            })
        })
        describe('getDID', () => {
            it('should return a DID', async () => {
                let key = await Custodian.generateKey("EdDSA_Ed25519");
                await Custodian.createDID("key", key.keyId.id);
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
                let key = await Custodian.generateKey("EdDSA_Ed25519");
                let did = await Custodian.createDID("key", key.keyId.id);
                expect(typeof did).toBe('string');
                let didParts = did.split(':');
                expect(didParts[0]).toBe("did");
                expect(didParts[1]).toBe("key");
            }),
            it('should throw an error if the DID already exists', async () => {
                try {
                    let key = await Custodian.generateKey("EdDSA_Ed25519");
                    await Custodian.createDID("key", key.keyId.id);
                    await Custodian.createDID("key", key.keyId.id);
                } catch (error) {
                    expect(error).toBeInstanceOf(Error);
                }
            })
        })
        describe('deleteDID', () => {
            it('should delete a DID', async () => {
                let key = await Custodian.generateKey("EdDSA_Ed25519");
                let did = await Custodian.createDID("key", key.keyId.id);
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
                let key = await Custodian.generateKey("EdDSA_Ed25519");
                let did = await Custodian.createDID("key", key.keyId.id);
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

    })
})
