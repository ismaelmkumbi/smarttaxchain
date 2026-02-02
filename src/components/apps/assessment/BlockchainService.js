// Blockchain Service Implementation
export default class BlockchainService {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.pendingTransactions = [];
  }

  createGenesisBlock() {
    return {
      index: 0,
      timestamp: '2024-01-01T00:00:00Z',
      transactions: [{ type: 'GENESIS', details: 'Initial block' }],
      previousHash: '0',
      hash: '0000000000000000000000000000000000000000000000000000000000000000',
    };
  }

  calculateHash(block) {
    const str = JSON.stringify(block);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash.toString(16).padStart(64, '0');
  }

  createBlock(transactions) {
    const block = {
      index: this.chain.length,
      timestamp: new Date().toISOString(),
      transactions,
      previousHash: this.chain[this.chain.length - 1].hash,
      hash: '',
    };
    block.hash = this.calculateHash(block);
    return block;
  }

  addTransaction(transaction) {
    const tx = {
      ...transaction,
      timestamp: new Date().toISOString(),
      txId: `tx-${Math.random().toString(36).substring(2, 11)}`,
    };
    this.pendingTransactions.push(tx);
    const block = this.createBlock([...this.pendingTransactions]);
    this.chain.push(block);
    this.pendingTransactions = [];
    return { tx, block };
  }

  getChain() {
    return this.chain;
  }
}
