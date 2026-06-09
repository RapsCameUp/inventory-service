// In-memory inventory store
const inventory = {
  'SKU-001': { sku: 'SKU-001', name: 'Widget A', quantity: 150, warehouse: 'WH-01' },
  'SKU-002': { sku: 'SKU-002', name: 'Widget B', quantity: 75, warehouse: 'WH-01' },
  'SKU-003': { sku: 'SKU-003', name: 'Gadget C', quantity: 200, warehouse: 'WH-02' },
};

function getItem(sku) {
  return inventory[sku] || null;
}

function updateQuantity(sku, quantity) {
  if (inventory[sku]) {
    inventory[sku].quantity = quantity;
  }
}

module.exports = { getItem, updateQuantity };
