import { Clarinet, Chain, Account, Tx, types } from './libs/deps.ts';

Clarinet.test({
  name: 'Ensure that user can register and verify profile',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get('deployer')!;
    let wallet_1 = accounts.get('wallet_1')!;
    let wallet_2 = accounts.get('wallet_2')!;

    let block = chain.mineBlock([
      Tx.contractCall('fun-nft', 'mint', [], wallet_1.address),
    ]);
    block.receipts[0].result.expectOk();

    block = chain.mineBlock([
      Tx.contractCall(
        'owned-profiles',
        'register',
        [types.principal(`${deployer.address}.fun-nft`), types.uint(1),
        types.principal(`${deployer.address}.commission-free`)],
        wallet_1.address
      ),
    ]);
    block.receipts[0].result.expectOk();

    let profile = chain.callReadOnlyFn(
      'owned-profiles',
      'get-unverified-profile',
      [types.principal(wallet_1.address)],
      deployer.address
    );

    let profileData = profile.result.expectSome().expectTuple() as any;
    profileData['contract'].expectPrincipal(`${deployer.address}.fun-nft`);
    profileData['id'].expectUint(1);

    profile = chain.callReadOnlyFn(
      'owned-profiles',
      'resolve-principal-to-profile',
      [
        types.principal(wallet_1.address),
        types.principal(`${deployer.address}.fun-nft`),
      ],
      deployer.address
    );

    profileData = profile.result.expectOk().expectSome().expectTuple() as any;
    profileData['contract'].expectPrincipal(`${deployer.address}.fun-nft`);
    profileData['id'].expectUint(1);
  },
});

Clarinet.test({
  name: 'Ensure that user cannot verify profile after transfer',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get('deployer')!;
    let wallet_1 = accounts.get('wallet_1')!;
    let wallet_2 = accounts.get('wallet_2')!;

    let block = chain.mineBlock([
      Tx.contractCall('fun-nft', 'mint', [], wallet_1.address),
    ]);
    block.receipts[0].result.expectOk();

    block = chain.mineBlock([
      Tx.contractCall(
        'owned-profiles',
        'register',
        [types.principal(`${deployer.address}.fun-nft`), types.uint(1),
        types.principal(`${deployer.address}.commission-free`)],
        wallet_1.address
      ),

      Tx.contractCall(
        'fun-nft',
        'transfer',
        [
          types.uint(1),
          types.principal(wallet_1.address),
          types.principal(wallet_2.address),
        ],
        wallet_1.address
      ),
    ]);

    block.receipts[0].result.expectOk();
    block.receipts[1].result.expectOk();

    let profile = chain.callReadOnlyFn(
      'owned-profiles',
      'get-unverified-profile',
      [types.principal(wallet_1.address)],
      deployer.address
    );

    let profileData = profile.result.expectSome().expectTuple() as any;
    profileData['contract'].expectPrincipal(`${deployer.address}.fun-nft`);
    profileData['id'].expectUint(1);

    profile = chain.callReadOnlyFn(
      'owned-profiles',
      'resolve-principal-to-profile',
      [
        types.principal(wallet_1.address),
        types.principal(`${deployer.address}.fun-nft`),
      ],
      deployer.address
    );
    profile.result.expectOk().expectNone();
  },
});

Clarinet.test({
  name: 'Ensure that user can register, delete in 1 block',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get('deployer')!;
    let wallet_1 = accounts.get('wallet_1')!;
    let wallet_2 = accounts.get('wallet_2')!;

    let block = chain.mineBlock([
      Tx.contractCall('fun-nft', 'mint', [], wallet_1.address),
    ]);

    block.receipts[0].result.expectOk();

    let profile = chain.callReadOnlyFn(
      'owned-profiles',
      'get-unverified-profile',
      [types.principal(wallet_1.address)],
      deployer.address
    );
    profile.result.expectNone();

    block = chain.mineBlock([
      Tx.contractCall(
        'owned-profiles',
        'register',
        [types.principal(`${deployer.address}.fun-nft`), types.uint(1),
        types.principal(`${deployer.address}.commission-free`)],
        wallet_1.address
      ),
      Tx.contractCall(
        'owned-profiles',
        'resolve-principal-to-profile',
        [
          types.principal(wallet_1.address),
          types.principal(`${deployer.address}.fun-nft`),
        ],
        deployer.address
      ),
      Tx.contractCall('owned-profiles', 'delete', [], wallet_1.address),
    ]);

    block.receipts[0].result.expectOk();
    block.receipts[1].result.expectOk();
    block.receipts[2].result.expectOk();

    profile = chain.callReadOnlyFn(
      'owned-profiles',
      'get-unverified-profile',
      [types.principal(wallet_1.address)],
      deployer.address
    );
    profile.result.expectNone();

    profile = chain.callReadOnlyFn(
      'owned-profiles',
      'resolve-principal-to-profile',
      [
        types.principal(wallet_1.address),
        types.principal(`${deployer.address}.fun-nft`),
      ],
      deployer.address
    );
    profile.result.expectOk().expectNone();

    // profile is not blocked
    const blockedUntil = chain.callReadOnlyFn(
      'owned-profiles',
      'get-profile-blocked-until',
      [types.principal(`${deployer.address}.fun-nft`), types.uint(1)],
      deployer.address
    );
    blockedUntil.result.expectNone();
  },
});

Clarinet.test({
  name: 'Ensure that user can register deleted profile',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get('deployer')!;
    let wallet_1 = accounts.get('wallet_1')!;
    let wallet_2 = accounts.get('wallet_2')!;

    let block = chain.mineBlock([
      Tx.contractCall('fun-nft', 'mint', [], wallet_1.address),
    ]);
    block.receipts[0].result.expectOk();

    block = chain.mineBlock([
      // register
      Tx.contractCall(
        'owned-profiles',
        'register',
        [types.principal(`${deployer.address}.fun-nft`), types.uint(1),
        types.principal(`${deployer.address}.commission-free`)],
        wallet_1.address
      ),
      // delete
      Tx.contractCall('owned-profiles', 'delete', [], wallet_1.address),
      // transfer
      Tx.contractCall(
        'fun-nft',
        'transfer',
        [
          types.uint(1),
          types.principal(wallet_1.address),
          types.principal(wallet_2.address),
        ],
        wallet_1.address
      ),
      // try to register
      Tx.contractCall(
        'owned-profiles',
        'register',
        [types.principal(`${deployer.address}.fun-nft`), types.uint(1),
        types.principal(`${deployer.address}.commission-free`)],
        wallet_2.address
      ),
    ]);
    block.receipts[0].result.expectOk();
    block.receipts[1].result.expectOk();
    block.receipts[2].result.expectOk();
    block.receipts[3].result.expectOk(); // profile was not blocked by previous owner
  },
});

Clarinet.test({
  name: 'Ensure that user can register blocked profile only after 4000 blocks',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get('deployer')!;
    let wallet_1 = accounts.get('wallet_1')!;
    let wallet_2 = accounts.get('wallet_2')!;

    let block = chain.mineBlock([
      Tx.contractCall('fun-nft', 'mint', [], wallet_1.address),
    ]);
    block.receipts[0].result.expectOk();

    block = chain.mineBlock([
      // register
      Tx.contractCall(
        'owned-profiles',
        'register',
        [types.principal(`${deployer.address}.fun-nft`), types.uint(1),
        types.principal(`${deployer.address}.commission-free`)],
        wallet_1.address
      ),
      // delete
      Tx.contractCall(
        'owned-profiles',
        'delete-and-block',
        [types.principal(`${deployer.address}.fun-nft`)],
        wallet_1.address
      ),
      // transfer
      Tx.contractCall(
        'fun-nft',
        'transfer',
        [
          types.uint(1),
          types.principal(wallet_1.address),
          types.principal(wallet_2.address),
        ],
        wallet_1.address
      ),
      // try to register
      Tx.contractCall(
        'owned-profiles',
        'register',
        [types.principal(`${deployer.address}.fun-nft`), types.uint(1),
        types.principal(`${deployer.address}.commission-free`)],
        wallet_2.address
      ),
    ]);
    block.receipts[0].result.expectOk();
    block.receipts[1].result.expectOk();
    block.receipts[2].result.expectOk();
    block.receipts[3].result.expectErr().expectUint(500); // profile is blocked

    chain.mineEmptyBlock(3999);
    // registration still fails
    block = chain.mineBlock([
      // try to register
      Tx.contractCall(
        'owned-profiles',
        'register',
        [types.principal(`${deployer.address}.fun-nft`), types.uint(1),
        types.principal(`${deployer.address}.commission-free`)],
        wallet_2.address
      ),
    ]);
    block.receipts[0].result.expectErr().expectUint(500); // profile is blocked

    // registration succeeds
    block = chain.mineBlock([
      // register
      Tx.contractCall(
        'owned-profiles',
        'register',
        [types.principal(`${deployer.address}.fun-nft`), types.uint(1),
        types.principal(`${deployer.address}.commission-free`)],
        wallet_2.address
      ),
    ]);
    block.receipts[0].result.expectOk();
  },
});

Clarinet.test({
  name: 'Ensure that user cannot block profile after transfer',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get('deployer')!;
    let wallet_1 = accounts.get('wallet_1')!;
    let wallet_2 = accounts.get('wallet_2')!;

    let block = chain.mineBlock([
      Tx.contractCall('fun-nft', 'mint', [], wallet_1.address),
    ]);
    block.receipts[0].result.expectOk();

    block = chain.mineBlock([
      // register
      Tx.contractCall(
        'owned-profiles',
        'register',
        [types.principal(`${deployer.address}.fun-nft`), types.uint(1),
        types.principal(`${deployer.address}.commission-free`)],
        wallet_1.address
      ),
      // transfer
      Tx.contractCall(
        'fun-nft',
        'transfer',
        [
          types.uint(1),
          types.principal(wallet_1.address),
          types.principal(wallet_2.address),
        ],
        wallet_1.address
      ),
      // try delete and block -> fails
      Tx.contractCall(
        'owned-profiles',
        'delete-and-block',
        [types.principal(`${deployer.address}.fun-nft`)],
        wallet_1.address
      ),
      // delete
      Tx.contractCall('owned-profiles', 'delete', [], wallet_1.address),
      // register
      Tx.contractCall(
        'owned-profiles',
        'register',
        [types.principal(`${deployer.address}.fun-nft`), types.uint(1),
        types.principal(`${deployer.address}.commission-free`)],
        wallet_2.address
      ),
    ]);
    block.receipts[0].result.expectOk();
    block.receipts[1].result.expectOk();
    block.receipts[2].result.expectErr().expectUint(403); // profile not owned
    block.receipts[3].result.expectOk();
    block.receipts[4].result.expectOk();
  },
});

Clarinet.test({
  name: 'Ensure that user can register, delete and block in 1 block',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get('deployer')!;
    let wallet_1 = accounts.get('wallet_1')!;
    let wallet_2 = accounts.get('wallet_2')!;

    let block = chain.mineBlock([
      Tx.contractCall('fun-nft', 'mint', [], wallet_1.address),
    ]);

    block.receipts[0].result.expectOk();

    let profile = chain.callReadOnlyFn(
      'owned-profiles',
      'get-unverified-profile',
      [types.principal(wallet_1.address)],
      deployer.address
    );
    profile.result.expectNone();

    block = chain.mineBlock([
      Tx.contractCall(
        'owned-profiles',
        'register',
        [types.principal(`${deployer.address}.fun-nft`), types.uint(1),
        types.principal(`${deployer.address}.commission-free`)],
        wallet_1.address
      ),
      Tx.contractCall(
        'owned-profiles',
        'delete-and-block',
        [types.principal(`${deployer.address}.fun-nft`)],
        wallet_1.address
      ),
      Tx.contractCall('owned-profiles', 'delete', [], wallet_1.address),
    ]);

    block.receipts[0].result.expectOk();
    block.receipts[1].result.expectOk();
    block.receipts[2].result.expectOk(); // delete is a no-operation

    // profile is blocked
    const blockedUntil = chain.callReadOnlyFn(
      'owned-profiles',
      'get-profile-blocked-until',
      [types.principal(`${deployer.address}.fun-nft`), types.uint(1)],
      deployer.address
    );
    blockedUntil.result.expectSome().expectUint(4002);
  },
});

Clarinet.test({
  name: 'Ensure that user cannot register not owned profile',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get('deployer')!;
    let wallet_1 = accounts.get('wallet_1')!;
    let wallet_2 = accounts.get('wallet_2')!;

    let block = chain.mineBlock([
      Tx.contractCall('fun-nft', 'mint', [], wallet_1.address),
    ]);

    block.receipts[0].result.expectOk();

    let profile = chain.callReadOnlyFn(
      'owned-profiles',
      'get-unverified-profile',
      [types.principal(wallet_2.address)],
      deployer.address
    );
    profile.result.expectNone();

    block = chain.mineBlock([
      Tx.contractCall(
        'owned-profiles',
        'register',
        [types.principal(`${deployer.address}.fun-nft`), types.uint(1),
        types.principal(`${deployer.address}.commission-free`)],
        wallet_2.address
      ),
    ]);

    block.receipts[0].result.expectErr().expectUint(403);
  },
});



Clarinet.test({
  name: 'Ensure that user pays commission during registration',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get('deployer')!;
    let wallet_1 = accounts.get('wallet_1')!;
    let wallet_2 = accounts.get('wallet_2')!;

    let block = chain.mineBlock([
      Tx.contractCall('fun-nft', 'mint', [], wallet_1.address),
    ]);
    block.receipts[0].result.expectOk();

    block = chain.mineBlock([
      Tx.contractCall(
        'owned-profiles',
        'register',
        [types.principal(`${deployer.address}.fun-nft`), types.uint(1),
        types.principal(`${deployer.address}.commission-fixed`)],
        wallet_1.address
      ),
    ]);

    block.receipts[0].result.expectOk()
    block.receipts[0].events.expectSTXTransferEvent(
      2_000_000,
      wallet_1.address,
      deployer.address
    )
  },
});
