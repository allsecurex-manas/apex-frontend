// src/utils/pkceUtils.js

function base64URLEncode(str) {
  return btoa(String.fromCharCode(...new Uint8Array(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function generatePKCE() {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);

  const codeVerifier = base64URLEncode(randomBytes);
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier));
  const codeChallenge = base64URLEncode(digest);

  return { codeVerifier, codeChallenge };
}

export default generatePKCE;
