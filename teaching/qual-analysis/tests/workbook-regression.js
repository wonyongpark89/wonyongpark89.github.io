(async () => {
  const checks = [];
  const check = (name, pass) => { checks.push({ name, pass: !!pass }); if (!pass) throw new Error(name); };
  const settle = () => new Promise(resolve => setTimeout(resolve, 80));
  const id = name => document.getElementById(name);
  try {
    beginSession();
    check('Empty name produces an error', id('landing-error').style.display === 'block');
    check('Tour waits until a name has been accepted', !id('interface-tour').open);
    id('landing-name').value = 'workbook test'; beginSession(); await settle();
    check('Name entry opens workbook and unlocks keyboard access', id('student-name').value === 'Workbook Test' && !id('workbook-app').inert);
    check('First entry automatically opens the six-step interface tour', id('interface-tour').open && id('tour-progress').textContent === 'Step 1 of 6');
    check('Tour leaves real workbook controls available', !id('workbook-app').inert && id('interface-tour').getAttribute('aria-modal') !== 'true');
    const tourRect = id('interface-tour').getBoundingClientRect();
    check('Tour panel fits the current viewport', tourRect.left >= 0 && tourRect.right <= innerWidth + 1 && tourRect.top >= 0 && tourRect.bottom <= innerHeight + 1);
    id('tour-next-btn').click(); check('Tour Next highlights the learning sequence', id('interface-tour').dataset.step === 'steps');
    id('tour-back-btn').click(); check('Tour Back returns to the activity choices', id('interface-tour').dataset.step === 'activities');
    id('tour-skip-btn').click(); check('Skip closes and remembers dismissal', !id('interface-tour').open && localStorage.getItem('qcw_interface_tour_v1:workbook test') === 'seen');
    document.dispatchEvent(new Event('workbook:entered')); await settle();
    check('Returning students are not shown the tour again', !id('interface-tour').open);
    id('tour-start-btn').click(); check('Interface tour button replays the walkthrough', id('interface-tour').open);
    document.dispatchEvent(new KeyboardEvent('keydown', {key:'Escape',bubbles:true})); check('Escape dismisses the tour', !id('interface-tour').open);
    id('student-name').value = 'Tour Second Student'; document.dispatchEvent(new Event('workbook:entered')); await settle();
    check('A different student receives their own first-entry tour', id('interface-tour').open);
    const workbookBeforeTour = JSON.stringify({script:currentScript,stage:currentStage,codes:myCodes,analysis:gatherAnalysisData()});
    for (let step = 0; step < 5; step++) id('tour-next-btn').click();
    check('Last tour step gives a clear Start coding action', id('tour-next-btn').textContent === 'Start coding');
    id('tour-next-btn').click();
    check('Completing the automatic tour focuses the workspace', !id('interface-tour').open && document.activeElement === id('t1'));
    check('The tour leaves coding and analysis data unchanged', JSON.stringify({script:currentScript,stage:currentStage,codes:myCodes,analysis:gatherAnalysisData()}) === workbookBeforeTour);
    id('student-name').value = 'Workbook Test';
    check('Future analysis steps start locked', id('stab-2').classList.contains('tab-locked'));
    switchStage(2); check('Stage gate prevents skipping submission', currentStage === 1);

    const plain = plainTextOf(1); const phrase = 'mostly at the beginning of a task rather than the end';
    const start = plain.indexOf(phrase);
    check('Transcript text offsets remain available', start >= 0);
    pendingSelection = { start, end:start + phrase.length, text:phrase };
    id('code-input').value = 'AI as a starting point'; applyManualCode(); await settle();
    check('Applying a code preserves exact selected extract', myCodes.length === 1 && myCodes[0].text === phrase && id('t1').querySelector('.highlighted'));
    check('Codebook and count update', id('code-count').textContent === '1' && id('code-list').textContent.includes('AI as a starting point'));
    check('Coding persists in the existing storage key', JSON.parse(localStorage.getItem('coded_script_1')).length === 1);
    loadScript(1); await settle();
    check('Saved coding restores after switching activity', myCodes.length === 1 && myCodes[0].start === start);
    window.testFailNext = true; submitCoding(); await settle();
    check('Failed submissions keep stage 2 locked and show recovery', !s1Submitted && id('submit-coding-status').textContent.includes('Not submitted'));
    submitCoding(); await settle();
    check('Confirmed coding submission unlocks categories', s1Submitted && !id('stab-2').classList.contains('tab-locked'));
    check('Submission contract retains coding payload', JSON.parse(window.testCalls.at(-1).data).codes[0].text === phrase);
    switchStage(2); addCluster();
    const cluster = document.querySelector('.cluster-card');
    cluster.querySelector('.cluster-name-input').value = 'Study strategies';
    cluster.querySelector('.cluster-category-input').value = 'Using AI to begin work';
    dropCardIntoZone(cluster.querySelector('.cluster-drop-zone'), 'AI as a starting point'); await settle();
    check('Codes move into categories and unlock testing', cluster.querySelector('.pool-card') && !id('stab-3').classList.contains('tab-locked'));
    check('Analysis categories persist', JSON.parse(localStorage.getItem('analysis_script_1')).categories[0].codeIds[0] === 'AI as a starting point');
    switchStage(3); await settle();
    check('Testing categories shows original coded extracts', id('s3-clusters-container').textContent.includes(phrase));
    const renamed = id('s3-clusters-container').querySelector('.s3-name-input'); renamed.value = 'Starting with support'; renamed.dispatchEvent(new Event('input'));
    check('Category refinement syncs back to developing categories', cluster.querySelector('.cluster-name-input').value === 'Starting with support');
    submitAnalysis(); await settle(); check('Confirmed category submission unlocks themes', s3Submitted && !id('stab-4').classList.contains('tab-locked'));
    switchStage(4); id('s4-pattern').value = 'AI offers an entry point without replacing the reading.'; id('s4-pattern').dispatchEvent(new Event('input')); submitTheme(); await settle();
    check('Theme submits through existing analysis contract', JSON.parse(window.testCalls.at(-1).data).pattern === id('s4-pattern').value);
    openStage4Export(); printTranscript();
    check('Analysis export and transcript print retain content', window.testExports.length === 2 && window.testExports[0].includes('Starting with support') && window.testExports[1].includes(phrase));
    loadScript(1); await settle();
    check('Categories, submission gates and theme survive restoration', s1Submitted && s3Submitted && document.querySelector('.cluster-card') && id('s4-pattern').value.includes('entry point'));
    check('Restored submissions reconcile step states and Next eligibility', !id('stab-4').classList.contains('tab-locked') && !id('stage-next-btn').disabled);
    const codeId = myCodes[0].id; removeCode(codeId); await settle(); check('Removing a code updates transcript and codebook', myCodes.length === 0 && !id('t1').querySelector('.teacher-label'));

    for (const sample of [3,4,5]) {
      loadScript(sample); await settle();
      check('Worked example ' + sample + ' restores predefined codes', id('t1').querySelector('.teacher-label') && id('coding-bar').classList.contains('hidden'));
      switchStage(2); check('Worked example ' + sample + ' shows categories', document.querySelectorAll('.cluster-card').length > 0);
      await settle(); check('Worked example ' + sample + ' explanations render as wrapped text', document.querySelector('.cluster-category-input').hidden && document.querySelectorAll('.sample-field-text').length >= 2);
      switchStage(3); check('Worked example ' + sample + ' shows extract testing', id('s3-clusters-container').querySelector('.s3-code-block'));
      switchStage(4); check('Worked example ' + sample + ' shows read-only theme', id('s4-pattern').readOnly && id('s4-pattern').value.length > 20);
      id('tour-start-btn').click(); await settle(); check('Worked example ' + sample + ' tour omits unavailable editing tools', id('interface-tour').open && id('tour-progress').textContent === 'Step 1 of 3'); id('tour-skip-btn').click();
    }

    loadScript(1); id('tour-start-btn').click(); requestScript2(); await settle();
    check('Exploring a class access control closes the tour for the real dialog', !id('interface-tour').open && id('script-unlock-modal').style.display === 'flex');
    id('script-unlock-input').value = 'BAD'; checkScriptUnlock(); await settle();
    check('Incorrect class access code keeps script locked', !script2Unlocked && id('script-unlock-error').style.display === 'block');
    id('script-unlock-input').value = 'TEST'; checkScriptUnlock(); await settle();
    check('Correct class access code opens second transcript', script2Unlocked && currentScript === 2);
    id('tour-start-btn').click(); setMode('teacher'); await settle(); check('Instructor dialog isolates keyboard focus', !id('interface-tour').open && id('workbook-app').inert && id('pw-modal').style.display === 'flex');
    id('pw-input').value = 'TEST'; await checkPassword(); await settle();
    check('Verified instructor opens review tools and hides coding bar', currentMode === 'teacher' && !id('teacher-tools').classList.contains('hidden') && id('coding-bar').classList.contains('hidden'));
    submissions = {
      one:{scriptId:2,label:'Fixture Student (Script 2)',dataType:'codes',data:[{id:'fixture',code:'Anxiety',text:'waiting for my turn',color:colorPalette[0],start:plainTextOf(2).indexOf('waiting for my turn'),end:plainTextOf(2).indexOf('waiting for my turn')+19}]},
      two:{scriptId:2,label:'Fixture Student (Script 2)',dataType:'analysis',data:{type:'analysis',categories:[{name:'Anticipation',codes:['Anxiety']}],pattern:'Anxiety changes participation.'}}
    };
    updateTeacherDropdowns(); id('sel-student-left').value = 'Fixture Student'; renderPane(1);
    check('Instructor review renders submitted coding', id('analysis-pane-1').textContent.includes('Anxiety'));
    setPaneStage(1,3); check('Instructor review renders categories and theme', id('analysis-pane-1').textContent.includes('Anticipation') && id('analysis-pane-1').textContent.includes('Anxiety changes'));
    toggleComparePane(); check('Instructor comparison opens second pane', !id('analysis-pane-2').classList.contains('hidden'));
    executeSetMode('student'); await settle(); check('Returning to student mode restores analysis steps', currentMode === 'student' && id('stage-tabs').classList.contains('visible'));
  } catch (error) { checks.push({name:error.stack,pass:false}); }
  const report = document.createElement('section'); report.id = 'test-results';
  report.style.cssText = 'position:fixed;inset:0;z-index:10000;background:white;padding:24px;overflow:auto;font:14px/1.7 system-ui;color:#172b20';
  const heading = document.createElement('h1'); heading.textContent = checks.filter(x=>x.pass).length + '/' + checks.length + ' workbook checks passed'; report.append(heading);
  const note = document.createElement('p'); note.textContent = 'All network calls were mocked. No test submissions reached the production service.'; report.append(note);
  const list = document.createElement('ol'); for (const item of checks) { const li = document.createElement('li'); li.textContent = (item.pass?'PASS — ':'FAIL — ') + item.name; list.append(li); } report.append(list); document.body.append(report);
  console.log(JSON.stringify({checks}));
})();
