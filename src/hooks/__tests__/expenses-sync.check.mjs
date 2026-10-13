import assert from 'node:assert';

function formatExpensePayload(userId, data) {
  return {
    user_id: userId,
    amount: Math.round(data.amount),
    category: data.category,
    date: data.date,
    note: data.note || null,
  };
}

const payload = formatExpensePayload('uuid-123', {
  amount: 10000.4,
  category: 'Food',
  date: '2026-10-13',
  note: '',
});

assert.strictEqual(payload.user_id, 'uuid-123');
assert.strictEqual(payload.amount, 10000);
assert.strictEqual(payload.category, 'Food');
assert.strictEqual(payload.date, '2026-10-13');
assert.strictEqual(payload.note, null);

console.log('Self-check passed');
