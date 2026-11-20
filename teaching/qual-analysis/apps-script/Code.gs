/**
 * Qualitative Coding Workbook — back end (Google Apps Script web app).
 *
 * Secrets are NOT stored in this file (the repo is public). Set them in the
 * Apps Script editor: Project Settings (gear icon) → Script properties:
 *
 *   INSTRUCTOR_CODE   the instructor code (use something longer than 4 digits)
 *   UNLOCK_CODE_2     the in-class code that unlocks Script 2
 *   SHEET_ID          (only if the script is not bound to the spreadsheet)
 *   SHEET_TAB         (optional) tab name; defaults to the first tab
 *
 * Deploy: Deploy → Manage deployments → edit the existing web-app deployment →
 * Version: "New version" → Deploy. Keeping the same deployment keeps the same
 * /exec URL, so the page does not need to change.
 *
 * Requests (all POST, body = JSON text):
 *   {action:'verify', password}            → "true" | "false"  (instructor login)
 *   {action:'unlock', scriptId, password}  → "true" | "false"  (Script 2 gate)
 *   {action:'record', name, scriptId, data}→ {ok:true}          (student submission)
 *   {action:'list',  password}             → {ok:true, rows}    (instructor only)
 *   {action:'clear', password}             → {ok:true}          (instructor only)
 * GET returns nothing: submissions are only available through 'list'.
 */

const MAX_FAILS = 10;            // wrong instructor codes allowed…
const FAIL_WINDOW_SEC = 15 * 60; // …within this window before lockout
const MAX_NAME_LEN = 120;
const MAX_DATA_LEN = 45000;      // a Sheets cell holds at most 50,000 characters

function doGet() {
  return json_({ ok: false, error: 'Not available' });
}

function doPost(e) {
  try {
    return handle_(e);
  } catch (err) {
    return json_({ ok: false, error: 'Server error: ' + err });
  }
}

function handle_(e) {
  let body;
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return json_({ ok: false, error: 'Bad request' });
  }

  switch (body.action) {
    case 'verify': {
      const r = checkInstructor_(body.password);
      if (r === 'locked') return json_({ ok: false, error: lockedMessage_() });
      return text_(r ? 'true' : 'false');
    }

    case 'unlock': {
      const expected = prop_('UNLOCK_CODE_' + Number(body.scriptId));
      const given = String(body.password || '').trim().toUpperCase();
      const ok = !!expected && given === expected.trim().toUpperCase();
      if (!ok) Utilities.sleep(800);
      return text_(ok ? 'true' : 'false');
    }

    case 'record': {
      const name = String(body.name || '').trim();
      const scriptId = Number(body.scriptId);
      const data = String(body.data || '');
      if (!name || name.length > MAX_NAME_LEN) return json_({ ok: false, error: 'Invalid name' });
      if (!(scriptId >= 1 && scriptId <= 10)) return json_({ ok: false, error: 'Invalid script' });
      if (!data || data.length > MAX_DATA_LEN) return json_({ ok: false, error: 'Submission too large' });
      try { JSON.parse(data); } catch (err) { return json_({ ok: false, error: 'Invalid data' }); }

      const lock = LockService.getScriptLock();
      lock.waitLock(10000);
      try {
        sheet_().appendRow([new Date(), noFormula_(name), 'Script ' + scriptId, noFormula_(data)]);
      } finally {
        lock.releaseLock();
      }
      return json_({ ok: true });
    }

    case 'list': {
      const r = checkInstructor_(body.password);
      if (r === 'locked') return json_({ ok: false, error: lockedMessage_() });
      if (!r) return json_({ ok: false, error: 'Not authorised' });
      const rows = sheet_().getDataRange().getValues().map(row =>
        row.map(cell => (cell instanceof Date) ? cell.toLocaleString() : String(cell)));
      return json_({ ok: true, rows: rows });
    }

    case 'clear': {
      const r = checkInstructor_(body.password);
      if (r === 'locked') return json_({ ok: false, error: lockedMessage_() });
      if (!r) return json_({ ok: false, error: 'Not authorised' });
      const sh = sheet_();
      const last = sh.getLastRow();
      if (last > 1) sh.deleteRows(2, last - 1);   // keep the header row
      return json_({ ok: true });
    }

    default:
      return json_({ ok: false, error: 'Unknown action' });
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** true | false | 'locked'. Counts failures and locks out after MAX_FAILS. */
function checkInstructor_(password) {
  const cache = CacheService.getScriptCache();
  const fails = Number(cache.get('instructor_fails') || 0);
  if (fails >= MAX_FAILS) return 'locked';

  const expected = prop_('INSTRUCTOR_CODE');
  const ok = !!expected && String(password || '') === expected;
  if (!ok) {
    cache.put('instructor_fails', String(fails + 1), FAIL_WINDOW_SEC);
    Utilities.sleep(1000);   // slow down guessing
  }
  return ok;
}

function lockedMessage_() {
  return 'Too many incorrect attempts — instructor access is locked for up to ' + (FAIL_WINDOW_SEC / 60) + ' minutes.';
}

function prop_(key) {
  return PropertiesService.getScriptProperties().getProperty(key) || '';
}

/** The submissions sheet: SHEET_ID property if set, otherwise the bound spreadsheet. */
function sheet_() {
  const id = prop_('SHEET_ID');
  const ss = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
  const tab = prop_('SHEET_TAB');
  return (tab && ss.getSheetByName(tab)) || ss.getSheets()[0];
}

/** Stop text such as "=IMPORTXML(...)" being stored as a live formula. */
function noFormula_(s) {
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function text_(s) {
  return ContentService.createTextOutput(s).setMimeType(ContentService.MimeType.TEXT);
}
