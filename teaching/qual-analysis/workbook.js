/* Presentation and accessible wayfinding; analysis and persistence stay in index.html. */
(() => {
    const byId = id => document.getElementById(id);
    const setText = (el, text) => { if (el && el.textContent !== text) el.textContent = text; };
    const titles = { 1: 'AI in Education', 2: 'English Anxiety', 3: 'Versus Coding', 4: 'Emotion Coding', 5: 'In Vivo Coding' };
    const tasks = ['Code the transcript', 'Develop your categories', 'Test your categories', 'Develop a theme'];

    function refreshView() {
        const sample = currentScript > 2;
        const teacher = currentMode === 'teacher';
        byId('coding-bar').classList.toggle('hidden', teacher || sample || currentStage !== 1);
        syncCodingBarMargin();
        document.body.dataset.mode = currentMode;
        document.body.dataset.sample = String(sample);
        setText(byId('activity-title'), titles[currentScript]);
        setText(byId('activity-description'), teacher ? 'Instructor workspace' : sample ? 'Worked example · explore all four steps' : `Practice transcript ${currentScript}`);
        setText(byId('session-name'), byId('student-name').value);
        document.querySelector('.lesson-context').hidden = teacher;
        document.querySelector('.save-note').hidden = teacher || sample;
        setText(byId('lesson-task'), sample ? `${tasks[currentStage - 1]} · worked example` : tasks[currentStage - 1]);

        const hasCategory = [...document.querySelectorAll('.cluster-card')].some(el => el.querySelector('.pool-card'));
        // The original loader restores analysis after its first gate update.
        // Reconcile once so restored submission flags and route controls agree.
        const gateChanged = [2, 3, 4].some(n => {
            const locked = !sample && (n >= 2 && !s1Submitted || n >= 3 && !hasCategory || n >= 4 && !s3Submitted);
            return byId(`stab-${n}`).classList.contains('tab-locked') !== locked;
        });
        if (gateChanged) updateTabGates();
        const nextNote = sample
            ? 'Read the example, then use the steps above to follow how the analysis develops.'
            : currentStage === 1
                ? s1Submitted ? 'Coding submitted. Continue to developing categories when you are ready.' : 'Next: submit your coding to unlock developing categories.'
                : currentStage === 2
                    ? hasCategory ? 'Next: test your categories against the original extracts.' : 'Next: create a category and move at least one code into it.'
                    : currentStage === 3
                        ? s3Submitted ? 'Categories submitted. Continue to developing a theme.' : 'Next: submit your tested categories to unlock developing themes.'
                        : 'Write your theme, submit it, and save a copy of your analysis.';
        setText(byId('next-step-note'), nextNote);
        document.querySelectorAll('.btn-script').forEach((button, i) => button.setAttribute('aria-pressed', String(i + 1 === currentScript)));
        ['student', 'teacher'].forEach(mode => byId(`btn-${mode}-mode`).setAttribute('aria-pressed', String(mode === currentMode)));
        for (let n = 1; n <= 4; n++) {
            const button = byId(`stab-${n}`);
            const locked = button.classList.contains('tab-locked');
            button.setAttribute('aria-disabled', String(locked));
            if (n === currentStage) button.setAttribute('aria-current', 'step');
            else button.removeAttribute('aria-current');
            setText(button.querySelector('.step-state'), n === currentStage ? 'Current step' : locked ? 'Locked' : 'Available');
        }
        setText(byId('code-count'), String((sample ? sampleData[currentScript] : myCodes).length));
        byId('apply-btn').disabled = !pendingSelection || !byId('code-input').value.trim();
        setText(byId('selection-note'), pendingSelection ? `“${pendingSelection.text.trim()}”` : 'Select a passage in the transcript to begin.');

        // Keep definitions available without displacing the passage students are reading.
        const instructions = byId('student-instructions');
        const definition = instructions.querySelector(':scope > .definition-box');
        if (definition) {
            const details = document.createElement('details');
            details.className = 'definition-reference';
            const summary = document.createElement('summary');
            const term = definition.querySelector('.def-label').textContent.replace('Definition — ', '').toLowerCase();
            summary.textContent = `Reference: What is a ${term}?`;
            definition.before(details);
            details.append(summary, definition);
        }
        const empty = byId('code-list').querySelector(':scope > p');
        if (empty) setText(empty, 'Your codebook starts with a passage. Select some transcript text, then give it a short label below.');
        if (sample) {
            document.querySelectorAll('#clusters-wrap .cluster-name-input[readonly], #clusters-wrap .cluster-category-input[readonly]').forEach(input => {
                let text = input.nextElementSibling;
                if (!text || !text.classList.contains('sample-field-text')) {
                    text = document.createElement('p');
                    text.className = 'sample-field-text';
                    if (input.classList.contains('cluster-name-input')) text.classList.add('sample-category-title');
                    input.after(text);
                }
                input.hidden = true;
                setText(text, input.value);
            });
        }
        enhanceControls();
    }

    function enhanceControls() {
        document.querySelectorAll('[data-remove-id]').forEach(el => {
            if (el.dataset.keyboardReady) return;
            el.dataset.keyboardReady = 'true';
            el.tabIndex = 0;
            el.setAttribute('role', 'button');
            el.setAttribute('aria-label', 'Remove this code');
            el.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); el.click(); }
            });
        });
        const names = { '.cluster-name-input': 'Category name', '.cluster-category-input': 'What holds these codes together?', '.s3-name-input': 'Category name' };
        for (const [selector, label] of Object.entries(names)) document.querySelectorAll(selector).forEach(input => input.setAttribute('aria-label', label));
        byId('s4-pattern').setAttribute('aria-label', 'Your theme');
    }

    let scheduled = false;
    function scheduleRefresh() {
        if (scheduled) return;
        scheduled = true;
        queueMicrotask(() => { scheduled = false; refreshView(); });
    }
    document.addEventListener('click', scheduleRefresh);
    document.addEventListener('input', scheduleRefresh);
    document.addEventListener('change', scheduleRefresh);
    new MutationObserver(scheduleRefresh).observe(byId('stage-tabs'), { subtree: true, attributes: true, attributeFilter: ['class'] });
    for (const id of ['code-list', 't1', 'clusters-wrap', 's3-clusters-container']) {
        new MutationObserver(scheduleRefresh).observe(byId(id), { childList: true });
    }
    for (const id of ['submit-coding-status', 'submit-analysis-status', 'submit-theme-status']) {
        byId(id).setAttribute('role', 'status');
        new MutationObserver(scheduleRefresh).observe(byId(id), { childList: true });
    }

    // Keep keyboard focus inside the name/access dialog, then restore its trigger.
    const dialogs = [byId('landing-modal'), byId('pw-modal'), byId('script-unlock-modal')];
    let activeDialog = null;
    let returnFocus = null;
    function syncDialogs() {
        const next = dialogs.find(dialog => getComputedStyle(dialog).display !== 'none') || null;
        if (next === activeDialog) return;
        const wasDialog = activeDialog;
        if (next && !activeDialog) returnFocus = document.activeElement;
        activeDialog = next;
        byId('workbook-app').inert = !!next;
        dialogs.forEach(dialog => { dialog.inert = dialog !== next; });
        if (!next && wasDialog) {
            if (wasDialog.id === 'landing-modal') {
                byId('btn-s1').focus();
                document.dispatchEvent(new Event('workbook:entered'));
            }
            else if (returnFocus && !returnFocus.closest('[role="dialog"]')) returnFocus.focus();
            returnFocus = null;
        }
        scheduleRefresh();
    }
    dialogs.forEach(dialog => new MutationObserver(syncDialogs).observe(dialog, { attributes: true, attributeFilter: ['style'] }));
    document.addEventListener('keydown', event => {
        if (!activeDialog) return;
        if (event.key === 'Escape') {
            if (activeDialog.id === 'pw-modal') closePwModal();
            if (activeDialog.id === 'script-unlock-modal') closeScriptUnlockModal();
        }
        if (event.key !== 'Tab') return;
        const focusable = [...activeDialog.querySelectorAll('input, button, a[href], [tabindex="0"]')].filter(el => !el.disabled && el.getClientRects().length);
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    byId('pw-input').setAttribute('aria-label', 'Instructor security code');
    byId('select-left').setAttribute('aria-label', 'Left transcript submission');
    byId('select-right').setAttribute('aria-label', 'Right transcript submission');
    byId('sel-student-left').setAttribute('aria-label', 'Student for left review panel');
    byId('sel-student-right').setAttribute('aria-label', 'Student for right review panel');
    const gateObserver = new MutationObserver(mutations => {
        for (const mutation of mutations) for (const node of mutation.addedNodes) {
            if (node.id === 'gate-msg') node.setAttribute('role', 'status');
        }
    });
    gateObserver.observe(document.body, { childList: true });
    syncDialogs();
    refreshView();
})();
