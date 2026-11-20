window.testCalls = [];
window.testAlerts = [];
window.testExports = [];
window.testFailNext = false;
window.alert = message => window.testAlerts.push(message);
window.confirm = () => true;
window.open = () => ({ document: { write: html => window.testExports.push(html), close() {} } });
window.fetch = async (url, options) => {
  const body = options?.body ? JSON.parse(options.body) : {};
  window.testCalls.push(body);
  if (window.testFailNext) { window.testFailNext = false; throw new Error('Offline fixture'); }
  const value = body.action === 'verify' || body.action === 'unlock' ? body.password === 'TEST' : { ok: true };
  return { ok: true, text: async () => JSON.stringify(value) };
};
for (const key of ['coded_script_1','coded_script_2','analysis_script_1','analysis_script_2','qcw_student_name','qcw_s2_unlocked']) localStorage.removeItem(key);
for (const name of ['workbook test', 'tour second student']) localStorage.removeItem(`qcw_interface_tour_v1:${name}`);
