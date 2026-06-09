const store = require('../src/data/store');
const assert = require('assert');

describe('Inventory Store', () => {
  it('should return an item by SKU', () => {
    const item = store.getItem('SKU-001');
    assert.ok(item);
    assert.strictEqual(item.sku, 'SKU-001');
  });

  it('should return null for unknown SKU', () => {
    assert.strictEqual(store.getItem('FAKE'), null);
  });
});
