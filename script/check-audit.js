// Checks `npm audit --omit=dev --json` output against an advisory allowlist.
//
// Usage: node script/check-audit.js <audit.json> <audit-allowlist.json>
//
// Fails when any finding is high or critical, or when a package is reported
// for an advisory that is not in the allowlist. Packages that are only flagged
// through another vulnerable package (no advisory of their own) pass when
// that package passes, because it is checked on its own entry.

const fs = require('fs');

const [auditPath, allowlistPath] = process.argv.slice(2);
if (!auditPath || !allowlistPath) {
  console.error('usage: node script/check-audit.js <audit.json> <audit-allowlist.json>');
  process.exit(2);
}

let audit;
try {
  audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
} catch (e) {
  console.log(`could not parse npm audit output: ${e.message}`);
  process.exit(1);
}
if (audit.error) {
  console.log(`npm audit failed: ${audit.error.summary || audit.message || JSON.stringify(audit.error)}`);
  process.exit(1);
}

const allowlist = JSON.parse(fs.readFileSync(allowlistPath, 'utf8')).advisories;
const advisoryId = (via) => (via.url || '').split('/').pop() || String(via.source);

const problems = [];
const reported = new Set();
const vulnerabilities = audit.vulnerabilities || {};

for (const [name, vulnerability] of Object.entries(vulnerabilities)) {
  const advisories = vulnerability.via.filter((via) => typeof via === 'object').map(advisoryId);
  const through = vulnerability.via.filter((via) => typeof via === 'string');
  advisories.forEach((id) => reported.add(id));

  const unlisted = advisories.filter((id) => !allowlist[id]);
  const label = [
    advisories.length ? advisories.join(', ') : null,
    through.length ? `via ${through.join(', ')}` : null,
  ].filter(Boolean).join('; ');
  console.log(`${vulnerability.severity.padEnd(8)} ${name}  ${label}`);

  if (vulnerability.severity === 'high' || vulnerability.severity === 'critical') {
    problems.push(`${name} is ${vulnerability.severity}`);
  }
  if (unlisted.length) {
    problems.push(`${name} has advisories not in the allowlist: ${unlisted.join(', ')}`);
  }
}

for (const id of Object.keys(allowlist)) {
  if (!reported.has(id)) {
    console.log(`note: allowlisted ${id} (${allowlist[id].package}) is no longer reported; consider removing it`);
  }
}

const counts = (audit.metadata && audit.metadata.vulnerabilities) || {};
const summary = `${counts.total || 0} findings (low ${counts.low || 0}, moderate ${counts.moderate || 0}, ` +
  `high ${counts.high || 0}, critical ${counts.critical || 0})`;

if (problems.length) {
  problems.forEach((problem) => console.log(`problem: ${problem}`));
  console.log(`${summary}; ${problems.length} problem(s)`);
  process.exit(1);
}
console.log(`${summary}; all allowlisted`);
