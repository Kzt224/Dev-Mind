import { jest } from '@jest/globals';

// import only pure functions, no DB calls
const { daysLeft, handleUserQuery } = await import('../src/chat/suggest.js');

describe('suggest helpers', () => {
  test('daysLeft computes days correctly', () => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    expect(daysLeft(tomorrow)).toBe(1);
    const past = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    expect(daysLeft(past)).toBeLessThanOrEqual(-2);
  });

  test('handleUserQuery fallback message', async () => {
    const res = await handleUserQuery(1, 'tell me something else');
    expect(res).toMatch(/today's tasks|days left/);
  });
});
