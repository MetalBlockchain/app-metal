# APDU

An APDU is sent by a client to the ledger hardware. This message tells
the ledger some operation to run. Most APDU messages will be
accompanied by an Accept / Deny prompt on the Ledger. Once the user
hits “Accept” the Ledger will issue a response to the Metal client.
The basic format of the APDU request follows.

| Field | Length | Description                                                             |
|-------|--------|-------------------------------------------------------------------------|
| CLA   | 1 byte | Instruction class (0x80 or 0xe0)                                        |
| INS   | 1 byte | Instruction code (0x00-0x0f)                                            |
| P1    | 1 byte | Message sequence (0x00 = first, 0x81 = last, 0x01 = other)              |
| P2    | 1 byte | Derivation type (0=ED25519, 1=SECP256K1, 2=SECP256R1, 3=BIPS32_ED25519) |
| LC    | 1 byte | Length of CDATA                                                         |
| CDATA | <LC>   | Payload containing instruction arguments                                |

Each APDU has a header of 5 bytes followed by some data. The format of
the data will depend on which instruction is being used.

## APDU instructions in use by Metal Ledger apps

The following APDU instructions are applicable when CLA equals 0x80 and are applicable for all non EVM based instructions.

| Instruction                     | Code | Prompt | Short description                                |
|---------------------------------|------|--------|--------------------------------------------------|
| `INS_VERSION`                   | 0x00 | No     | Get version information for the ledger           |
| `INS_GET_WALLET_ID`             | 0x01 | No     | Get the ledger’s internal public key             |
| `INS_GET_PUBLIC_KEY`            | 0x02 | No     | Get the ledger’s internal public key             |
| `INS_GET_PUBLIC_KEY_EXT`        | 0x03 | Yes    | Prompt for the ledger’s internal public key      |
| `INS_SIGN_HASH`                 | 0x04 | Yes    | Sign a message with the ledger’s key             |
| `INS_SIGN_TRANSACTION`          | 0x05 | Yes    | Sign a message with the ledger’s key (no hash)   |

The following APDU instructions are applicable when CLA equals 0xe0 and are cloned after the Ethereum Ledger application.

| Instruction                     | Code | Prompt | Short description                                                                |
|---------------------------------|------|--------|----------------------------------------------------------------------------------|
| `INS_GET_ADDRESS`               | 0x02 | No     | Returns the public key and Ethereum address for the given BIP 32 path            |
| `INS_SIGN_TRANSACTION`          | 0x04 | Yes    | Signs an Ethereum transaction                                                    |
| `INS_PROVIDE_ERC20`             | 0x0a | Yes    | Provides a trusted description of an ERC 20 token                                |