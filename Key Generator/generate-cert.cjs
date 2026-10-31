const forge = require("node-forge");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const pki = forge.pki;

function main() {
  const tenant = process.argv[2];
  if (!tenant) {
    console.error("Usage: node generate-cert.js <tenant-name>");
    process.exit(1);
  }

  const days = parseInt(process.argv[3], 10) || 365;

  console.log(`\nGenerating 2048-bit RSA key pair for tenant: ${tenant}...`);
  const keys = pki.rsa.generateKeyPair(2048);

  // Create self-signed certificate
  const cert = pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = Date.now().toString(16);
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setDate(cert.validity.notBefore.getDate() + days);

  const attrs = [
    { name: "commonName", value: tenant },
    { name: "organizationName", value: tenant },
  ];
  cert.setSubject(attrs);
  cert.setIssuer(attrs);

  cert.setExtensions([
    { name: "basicConstraints", cA: false },
    {
      name: "keyUsage",
      digitalSignature: true,
      keyEncipherment: true,
    },
    {
      name: "subjectAltName",
      altNames: [{ type: 2, value: tenant }],
    },
  ]);

  // Self-sign the certificate
  cert.sign(keys.privateKey, forge.md.sha256.create());

  // Export private key as unencrypted PKCS#8 PEM (matches OpenSSL output)
  const pkcs1Pem = pki.privateKeyToPem(keys.privateKey);
  const keyPem = crypto.createPrivateKey(pkcs1Pem).export({
    type: "pkcs8",
    format: "pem",
  });

  // Export certificate as PEM
  const certPem = pki.certificateToPem(cert);

  const outputDir = path.join(__dirname, "output", tenant);
  fs.mkdirSync(outputDir, { recursive: true });

  const keyPath = path.join(outputDir, `${tenant}.key`);
  const certPath = path.join(outputDir, `${tenant}.crt`);

  fs.writeFileSync(keyPath, keyPem, { mode: 0o600 });
  fs.writeFileSync(certPath, certPem);

  console.log(`\nFiles generated in: ${outputDir}`);
  console.log(`  Private key (unencrypted): ${tenant}.key`);
  console.log(`  Certificate (valid ${days} days):  ${tenant}.crt`);
}

try {
  main();
} catch (err) {
  console.error("Error:", err.message);
  process.exit(1);
}
 