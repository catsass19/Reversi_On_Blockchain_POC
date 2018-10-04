/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

const HDWalletProvider = require('truffle-hdwallet-provider');

const infuraRinkeby = 'https://rinkeby.infura.io/v3/3023ca2e1e814c94ac389c5a2f34cefb';
const mnemonic = 'lesson vanish employ control whisper fix capital peace across pupil void like';

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, infuraRinkeby),
      network_id: 1,
    },
  }
};
