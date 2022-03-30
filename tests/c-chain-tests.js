fujiAssetId = [
  0x3d, 0x9b, 0xda, 0xc0, 0xed, 0x1d, 0x76, 0x13,
  0x30, 0xcf, 0x68, 0x0e, 0xfd, 0xeb, 0x1a, 0x42,
  0x15, 0x9e, 0xb3, 0x87, 0xd6, 0xd2, 0x95, 0x0c,
  0x96, 0xf7, 0xd2, 0x8f, 0x61, 0xbb, 0xe2, 0xaa,
];
localAssetId = [
  0xdb, 0xcf, 0x89, 0x0f, 0x77, 0xf4, 0x9b, 0x96,
  0x85, 0x76, 0x48, 0xb7, 0x2b, 0x77, 0xf9, 0xf8,
  0x29, 0x37, 0xf2, 0x8a, 0x68, 0x70, 0x4a, 0xf0,
  0x5d, 0xa0, 0xdc, 0x12, 0xba, 0x53, 0xf2, 0xdb,
];

describe("C-chain import and export tests", () => {
  it('can sign an X-chain to C-chain import transaction', async function () {
    address = [ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00 ];
    amount = [ 0x00, 0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00 ];
    const txn = Buffer.from([
      // CodecID
      0x00, 0x00,
      // base tx:
      0x00, 0x00, 0x00, 0x00, // C chain import type
      0x00, 0x00, 0x30, 0x39, // Network ID

      // C chain on local testnet (destination)
      0x9d, 0x07, 0x75, 0xf4, 0x50, 0x60, 0x4b, 0xd2,
      0xfb, 0xc4, 0x9c, 0xe0, 0xc5, 0xc1, 0xc6, 0xdf,
      0xeb, 0x2d, 0xc2, 0xac, 0xb8, 0xc9, 0x2c, 0x26,
      0xee, 0xae, 0x6e, 0x6d, 0xf4, 0x50, 0x2b, 0x19,

      // X chain on local testnet (source)

      0xd8, 0x91, 0xad, 0x56, 0x05, 0x6d, 0x9c, 0x01,
      0xf1, 0x8f, 0x43, 0xf5, 0x8b, 0x5c, 0x78, 0x4a,
      0xd0, 0x7a, 0x4a, 0x49, 0xcf, 0x3d, 0x1f, 0x11,
      0x62, 0x38, 0x04, 0xb5, 0xcb, 0xa2, 0xc6, 0xbf,

      // Number of inputs
      0x00, 0x00, 0x00, 0x01,

      // Transaction ID
      0xf1, 0xe1, 0xd1, 0xc1, 0xb1, 0xa1, 0x91, 0x81,
      0x71, 0x61, 0x51, 0x41, 0x31, 0x21, 0x11, 0x01,
      0xf0, 0xe0, 0xd0, 0xc0, 0xb0, 0xa0, 0x90, 0x80,
      0x70, 0x60, 0x50, 0x40, 0x30, 0x20, 0x10, 0x00,

      // UTXO index
      0x00, 0x00, 0x00, 0x05,

      ... localAssetId,
      0x00, 0x00, 0x00, 0x05,
      // amount
      ... amount,
      // key indices
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00,

      // EVM outputs
      0x00, 0x00, 0x00, 0x01,
      // Destination address
      ... address,
      // amount
      ... amount,
      ... localAssetId,

    ]);
    const pathPrefix = "44'/60'/0'";
    const pathSuffixes = ["0/0", "0/1", "100/100"];
    const ui = await flowMultiPrompt(this.speculos, [
      [{header:"Sign", body:"Import"},
       {header:"Importing",body:"0.268435456 AVAX to local1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqljssag"},
       {header:"Fee", body:"0 AVAX"}],
      [{header:"Finalize",body:"Transaction"}],
    ]);
    const sigPromise = this.ava.signTransaction(
      BIPPath.fromString(pathPrefix),
      pathSuffixes.map(x => BIPPath.fromString(x, false)),
      txn,
    );
    await sigPromise;
    await ui.promptsPromise;
  });

  it('can sign a C-chain to X-chain export transaction', async function () {
    const txn = Buffer.from([
      // CodecID
      0x00, 0x00,
      // typeID:
      0x00, 0x00, 0x00, 0x01,
      // networkID:
      0x00, 0x00, 0x30, 0x39, // Network ID
      // blockchainID:
      0x9d, 0x07, 0x75, 0xf4, 0x50, 0x60, 0x4b, 0xd2,
      0xfb, 0xc4, 0x9c, 0xe0, 0xc5, 0xc1, 0xc6, 0xdf,
      0xeb, 0x2d, 0xc2, 0xac, 0xb8, 0xc9, 0x2c, 0x26,
      0xee, 0xae, 0x6e, 0x6d, 0xf4, 0x50, 0x2b, 0x19,
      // destination_chain:
      0xd8, 0x91, 0xad, 0x56, 0x05, 0x6d, 0x9c, 0x01,
      0xf1, 0x8f, 0x43, 0xf5, 0x8b, 0x5c, 0x78, 0x4a,
      0xd0, 0x7a, 0x4a, 0x49, 0xcf, 0x3d, 0x1f, 0x11,
      0x62, 0x38, 0x04, 0xb5, 0xcb, 0xa2, 0xc6, 0xbf,
      // inputs[] count:
      0x00, 0x00, 0x00, 0x01,
      // inputs[0]
      0x8d, 0xb9, 0x7c, 0x7c, 0xec, 0xe2, 0x49, 0xc2,
      0xb9, 0x8b, 0xdc, 0x02, 0x26, 0xcc, 0x4c, 0x2a,
      0x57, 0xbf, 0x52, 0xfc, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x1e, 0x84, 0x80, 0xdb, 0xcf, 0x89, 0x0f,
      0x77, 0xf4, 0x9b, 0x96, 0x85, 0x76, 0x48, 0xb7,
      0x2b, 0x77, 0xf9, 0xf8, 0x29, 0x37, 0xf2, 0x8a,
      0x68, 0x70, 0x4a, 0xf0, 0x5d, 0xa0, 0xdc, 0x12,
      0xba, 0x53, 0xf2, 0xdb, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      // exportedOutputs[] count
      0x00, 0x00, 0x00, 0x01,
      // exportedOutputs[0]
      0xdb, 0xcf, 0x89, 0x0f, 0x77, 0xf4, 0x9b, 0x96,
      0x85, 0x76, 0x48, 0xb7, 0x2b, 0x77, 0xf9, 0xf8,
      0x29, 0x37, 0xf2, 0x8a, 0x68, 0x70, 0x4a, 0xf0,
      0x5d, 0xa0, 0xdc, 0x12, 0xba, 0x53, 0xf2, 0xdb,
      0x00, 0x00, 0x00, 0x07, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x0f, 0x42, 0x40, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
      0x00, 0x00, 0x00, 0x01, 0x66, 0xf9, 0x0d, 0xb6,
      0x13, 0x7a, 0x78, 0xf7, 0x6b, 0x36, 0x93, 0xf7,
      0xf2, 0xbc, 0x50, 0x79, 0x56, 0xda, 0xe5, 0x63,
    ]);
    const pathPrefix = "44'/60'/0'";
    const pathSuffixes = ["0/0", "0/1", "100/100"];
    const ui = await flowMultiPrompt(this.speculos, [
      [{header:"Sign",body:"Export"},
       {header:"C chain export",body:'0.001 AVAX to local1vmusmdsn0fu0w6ekj0ml90zs09td4etrp5d6p7'},
       {header:"Fee",body:"0.001 AVAX"}],
      [{header:"Finalize",body:"Transaction"}],
    ]);
    const sigPromise = this.ava.signTransaction(
      BIPPath.fromString(pathPrefix),
      pathSuffixes.map(x => BIPPath.fromString(x, false)),
      txn,
    );
    await sigPromise;
    await ui.promptsPromise;
  });

  it('can sign a C-chain to P-chain export transaction', async function() {
    // Collected from avalanchejs examples:
    const txn = Buffer.from('000000000001000030399d0775f450604bd2fbc49ce0c5c1c6dfeb2dc2acb8c92c26eeae6e6df4502b190000000000000000000000000000000000000000000000000000000000000000000000018db97c7cece249c2b98bdc0226cc4c2a57bf52fc00b1a2bc2ec50000dbcf890f77f49b96857648b72b77f9f82937f28a68704af05da0dc12ba53f2db000000000000000000000001dbcf890f77f49b96857648b72b77f9f82937f28a68704af05da0dc12ba53f2db0000000700a8a8ab5a955400000000000000000000000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c', 'hex');
    const pathPrefix = "44'/60'/0'";
    const pathSuffixes = ["0/0", "0/1", "100/100"];
    const ui = await flowMultiPrompt(this.speculos, [
      [{header:"Sign",body:"Export"},
       {header:"C chain export",body:'47473250 AVAX to local18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u'},
       {header:"Fee",body:"2526750 AVAX"}],
      [{header:"Finalize",body:"Transaction"}],
    ]);
    const sigPromise = this.ava.signTransaction(
      BIPPath.fromString(pathPrefix),
      pathSuffixes.map(x => BIPPath.fromString(x, false)),
      txn,
    );
    await sigPromise;
    await ui.promptsPromise;
  });

  it('can sign an P-chain to C-chain import transaction', async function() {
    // Collected from avalanchejs examples:
    const txn = Buffer.from('000000000000000030399d0775f450604bd2fbc49ce0c5c1c6dfeb2dc2acb8c92c26eeae6e6df4502b190000000000000000000000000000000000000000000000000000000000000000000000011d77d94aaefd25c0c2544acaff85290690737d7f0234d3fc754276b40f98d5d900000000dbcf890f77f49b96857648b72b77f9f82937f28a68704af05da0dc12ba53f2db00000005006a94d713a836000000000100000000000000018db97c7cece249c2b98bdc0226cc4c2a57bf52fc00619ac63f788a00dbcf890f77f49b96857648b72b77f9f82937f28a68704af05da0dc12ba53f2db', 'hex');
    const pathPrefix = "44'/60'/0'";
    const pathSuffixes = ["0/0", "0/1", "100/100"];
    const ui = await flowMultiPrompt(this.speculos, [
      [{header:"Sign", body:"Import"},
       {header:"Importing",body:"27473249 AVAX to local13kuhcl8vufyu9wvtmspzdnzv9ftm75hunmtqe9"},
       {header:"Fee", body:"2526750 AVAX"}],
      [{header:"Finalize",body:"Transaction"}],
    ]);
    const sigPromise = this.ava.signTransaction(
      BIPPath.fromString(pathPrefix),
      pathSuffixes.map(x => BIPPath.fromString(x, false)),
      txn,
    );
    await sigPromise;
    await ui.promptsPromise;
  });
});
