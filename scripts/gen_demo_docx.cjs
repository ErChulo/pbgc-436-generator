const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('436-generator.html','utf-8');
const m = html.match(/<script>([\s\S]*)<\/script>/);
const sandbox = { console, TextEncoder, Blob: class {}, URL: { createObjectURL: ()=>'', revokeObjectURL: ()=>{} }, File: class {}, setTimeout, document: undefined };
vm.createContext(sandbox);
vm.runInContext(m[1], sandbox);
const A36 = sandbox.A36;
const periods = A36.buildPeriods(JSON.parse(JSON.stringify(A36.DEMO_HISTORY)), '01-01', '2013-06-30', null).periods;
const data = {
  caseData: JSON.parse(JSON.stringify(A36.DEMO_CASE)),
  history: JSON.parse(JSON.stringify(A36.DEMO_HISTORY)),
  periods,
  answers: JSON.parse(JSON.stringify(A36.DEMO_ANSWERS)),
  draft: A36.draftPart4(A36.DEMO_ANSWERS, periods, {}),
  cba: JSON.parse(JSON.stringify(A36.DEMO_CBA)),
};
const bytes = A36.buildDocxBytes(data);
fs.writeFileSync(require('path').join(__dirname, '..', '11223344436-demo.docx'), Buffer.from(bytes));
console.log('wrote 11223344436-demo.docx', bytes.length, 'bytes');
