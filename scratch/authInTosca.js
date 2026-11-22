globalThis.__fd = 'pending';
var U = "test.automationcpquser3@danfossonecrm.com.onecrmuat";
var K = "3MVG9hYFI5K4tx6T7QHeTEu9CRXRyxgQC4TJBYrqY5g2FF5FpK6EayuMbJOjnRD10UcEQHNUwdAO3bWapYxTt";
var H = "https://danfossonecrm--onecrmuat.sandbox.my.salesforce.com";
var P = "-----BEGIN PRIVATE KEY----- MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCY1Hl941zMb01C FuvL5x+2LGw16BTP4Zyc9zUU/PLCvgREutO4mh8Fk+uWZCIpfWGv9w9k27GQNCbB Dft4AEq1qOp7mShcCOgdJBJA/29oGOdTSWKRL3UzD5Rk612EaNILFx5EY7nKAIn7 d48wRCm1igN/md3I8Dqygz6WikRFRt++lOO1QPdlgqbFtYJgcYWhPO5o9HPYKZRu 95hiM8d+kBd/8K3MqfwFIRtpHHtBaP1KmK3vNqMtXP9kpdeqQzf4/YhuO7eXkgsW VB33vcvhw/jE62fmsMmnkk1pkqfJ9iddp/ZD3LdJkh+2qz8InpIZNCPjzg7n5jwJ SsWLHHI/AgMBAAECggEAD1UQTokJos2Ea93JJdQtR2/5IoatgSt/tEmiuX/Pn6pD hbJT56BiqK3DLqZ4vOksweQLLHxT5IUu4XhUeEtYiMAGV4Rb2waJDtSzFh0/i9XP w03ImzXZJVhp8/P0QQKTwUlo9RsnekoH4xgGtU9pUHf6S4oKs4wnlLLRC8uZoh9x 2FLg9uJRCpanEOg4oG7qzn2u4idyVv+VR6p7ipirwfIyyuoeT4XzMFaMReSN8OUu hGNhiTZWhJyEQSlQBcCXGvp2uFLSqCb6cMYO9LS2Wg+bUmMSdSynVCyKRoszSjdk sT7supX1OFv3mC439KrxX6cG8X8715Xb4Bo02y8R5QKBgQDUIJsxvtjN62l7NthG jhSvbzyZ8gdwwJWgX55BRlF1RWDQbCdpq3WVmeqE6ItGI6pnvMUQJtZq1klD1Jr7 6WQCnWFfdAIVZngr3KzAFDi6zabEF3q8IkGNsJAEeQGw2rCl9kEarnkYrPqNfxre qvTnnrtMw/u6xaohPH7EKPSDCwKBgQC4cEgGHPtbd+q04l1v0LFy8zx90kBMEu2U mrLNKtcgTWuZqCnBLmaEEGkzaVkw6BKKdf68HEnhkOPEr7HvAUFYt0Ny6AigXocs +KZLJms67lWfY6jtU5e3Bf9/FyWKCG4jnSLI9w9oZmKokTc4SQsdkg7vrDgbqDhM BFzEEB0OHQKBgQCDjtlRR8BkLV0U2pXVZCa2CvH1s+Ijbn0dok+ewgKhDW8WtAzZ f0oEhxmoZiSCUnpLrgo1kzClv9JebAvWsg+hg4OxVFw6c3uSEGFfGut4BzUnJjyr Uz9+pYMcEwQWb/rgYtJLvutBf35ApRTABhyvTYVx/ZYwZoi15jPkalYCswKBgQCJ bpEcjQf3Vlm7w1kgcn9nSjvu/XYPuaLysns9SgjW9xmQe6/xVOPq0FeziXJ+cM8w AVB5VxLuU4qFCu4pS+QneRd3TdLvvMA5EGbJZK1OUj3W8On1Pe604HFLgDHmsvVu 8C31VbNTdcdaGCrvc+4mcKlUih2c7jJU4oNFTUR5OQKBgCmhlRhMWQbr56nQrqLN xlgAXIzn9++9KIQDKzkhQKUlFYBk+pCwgr2FdXd7Ie79xZynDf6c53GJaXxQOSdL YyTakPiZVWzZXV5f9lD6i9cUfKHJXIgAu78KqUsOpPvNfpYCNkywUBeIh7ZeG/Q6 //+X3VCKGx0k9dauEZMYzTFb -----END PRIVATE KEY-----";
var R = '/lightning/o/Account/list';
var OB = String.fromCharCode(123);
var CB = String.fromCharCode(125);
var BSN = String.fromCharCode(92) + 'n';
var enc = new TextEncoder();
var CR = globalThis.crypto || require('crypto').webcrypto;
var cp = () => Promise.resolve().then(() => typeof require != 'undefined' ? require('child_process') : typeof process != 'undefined' && process.getBuiltinModule ? process.getBuiltinModule('child_process') : new Function('return import("node:child_process")')());
var go = u => typeof location != 'undefined' ? location.assign(u) : cp().then(m => (m.exec('start "" chrome "' + u + '" || start "" "' + u + '"'), globalThis.__launch = 'started')).catch(e => (globalThis.__launch = 'FAILED: ' + (e.message || e), typeof console != 'undefined' && console.log('Could not launch Chrome (' + (e.message || e) + '). Frontdoor URL: ' + u)));
var fail = m => (globalThis.__fd = 'ERROR: ' + m, typeof console != 'undefined' && console.log(globalThis.__fd));
var b64u = s => s.split('+').join('-').split('/').join('_').split('=').join('');
var toB64 = u8 => btoa(Array.from(u8, c => String.fromCharCode(c)).join(''));
var cat = (...parts) => Uint8Array.from(parts.flatMap(p => Array.from(p)));
var lenB = n => n < 128 ? Uint8Array.of(n) : n < 256 ? Uint8Array.of(129, n) : Uint8Array.of(130, n >> 8, n & 255);
var algId = Uint8Array.of(48, 13, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 1, 5, 0);
var wrap = d => cat(Uint8Array.of(2, 1, 0), algId, cat(Uint8Array.of(4), lenB(d.length), d));
var toP8 = d => cat(Uint8Array.of(48), lenB(wrap(d).length), wrap(d));
var ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
var clean = P.split(BSN).join('');
var body = clean.includes('-----') ? clean.split('-----').at(2) : clean;
var der = Uint8Array.from(atob(Array.from(body).filter(c => ALPHA.includes(c)).join('')), c => c.charCodeAt(0));
var skip = der.at(1) > 127 ? 2 + (der.at(1) & 127) : 2;
var p8 = der.at(skip + 3) == 48 ? der : toP8(der);
var ALG = JSON.parse(OB + '"name":"RSASSA-PKCS1-v1_5","hash":"SHA-256"' + CB);
var AUD = new URL(H).origin;
var hdr = b64u(toB64(enc.encode(OB + '"alg":"RS256","typ":"JWT"' + CB)));
var clm = b64u(toB64(enc.encode(OB + '"iss":"' + K + '","sub":"' + U + '","aud":"' + AUD + '","exp":' + (Math.floor(Date.now() / 1000) + 180) + CB)));
var SI = hdr + '.' + clm;
var GT = 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=';
var tokenOpts = a => JSON.parse(OB + '"method":"POST","headers":' + OB + '"Content-Type":"application/x-www-form-urlencoded"' + CB + ',"body":"' + GT + a + '"' + CB);
var bridgeOpts = t => JSON.parse(OB + '"headers":' + OB + '"Authorization":"Bearer ' + t + '"' + CB + CB);
CR.subtle.importKey('pkcs8', p8, ALG, false, 'sign'.split(','))
  .then(key => CR.subtle.sign('RSASSA-PKCS1-v1_5', key, enc.encode(SI)))
  .then(sig => SI + '.' + b64u(toB64(new Uint8Array(sig))))
  .then(a => fetch(new URL('/services/oauth2/token', H).href, tokenOpts(a)))
  .then(r => r.ok ? r.json() : r.text().then(t => Promise.reject('JWT exchange failed, HTTP ' + r.status + ': ' + t.slice(0, 300))))
  .then(t => fetch(t.instance_url + '/services/oauth2/singleaccess?redirect_uri=' + encodeURIComponent(R), bridgeOpts(t.access_token)))
  .then(r => r.ok ? r.json() : r.text().then(t => Promise.reject('UI Bridge failed, HTTP ' + r.status + ': ' + t.slice(0, 300))))
  .then(j => j.frontdoor_uri && j.frontdoor_uri.startsWith('https://') ? (globalThis.__fd = j.frontdoor_uri, go(j.frontdoor_uri)) : Promise.reject('No valid frontdoor URL returned'))
  .catch(e => fail(e.message || e));