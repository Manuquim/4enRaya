import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createChallenge, checkChallenge, TEST_DURATION } from '../src/funciones/tvTest.js';

test('challenge has four digits and expires after sixty seconds', () => {
  const challenge = createChallenge(1000);
  assert.match(challenge.code, /^[1-9][0-9]{3}$/);
  assert.equal(challenge.expiresAt, 1000 + TEST_DURATION);
});

test('only a correct, unexpired confirmation passes the visual test', () => {
  const challenge = { code: '1234', expiresAt: 60000 };
  assert.equal(checkChallenge(challenge, ' 1234 ', 59999), 'confirmed');
  assert.equal(checkChallenge(challenge, '4321', 59999), 'incorrect');
  assert.equal(checkChallenge(challenge, '', 59999), 'incorrect');
  assert.equal(checkChallenge(challenge, '1234', 60000), 'expired');
  assert.equal(checkChallenge(null, '1234', 1), 'expired');
});
