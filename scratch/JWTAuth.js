globalThis.__fd = 'pending';
var U = process.argv.at(2);
var K = process.argv.at(3);
var H = process.argv.at(4);
var P = process.argv.at(5);
var R = process.argv.at(6) || '/lightning/o/Account/list';
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