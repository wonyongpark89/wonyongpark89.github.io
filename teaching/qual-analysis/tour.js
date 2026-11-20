/* A first-entry walkthrough of the real interface. No workbook data is changed. */
(() => {
    const byId = id => document.getElementById(id);
    const replay = byId('tour-start-btn');
    const spotlight = document.createElement('div');
    spotlight.className = 'tour-spotlight';
    spotlight.hidden = true;
    spotlight.setAttribute('aria-hidden', 'true');
    const dialog = document.createElement('dialog');
    dialog.id = 'interface-tour';
    dialog.className = 'tour-panel';
    dialog.setAttribute('aria-labelledby', 'tour-title');
    dialog.setAttribute('aria-describedby', 'tour-description');
    dialog.innerHTML = `<div class="tour-copy" aria-live="polite" aria-atomic="true"><h2 id="tour-title"></h2><p id="tour-description"></p></div>
        <p class="tour-progress" id="tour-progress"></p>
        <div class="tour-actions"><button class="tour-skip" id="tour-skip-btn" type="button">Skip tour</button><div><button class="btn" id="tour-back-btn" type="button">Back</button><button class="btn primary-btn" id="tour-next-btn" type="button">Next</button></div></div>`;
    document.body.append(spotlight, dialog);

    const seenThisSession = new Set();
    let index = 0;
    let steps = [];
    let automatic = false;
    let focusBefore = null;
    let scrollBefore = { x: 0, y: 0 };
    let frame = 0;
    let resizeObserver = null;
    const visible = element => !!element && element.getClientRects().length > 0;
    const key = () => `qcw_interface_tour_v1:${byId('student-name').value.trim().toLowerCase()}`;
    const clamp = (value, min, max) => Math.max(min, Math.min(value, Math.max(min, max)));

    function hasSeenTour() {
        if (seenThisSession.has(key())) return true;
        try { return localStorage.getItem(key()) === 'seen'; } catch { return false; }
    }

    function availableSteps() {
        const coding = visible(byId('coding-bar'));
        const stageOne = visible(byId('main-layout'));
        const submission = stageOne ? byId('export-section') : visible(byId('s3-submit-bar')) ? byId('s3-submit-bar') : byId('s4-submit-bar');
        return [
            { id: 'activities', target: document.querySelector('.activity-nav'), title: 'Choose an activity', description: 'Use the practice transcripts for your own analysis. Worked examples show completed analyses. Your tutor provides the class code for English Anxiety.' },
            { id: 'steps', target: byId('stage-tabs'), title: 'Follow the four steps', description: 'Code the transcript, develop categories, test them against the data, then develop a theme. The current step and the next action are shown here.' },
            { id: 'workspace', target: stageOne ? byId('t1') : document.querySelector('.sw-main:not(.hidden)'), title: stageOne ? 'Read the transcript closely' : 'Work with your data', description: stageOne ? 'Select a meaningful passage to code. Open the reference above the transcript whenever you need a definition.' : 'This area holds the task for your current analysis step. Use the definitions and instructions to guide your work.' },
            { id: 'coding', target: byId('coding-bar'), title: 'Give the extract a code', description: 'After selecting text, enter a short label here. Press Enter or Apply code to attach it to the passage.', include: coding },
            { id: 'codebook', target: byId('codes-panel'), title: 'Build your codebook', description: 'Your codes and extracts collect here. Use the remove button beside a code to delete it. Your progress is saved on this device.' },
            { id: 'submission', target: submission, title: 'Submit and move on', description: stageOne ? 'Submit your coding when you are ready to unlock categories. Later, submit your tested categories before developing a theme.' : 'Submit this step when you are ready. You can resubmit after making changes, and save a copy of your final analysis.' }
        ].filter(step => step.include !== false && visible(step.target));
    }

    function position() {
        frame = 0;
        if (!dialog.open) return;
        const target = steps[index]?.target;
        if (!visible(target)) { render(); return; }
        const width = window.innerWidth;
        const height = window.visualViewport?.height || window.innerHeight;
        const edge = 12, gap = 14;
        const raw = target.getBoundingClientRect();
        const rect = { left: clamp(raw.left - 5, 4, width - 4), right: clamp(raw.right + 5, 4, width - 4), top: clamp(raw.top - 5, 4, height - 4), bottom: clamp(raw.bottom + 5, 4, height - 4) };
        Object.assign(spotlight.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${Math.max(1, rect.right - rect.left)}px`, height: `${Math.max(1, rect.bottom - rect.top)}px` });

        const rightSpace = width - rect.right - gap - edge;
        const leftSpace = rect.left - gap - edge;
        const side = rightSpace >= 280 ? 'right' : leftSpace >= 280 ? 'left' : null;
        const panelWidth = Math.min(336, side === 'right' ? rightSpace : side === 'left' ? leftSpace : width - edge * 2);
        dialog.style.width = `${panelWidth}px`;
        dialog.style.maxHeight = `${height - edge * 2}px`;
        const panelHeight = dialog.getBoundingClientRect().height;
        let left, top;
        if (side) {
            left = side === 'right' ? rect.right + gap : rect.left - gap - panelWidth;
            top = clamp((rect.top + rect.bottom - panelHeight) / 2, edge, height - panelHeight - edge);
        } else {
            left = clamp((rect.left + rect.right - panelWidth) / 2, edge, width - panelWidth - edge);
            top = height - rect.bottom - gap - edge >= panelHeight ? rect.bottom + gap
                : rect.top - gap - edge >= panelHeight ? rect.top - gap - panelHeight
                : height - panelHeight - edge;
        }
        dialog.style.left = `${left}px`;
        dialog.style.top = `${Math.max(edge, top)}px`;
    }

    function schedulePosition() {
        if (dialog.open && !frame) frame = requestAnimationFrame(position);
    }

    function render() {
        const previousId = steps[index]?.id;
        steps = availableSteps();
        if (!steps.length) { close(false); return; }
        const matched = steps.findIndex(step => step.id === previousId);
        index = matched >= 0 ? matched : Math.min(index, steps.length - 1);
        const step = steps[index];
        byId('tour-title').textContent = step.title;
        byId('tour-description').textContent = step.description;
        byId('tour-progress').textContent = `Step ${index + 1} of ${steps.length}`;
        byId('tour-back-btn').disabled = index === 0;
        const last = index === steps.length - 1;
        byId('tour-next-btn').textContent = last ? automatic && currentStage === 1 && currentScript <= 2 ? 'Start coding' : 'Finish tour' : 'Next';
        dialog.dataset.step = step.id;
        resizeObserver?.disconnect();
        if (resizeObserver) resizeObserver.observe(step.target);
        const rect = step.target.getBoundingClientRect();
        const height = window.visualViewport?.height || window.innerHeight;
        if (rect.top < 8 || rect.bottom > height - 8) step.target.scrollIntoView({ block: rect.height > height - 32 ? 'start' : 'center', behavior: 'auto' });
        position();
        schedulePosition();
    }

    function start(isAutomatic = false) {
        if (dialog.open || currentMode !== 'student' || getComputedStyle(byId('landing-modal')).display !== 'none') return;
        steps = availableSteps();
        if (!steps.length) return;
        automatic = isAutomatic;
        index = 0;
        focusBefore = document.activeElement;
        scrollBefore = { x: window.scrollX, y: window.scrollY };
        spotlight.hidden = false;
        dialog.show(); // Non-modal: students may still explore the highlighted controls.
        window.scrollTo(scrollBefore.x, scrollBefore.y);
        render();
        byId('tour-next-btn').focus({ preventScroll: true });
    }

    function close(remember = true, completed = false) {
        if (!dialog.open) return;
        dialog.close();
        spotlight.hidden = true;
        resizeObserver?.disconnect();
        cancelAnimationFrame(frame);
        frame = 0;
        if (remember) {
            seenThisSession.add(key());
            try { localStorage.setItem(key(), 'seen'); } catch { /* The tour still works without storage. */ }
        }
        if (completed && automatic) {
            const workspace = visible(byId('t1')) ? byId('t1') : document.querySelector('.sw-main:not(.hidden)');
            if (workspace) {
                workspace.tabIndex = -1;
                workspace.focus({ preventScroll: true });
                workspace.scrollIntoView({ block: 'start', behavior: 'auto' });
            }
        } else {
            if (focusBefore?.isConnected) focusBefore.focus({ preventScroll: true });
            window.scrollTo(scrollBefore.x, scrollBefore.y);
        }
    }

    function next() {
        if (index >= steps.length - 1) close(true, true);
        else { index++; render(); }
    }
    function back() { if (index > 0) { index--; render(); } }
    byId('tour-next-btn').addEventListener('click', next);
    byId('tour-back-btn').addEventListener('click', back);
    byId('tour-skip-btn').addEventListener('click', () => close());
    replay.addEventListener('click', () => start());
    document.addEventListener('workbook:entered', () => {
        // Run after the entry observer and presentation refresh have settled.
        requestAnimationFrame(() => { if (!hasSeenTour()) start(true); });
    });
    document.addEventListener('keydown', event => {
        if (!dialog.open) return;
        if (event.key === 'Escape') { event.preventDefault(); close(); }
        else if (dialog.contains(document.activeElement) && event.key === 'ArrowRight') { event.preventDefault(); next(); }
        else if (dialog.contains(document.activeElement) && event.key === 'ArrowLeft') { event.preventDefault(); back(); }
    });
    document.addEventListener('click', event => {
        if (dialog.open && !dialog.contains(event.target) && event.target !== replay) schedulePosition();
    });
    window.addEventListener('resize', schedulePosition);
    window.addEventListener('scroll', schedulePosition, true);
    window.visualViewport?.addEventListener('resize', schedulePosition);
    if ('ResizeObserver' in window) resizeObserver = new ResizeObserver(schedulePosition);
    for (const id of ['pw-modal', 'script-unlock-modal']) {
        new MutationObserver(() => { if (dialog.open && visible(byId(id))) close(false); }).observe(byId(id), { attributes: true, attributeFilter: ['style'] });
    }
})();
