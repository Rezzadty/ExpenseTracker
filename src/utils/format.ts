export function formatMoney(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

export function formatDate() {
  const now = new Date();
  const weekday = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const month = now.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
  const day = now.getDate();
  return `${weekday}, ${month} ${day}`;
}
