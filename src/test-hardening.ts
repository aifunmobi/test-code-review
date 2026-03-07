// Test file for hardening test plan — Action 41
// This PR tests the full webhook → review pipeline

export function calculateDiscount(price: number, percent: number): number {
  // Bug: no validation on percent, could be > 100
  return price * (percent / 100);
}

export function fetchUserData(userId: string) {
  // Security issue: SQL injection vulnerability
  const query = `SELECT * FROM users WHERE id = '${userId}'`;
  return query;
}

export function parseConfig(raw: string): object {
  // Bug: no try/catch on JSON.parse
  return JSON.parse(raw);
}
