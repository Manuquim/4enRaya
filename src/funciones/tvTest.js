export const TEST_DURATION = 60000;

export function createChallenge(now = Date.now()) {
  const digits = new Uint32Array(1);
  globalThis.crypto.getRandomValues(digits);
  return { code: String(1000 + digits[0] % 9000), expiresAt: now + TEST_DURATION };
}

export function checkChallenge(challenge, answer, now = Date.now()) {
  if (!challenge || now >= challenge.expiresAt) return 'expired';
  return answer.trim() === challenge.code ? 'confirmed' : 'incorrect';
}
