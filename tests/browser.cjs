// Browser test: loads 436-generator.html in jsdom and drives it like a user.
// Part 1 — opaque origin (a file: URL): every storage access must go
// through a36SafeStorage(); this proves the app survives a blocked
// localStorage and the demo button works.
// Part 2 — theme toggle: the toggle flips data-theme on the root, the
// dark page background is #000, the header stays brand blue, and the one
// white (wt) PBGC logo sits in the blue header in both themes.
// Part 3 — HeaderNav: skip link first, nav links (not buttons) with
// aria-current, hash links + hashchange, disclosure menu with Escape
// and focus return.
// Part 4 — Welcome and Help are their own pages: 3 nav links, the
// landing page shows only the 436 workflow, Try the demo from the
// Welcome page loads the demo and switches to the 436 view.
// Part 5 — the AFTAP grid: demo loads 4 rows, Add row adds one,
// Step 3 shows the Part 1 questions, Step 4 shows the 15-period table.
//
// All DOMs are created first, then the checks run inside one setTimeout
// so each app's DOMContentLoaded init has fired (jsdom fires it async
// after construction).
'use strict';
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

let failures = 0;
function check(name, ok, extra) {
  console.log((ok ? '  ok  ' : 'FAIL  ') + name + (extra !== undefined ? ' — ' + extra : ''));
  if (!ok) failures++;
}

const html = fs.readFileSync(path.join(__dirname, '..', '436-generator.html'), 'utf8');
const ALT = 'PBGC';

function makeDom(url, beforeParse) {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(String(e && e.message || e)));
  vc.on('error', (...a) => errors.push(a.join(' ')));
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    url,
    virtualConsole: vc,
    pretendToBeVisual: true,
    beforeParse
  });
  return { dom, errors };
}

function cssRule(document, selector) {
  for (const sheet of document.styleSheets) {
    for (const r of sheet.cssRules) {
      if (r.selectorText === selector) return r;
    }
  }
  return null;
}

function done() {
  console.log(failures === 0 ? '\nBrowser tests passed' : '\nBrowser tests FAILED: ' + failures);
  process.exit(failures === 0 ? 0 : 1);
}

// Create all DOMs first.
const opaque = makeDom('file:///436-generator.html');
const stored = makeDom('http://localhost/', (window) => {
  window.localStorage.setItem('a36-theme', 'dark');
});
const nav = makeDom('http://localhost/#welcome');
const imp = makeDom('http://localhost/');
const grid = makeDom('http://localhost/');

setTimeout(() => {
  try {
    // ---- Parts 1 + 2: opaque origin (file: URL, localStorage throws) ----
    const odoc = opaque.dom.window.document;
    check('opaque origin: no script errors', opaque.errors.length === 0, opaque.errors.join('; '));
    check('opaque origin: app mounts (step 1 visible)', !odoc.getElementById('step-1').hidden);
    check('opaque origin: logo alt is PBGC', odoc.getElementById('pbgc-logo').getAttribute('alt') === ALT);
    check('opaque origin: logo src is a data URI', (odoc.getElementById('pbgc-logo').getAttribute('src') || '').indexOf('data:image/png;base64,') === 0);
    check('opaque origin: theme toggle exists', !!odoc.getElementById('theme-toggle'));

    // Theme toggle on the opaque origin (storage blocked — must not throw).
    const toggle = odoc.getElementById('theme-toggle');
    toggle.click();
    check('theme toggle: flips to dark', odoc.documentElement.getAttribute('data-theme') === 'dark');
    toggle.click();
    check('theme toggle: flips back to light', odoc.documentElement.getAttribute('data-theme') === 'light');

    // Demo button on the opaque origin.
    odoc.getElementById('btn-demo').click();
    check('demo: switches to step 2', !odoc.getElementById('step-2').hidden);
    check('demo: case name filled', odoc.getElementById('f-plan-name').value === 'Summit Manufacturing Pension Plan');
    check('demo: case number filled', odoc.getElementById('f-case-number').value === '11223344');
    check('demo: grid has 4 rows', odoc.querySelectorAll('#aftap-grid-body tr').length === 4);
    check('grid: no detail row for certified rows', odoc.querySelectorAll('#aftap-grid-body tr.detail-row').length === 0);
    check('grid: every row has a kind select', odoc.querySelectorAll('#aftap-grid-body select[data-f="kind"]').length === 4);
    const kind0 = odoc.querySelector('#aftap-grid-body select[data-f="kind"]');
    check('grid: kind defaults to Certified', kind0.value === 'certified');
    check('grid: kind has 4 options', kind0.querySelectorAll('option').length === 4);

    // Add row.
    odoc.getElementById('btn-add-row').click();
    check('add row: grid has 5 rows', odoc.querySelectorAll('#aftap-grid-body tr').length === 5);

    // Step 3: Part 1 questions.
    odoc.getElementById('btn-to-step3').click();
    check('step 3: Part 1 card has 4 questions', odoc.querySelectorAll('#part1-card input[type="radio"]').length === 12);
    const dYes = odoc.querySelector('input[name="p1-d"][value="yes"]');
    check('step 3: demo answer (d) is Yes', !!dYes && dYes.checked);

    // Step 4: computed Part 3 table.
    odoc.getElementById('btn-to-step4').click();
    const rows4 = odoc.querySelectorAll('#part3-card table tbody tr');
    check('step 4: Part 3 table has 14 periods', rows4.length === 14, 'got ' + rows4.length);
    check('step 4: first row is N/A 2008', rows4.length > 0 && rows4[0].textContent.indexOf('N/A') >= 0 && rows4[0].textContent.indexOf('2008') >= 0);
    check('step 4: a <60% row exists', odoc.getElementById('part3-card').textContent.indexOf('< 60%') >= 0);

    // Step 5: review draft.
    odoc.getElementById('btn-to-step5').click();
    check('step 5: draft textareas exist', odoc.querySelectorAll('#review-card textarea').length === 4);
    check('step 5: draft (d) mentions the cap', odoc.getElementById('draft-d').value.indexOf('50%') >= 0);

    // Step 6: download card.
    odoc.getElementById('btn-to-step6').click();
    check('step 6: filename is case + 436', odoc.getElementById('download-card').textContent.indexOf('11223344436.docx') >= 0);

    // ---- Part 3: storage works (http: origin), seeded dark ----
    const sdoc = stored.dom.window.document;
    check('stored dark: loads dark', sdoc.documentElement.getAttribute('data-theme') === 'dark');
    check('stored dark: no script errors', stored.errors.length === 0, stored.errors.join('; '));
    sdoc.getElementById('theme-toggle').click();
    check('stored dark: toggle writes light back', stored.dom.window.localStorage.getItem('a36-theme') === 'light');

    // jsdom 27 does not resolve var() in computed background-color (it
    // returns transparent), so background colors are checked on the CSS
    // rules themselves, not on computed style.
    const darkBg = cssRule(sdoc, ':root[data-theme="dark"] body');
    check('dark theme: page background rule is #000', darkBg && (/#000000/.test(darkBg.cssText) || /rgb\(0, 0, 0\)/.test(darkBg.cssText)), darkBg ? darkBg.cssText : 'no rule');
    const topbar = cssRule(sdoc, '.topbar');
    check('header: stays brand blue', topbar && /var\(--blue\)/.test(topbar.cssText), topbar ? topbar.cssText : 'no rule');

    // ---- Part 4: nav + Welcome/Help pages ----
    const ndoc = nav.dom.window.document;
    check('nav: 3 links', ndoc.querySelectorAll('.nav-link').length === 3);
    check('nav: Welcome page shows on #welcome', !ndoc.getElementById('view-welcome').hidden);
    check('nav: 436 page hidden on #welcome', ndoc.getElementById('view-436').hidden);
    check('nav: skip link is first', ndoc.querySelector('.skip-link') !== null);
    ndoc.querySelector('[data-view="436"]').click();
    check('nav: clicking 436 shows the generator', !ndoc.getElementById('view-436').hidden);
    ndoc.querySelector('[data-view="welcome"]').click();
    ndoc.getElementById('btn-welcome-demo').click();
    check('welcome demo: loads demo and switches to 436', !ndoc.getElementById('view-436').hidden && ndoc.getElementById('f-plan-name').value === 'Summit Manufacturing Pension Plan');

    // Menu toggle.
    const menuBtn = ndoc.getElementById('menu-toggle');
    menuBtn.click();
    check('menu: opens', ndoc.getElementById('views').classList.contains('open'));
    check('menu: aria-expanded true', menuBtn.getAttribute('aria-expanded') === 'true');

    // ---- Part 5: LLM JSON import ----
    const idoc = imp.dom.window.document;
    check('import: no script errors', imp.errors.length === 0, imp.errors.join('; '));
    check('import: prompt download button exists', !!idoc.getElementById('btn-download-prompt'));
    idoc.getElementById('btn-demo').click();
    const goodJson = JSON.stringify({
      version: '0.2.0',
      caseData: { planName: 'Imported Plan', caseNumber: '99887766', dopt: '2014-06-30' },
      history: [{ planYear: 2012, aftap: 90, certDate: '2012-03-01', source: 'Certification', kind: 'certified' }],
      answers: { b: 'no', c: 'no', d: 'no', e: 'no' },
      cba: {}
    });
    idoc.getElementById('import-json').value = goodJson;
    idoc.getElementById('btn-validate-import').click();
    check('import: valid JSON shows Valid', idoc.getElementById('import-result').textContent.indexOf('Valid.') >= 0);
    check('import: Load button appears', !idoc.getElementById('btn-load-import').hidden);
    idoc.getElementById('btn-load-import').click();
    check('import: case name loaded', idoc.getElementById('f-plan-name').value === 'Imported Plan');
    check('import: grid has 1 row', idoc.querySelectorAll('#aftap-grid-body tr').length === 1);
    check('import: back on step 1 for review', !idoc.getElementById('step-1').hidden);
    idoc.getElementById('import-json').value = '{bad json';
    idoc.getElementById('btn-validate-import').click();
    check('import: bad JSON shows an error', idoc.getElementById('import-result').textContent.indexOf('Not valid JSON') >= 0);
    check('import: Load button hidden on error', idoc.getElementById('btn-load-import').hidden);
    idoc.getElementById('import-json').value = JSON.stringify({
      caseData: { planName: 'X', caseNumber: '1', dopt: '2014-06-30' },
      history: [{ planYear: 2012, aftap: 90, certDate: '2012-03-01', source: 'Certification' }],
      answers: { b: 'no', c: 'no', d: 'maybe', e: 'no' }
    });
    idoc.getElementById('btn-validate-import').click();
    check('import: bad answer shows an error', idoc.getElementById('import-result').textContent.indexOf('answers.d') >= 0);
    check('import: nothing loaded on bad schema', idoc.getElementById('f-plan-name').value === 'Imported Plan');

    // ---- Part 5b: WRERA (e) in the Step 4 Limits column ----
    idoc.getElementById('import-json').value = JSON.stringify({
      version: '0.2.0',
      caseData: { planName: 'WRERA Plan', caseNumber: '55667788', dopt: '2009-12-31' },
      history: [
        { planYear: 2008, aftap: 72.5, certDate: '2008-02-01', source: 'Certification', kind: 'certified' },
        { planYear: 2009, aftap: 55, certDate: '2009-02-01', source: 'Certification', kind: 'certified' }
      ],
      answers: { b: 'no', c: 'no', d: 'no', e: 'no' },
      cba: {}
    });
    idoc.getElementById('btn-validate-import').click();
    idoc.getElementById('btn-load-import').click();
    check('WRERA: case loaded', idoc.getElementById('f-plan-name').value === 'WRERA Plan');
    idoc.getElementById('btn-to-step2').click();
    idoc.getElementById('btn-to-step3').click();
    idoc.getElementById('btn-to-step4').click();
    const wrows = Array.from(idoc.querySelectorAll('#part3-card table tbody tr'));
    const wrow55 = wrows.find((tr) => tr.textContent.indexOf('2009') >= 0 && tr.textContent.indexOf('55%') >= 0);
    check('WRERA: 2009 55% row exists in Step 4', !!wrow55);
    const wlimits = wrow55 ? wrow55.querySelectorAll('td')[5].textContent : '';
    check('WRERA: Limits cell lists b, c, d only', wlimits.indexOf('b, c, d') === 0 && wlimits.indexOf(', e') < 0);
    check('WRERA: Limits cell names the rule', wlimits.indexOf('WRERA') >= 0);

    // ---- Part 6: grid kind column, detail rows, paste ----
    const gdoc = grid.dom.window.document;
    const gmainRows = () => Array.from(gdoc.querySelectorAll('#aftap-grid-body tr')).filter((tr) => tr.querySelector('input[data-f="planYear"]'));
    check('grid DOM: no script errors', grid.errors.length === 0, grid.errors.join('; '));
    gdoc.getElementById('btn-demo').click();
    const gkind0 = gmainRows()[0].querySelector('select[data-f="kind"]');
    gkind0.value = 'range';
    gkind0.dispatchEvent(new grid.dom.window.Event('change', { bubbles: true }));
    check('grid: kind change sticks', gmainRows()[0].querySelector('select[data-f="kind"]').value === 'range');
    const gdetail = gdoc.querySelector('#aftap-grid-body tr.detail-row');
    check('grid: range row shows a detail row', !!gdetail);
    check('grid: range detail has specific AFTAP input', !!gdetail.querySelector('input[data-f="specificAftap"]'));
    check('grid: range detail has specific date input', !!gdetail.querySelector('input[data-f="specificCertDate"]'));
    gdoc.getElementById('btn-add-row').click();
    check('grid: add row makes 5 main rows', gmainRows().length === 5);
    const gkind5 = gmainRows()[4].querySelector('select[data-f="kind"]');
    gkind5.value = 'recertified';
    gkind5.dispatchEvent(new grid.dom.window.Event('change', { bubbles: true }));
    const gdetail5 = gdoc.querySelectorAll('#aftap-grid-body tr.detail-row')[1];
    check('grid: recertified row shows a detail row', !!gdetail5);
    check('grid: recert detail has prior AFTAP input', !!gdetail5.querySelector('input[data-f="priorAftap"]'));
    check('grid: recert detail has material select', !!gdetail5.querySelector('select[data-f="material"]'));
    const gmat = gdetail5.querySelector('select[data-f="material"]');
    gmat.value = 'yes';
    gmat.dispatchEvent(new grid.dom.window.Event('change', { bubbles: true }));
    check('grid: material change sticks', gdetail5.querySelector('select[data-f="material"]').value === 'yes');
    gdoc.getElementById('btn-add-row').click();
    const gpasteCell = gmainRows()[5].querySelector('input[data-f="planYear"]');
    const gpev = new grid.dom.window.Event('paste', { bubbles: true, cancelable: true });
    gpev.clipboardData = { getData: () => '2013\t95\t2013-02-01\tCertification\tRange\tIVS123' };
    gpasteCell.dispatchEvent(gpev);
    const grow6 = gmainRows()[5];
    check('paste 6 cols: kind is Range', grow6.querySelector('select[data-f="kind"]').value === 'range');
    check('paste 6 cols: IPS ref set', grow6.querySelector('input[data-f="ipsRef"]').value === 'IVS123');
    check('paste 6 cols: AFTAP set', grow6.querySelector('input[data-f="aftap"]').value === '95');
    done();
  } catch (e) { console.log('FAIL  browser checks threw: ' + e.message); failures++; done(); }
}, 100);
