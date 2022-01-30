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
        [types.principal(`${deployer.address}.fun-nft`), types.uint(1)],
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
        [types.principal(`${deployer.address}.fun-nft`), types.uint(1)],
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

    profileData = profile.result.expectOk().expectNone();
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

    let profileData = profile.result.expectNone();

    block = chain.mineBlock([
      Tx.contractCall(
        'owned-profiles',
        'register',
        [types.principal(`${deployer.address}.fun-nft`), types.uint(1)],
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

    profileData = profile.result.expectNone();

    profile = chain.callReadOnlyFn(
      'owned-profiles',
      'resolve-principal-to-profile',
      [
        types.principal(wallet_1.address),
        types.principal(`${deployer.address}.fun-nft`),
      ],
      deployer.address
    );

    profileData = profile.result.expectOk().expectNone();
  },
});
