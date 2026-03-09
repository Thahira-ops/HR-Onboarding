// ============================================================
//  SUPA ONBOARDING JS — UPDATED (Multi-Step Navigation)
//  Backend functions UNCHANGED — only UI/UX layer updated
// ============================================================

// ── CONFIG ──────────────────────────────────────────────────
const SUPABASE_URL = "https://cfnkqoyslcboavlzydzv.supabase.co";
const SUPABASE_KEY = "sb_publishable_9JtArlC99Ig6QiLn6OJCpg_wYGh0Qph";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ── GLOBAL STATE ─────────────────────────────────────────────
let educationDataArray  = [];
let experienceDataArray = [];
let skillsDataArray     = [];
let referencesDataArray = [];
let familyDataArray     = [];
let otherFamilyDataArray   = [];
let otherEducationDataArray = [];

let educationCount = 0;
let familyCount    = 0;
let skillCount     = 0;
let refCount       = 1;
let otherFamilyCount    = 0;
let otherEducationCount = 0;

// ── MULTI-STEP NAVIGATION (NEW) ─────────────────────────────
let currentStep = 1;
const totalSteps = 5;

function showStep(step) {
  // Hide all steps
  document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
  // Show current step
  const stepEl = document.getElementById(`step-${step}`);
  if (stepEl) stepEl.classList.add('active');

  // Update progress bar
  updateProgressBarForStep(step);

  // Update navigation buttons
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');

  if (step === 1) {
    prevBtn.style.display = 'none';
  } else {
    prevBtn.style.display = 'inline-block';
  }

  if (step === totalSteps) {
    nextBtn.style.display = 'none';
    submitBtn.style.display = 'inline-block';
  } else {
    nextBtn.style.display = 'inline-block';
    submitBtn.style.display = 'none';
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToStep(step) {
  if (step < 1 || step > totalSteps) return;
  currentStep = step;
  showStep(currentStep);
}

function nextStep() {
  if (!validateStep(currentStep)) {
    showToast('Please complete all required fields in this step before proceeding.', 'error');
    return;
  }
  if (currentStep < totalSteps) {
    currentStep++;
    showStep(currentStep);
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
  }
}

function validateStep(step) {
  switch (step) {
    case 1: return isSectionComplete('section-personal');
    case 2: return isSectionComplete('section-experience');
    case 3: return isSectionComplete('section-education');
    case 4: return isSectionComplete('section-family');
    case 5: {
      const langsOk = isSectionComplete('section-languages');
      const skillsOk = skillsDataArray.length > 0;
      const tn    = document.querySelector('[name="willing_tn"]')?.value;
      const pref  = document.querySelector('[name="preferred_place"]')?.value.trim();
      const camp  = document.querySelector('[name="stay_in_camp"]')?.value;
      const refs  = referencesDataArray.length > 0;
      const otherOk = !!(tn && pref && camp && refs);
      const aadhar = document.getElementById('aadhar_upload')?.files.length > 0;
      const resume = document.getElementById('resume_upload')?.files.length > 0;
      const docsOk = aadhar && resume;
      if (!langsOk) { showToast('Please fill in the Languages section.', 'error'); return false; }
      if (!skillsOk) { showToast('Please add at least one skill.', 'error'); return false; }
      if (!otherOk) { showToast('Please complete the Other Details section (TN preference, location, camp, references).', 'error'); return false; }
      if (!docsOk) { showToast('Aadhar Card and Resume are required before submitting.', 'error'); return false; }
      return true;
    }
    default: return false;
  }
}

function updateProgressBarForStep(activeStep) {
  const steps = document.querySelectorAll('.prog-step');
  steps.forEach((step, i) => {
    const stepNum = i + 1;
    step.classList.remove('active', 'done');
    const dot = step.querySelector('.prog-dot');

    let completed = false;
    switch (stepNum) {
      case 1: completed = isSectionComplete('section-personal'); break;
      case 2: completed = isSectionComplete('section-experience'); break;
      case 3: completed = isSectionComplete('section-education'); break;
      case 4: completed = isSectionComplete('section-family'); break;
      case 5: {
        const langsOk = isSectionComplete('section-languages');
        const skillsOk = skillsDataArray.length > 0;
        const tn = document.querySelector('[name="willing_tn"]')?.value;
        const pref = document.querySelector('[name="preferred_place"]')?.value.trim();
        const camp = document.querySelector('[name="stay_in_camp"]')?.value;
        const refs = referencesDataArray.length > 0;
        const aadhar = document.getElementById('aadhar_upload')?.files.length > 0;
        const resume = document.getElementById('resume_upload')?.files.length > 0;
        completed = langsOk && skillsOk && !!(tn && pref && camp && refs) && aadhar && resume;
        break;
      }
    }

    if (completed) {
      step.classList.add('done');
      if (dot) dot.textContent = '✓';
    } else {
      if (dot) dot.textContent = stepNum;
    }

    if (stepNum === activeStep) {
      step.classList.add('active');
    }
  });
}

// Override old scrollToSection to navigate to step
function scrollToSection(sectionId) {
  const map = {
    'section-personal': 1,
    'section-experience': 2,
    'section-education': 3,
    'section-family': 4,
    'section-languages': 5,
    'section-skills': 5,
    'section-other': 5,
    'section-docs': 5
  };
  const step = map[sectionId];
  if (step) goToStep(step);
}

// ============================================================
//  STREAM OPTIONS (unchanged)
// ============================================================
const streamOptions = {
  SSLC: ["1ST","2nd","3rd","4th","5th","6th","7th","8th","9th","10th"],
  HSC:  ["Commerce","Bio-Maths","Computer Science","Pure Science"],
  UG:   ["B.Com","BBA","BMS","BBM","BBS","BCA","B.Sc IT","B.Stat","B.Math","B.E","B.Tech","B.Arch","B.Plan","B.A","B.S.W","B.Ed","LLB","B.Pharm","BDS","MBBS"],
  PG:   ["M.Com","MBA","PGDM","M.Sc","MCA","M.Tech","M.E","M.A","MSW","M.Phil","LLM"],
  Diploma: ["Civil Engineering","Mechanical Engineering","Electrical Engineering","Electrical and Electronics Engineering (EEE)","Electronics and Communication Engineering (ECE)","Computer Science Engineering (CSE)","Information Technology","Automobile Engineering","Production Engineering","Mechatronics","Instrumentation and Control","Architecture Assistantship"]
};

// ============================================================
//  TOAST NOTIFICATION SYSTEM (unchanged)
// ============================================================
function showToast(message, type = 'success', duration = 3500) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span class="toast-msg">${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

// ============================================================
//  SECTION COMPLETION CHECKER (unchanged)
// ============================================================
function isSectionComplete(sectionId) {
  switch(sectionId) {
    case 'section-personal': {
      const name    = document.getElementById('full_name')?.value.trim();
      const dob     = document.getElementById('dob_year')?.value;
      const marital = document.getElementById('marital_status')?.value;
      const post    = document.getElementById('applied_post')?.value.trim();
      const phone   = document.getElementById('phone_no')?.value.replace(/\D/g,'');
      const addr    = document.getElementById('present_address')?.value.trim();
      return !!(name && dob && marital && post && phone?.length === 10 && addr);
    }
    case 'section-experience': {
      const status = document.getElementById('experience_status')?.value;
      if (!status) return false;
      if (status === 'Experienced') return experienceDataArray.length > 0;
      return true;
    }
    case 'section-education': {
      const hscSchool = document.getElementById('hscSchool')?.value.trim();
      const hscNil    = document.getElementById('hscNilChk')?.checked;
      return !!(hscSchool || hscNil);
    }
    case 'section-languages': {
      const speakChecked = Array.from(document.querySelectorAll('input[name="languageSpeak"]:checked')).length > 0;
      const writeChecked = Array.from(document.querySelectorAll('input[name="languageWrite"]:checked')).length > 0;
      const know = document.getElementById('knowCompany')?.value.trim();
      return speakChecked && writeChecked && !!know;
    }
    case 'section-family': {
      const fName = document.getElementById('fatherName')?.value.trim();
      const fOcc  = document.getElementById('fatherOccupation')?.value.trim();
      return !!(fName && fOcc);
    }
    case 'section-skills':
      return skillsDataArray.length > 0;
    case 'section-other': {
      const tn    = document.querySelector('[name="willing_tn"]')?.value;
      const pref  = document.querySelector('[name="preferred_place"]')?.value.trim();
      const camp  = document.querySelector('[name="stay_in_camp"]')?.value;
      const refs  = referencesDataArray.length > 0;
      return !!(tn && pref && camp && refs);
    }
    case 'section-docs': {
      const aadhar = document.getElementById('aadhar_upload')?.files.length > 0;
      const resume = document.getElementById('resume_upload')?.files.length > 0;
      const photo = document.getElementById('photo_upload')?.files.length > 0;
      return aadhar && resume && photo;
    }
    default: return false;
  }
}

// ============================================================
//  ACCORDION (unchanged)
// ============================================================
function toggleAccordion(headerEl) {
  const body = headerEl.nextElementSibling;
  if (!body) return;

  const isOpen = body.classList.contains('open');
  body.classList.toggle('open', !isOpen);
  headerEl.classList.toggle('open', !isOpen);
}

// ============================================================
//  AUTO-SAVE DRAFT (unchanged)
// ============================================================
const DRAFT_KEY = 'pnc_onboarding_draft';

function saveDraft() {
  try {
    const form = document.getElementById('candidateForm');
    if (!form) return;

    const data = {};
    form.querySelectorAll('input[name], select[name], textarea[name]').forEach(el => {
      if (el.type === 'checkbox' || el.type === 'radio') {
        data[el.name + '_' + el.value] = el.checked;
      } else if (el.type !== 'file') {
        data[el.name] = el.value;
      }
    });

    data['_arrays'] = {
      experienceDataArray,
      skillsDataArray,
      referencesDataArray,
      otherFamilyDataArray,
      otherEducationDataArray
    };
    data['_ts'] = Date.now();

    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch (e) { /* silent */ }
}

function checkForDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (!data._ts) return;

    const age = Date.now() - data._ts;
    if (age < 7 * 24 * 3600 * 1000) {
      const banner = document.getElementById('draftBanner');
      if (banner) banner.style.display = 'flex';
    } else {
      localStorage.removeItem(DRAFT_KEY);
    }
  } catch (e) { /* ignore */ }
}

function restoreDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    const form = document.getElementById('candidateForm');
    if (!form) return;

    form.querySelectorAll('input[name], select[name], textarea[name]').forEach(el => {
      if (el.type === 'file') return;
      if (el.type === 'checkbox' || el.type === 'radio') {
        const key = el.name + '_' + el.value;
        if (key in data) el.checked = data[key];
      } else {
        if (el.name in data) el.value = data[el.name];
      }
    });

    toggleMarriageYear();
    toggleExperienceTable();

    if (data._arrays) {
      if (data._arrays.experienceDataArray) experienceDataArray = data._arrays.experienceDataArray;
      if (data._arrays.skillsDataArray) skillsDataArray = data._arrays.skillsDataArray;
      if (data._arrays.referencesDataArray) referencesDataArray = data._arrays.referencesDataArray;
      if (data._arrays.otherFamilyDataArray) otherFamilyDataArray = data._arrays.otherFamilyDataArray;
      if (data._arrays.otherEducationDataArray) otherEducationDataArray = data._arrays.otherEducationDataArray;
    }

    dismissDraft();
    showToast('✅ Draft restored successfully!', 'success');
  } catch (e) {
    showToast('Could not restore draft.', 'error');
  }
}

function dismissDraft() {
  const banner = document.getElementById('draftBanner');
  if (banner) banner.style.display = 'none';
}

// Auto-save every 30 seconds
setInterval(saveDraft, 30000);
document.addEventListener('change', saveDraft);
document.addEventListener('input', saveDraft);

// ============================================================
//  REAL-TIME FIELD VALIDATION + SUCCESS INDICATOR (unchanged)
// ============================================================
function validateField(el) {
  if (!el || el.type === 'file' || el.type === 'hidden') return;

  const id    = el.id;
  const icon  = id ? document.getElementById('icon-' + id) : null;
  const hint  = id ? document.getElementById('hint-' + id) : null;

  el.classList.remove('field-valid', 'field-invalid');
  if (icon) icon.textContent = '';
  if (hint) { hint.className = 'field-hint'; hint.textContent = ''; }

  if (id === 'phone_no' || el.name === 'phone_no' || id === 'fatherPhone' || id === 'motherPhone') {
    const val = el.value.replace(/\D/g, '');
    if (val.length === 0 && !el.required) return;
    if (val.length !== 10) {
      el.classList.add('field-invalid');
      if (icon) icon.textContent = '❌';
      if (hint) { hint.className = 'field-hint error'; hint.textContent = 'Must be 10 digits'; }
      return;
    }
    el.classList.add('field-valid');
    if (icon) icon.textContent = '✅';
    return;
  }

  if (id === 'dob_year' && el.value) {
    const dob = new Date(el.value);
    const today = new Date();
    const age = (today - dob) / (365.25 * 24 * 3600 * 1000);
    if (age < 18) {
      el.classList.add('field-invalid');
      if (icon) icon.textContent = '❌';
      if (hint) { hint.className = 'field-hint error'; hint.textContent = 'Age must be at least 18 years'; }
      return;
    }
    if (age > 65) {
      el.classList.add('field-invalid');
      if (icon) icon.textContent = '⚠️';
      if (hint) { hint.className = 'field-hint error'; hint.textContent = 'Please verify date of birth'; }
      return;
    }
    if (dob > today) {
      el.classList.add('field-invalid');
      if (icon) icon.textContent = '❌';
      if (hint) { hint.className = 'field-hint error'; hint.textContent = 'Date of birth cannot be in the future'; }
      return;
    }
    el.classList.add('field-valid');
    if (icon) icon.textContent = '✅';
    const ageYears = Math.floor(age);
    if (hint) { hint.className = 'field-hint success'; hint.textContent = `Age: ${ageYears} years`; }
    return;
  }

  if (!el.willValidate) return;

  if (!el.checkValidity()) {
    el.classList.add('field-invalid');
    if (icon) icon.textContent = '❌';
    if (hint && el.validationMessage) { hint.className = 'field-hint error'; hint.textContent = el.validationMessage; }
  } else if (el.value && el.value.trim() !== '') {
    el.classList.add('field-valid');
    if (icon) icon.textContent = '✅';
  }
}

// ============================================================
//  CHARACTER COUNTER (unchanged)
// ============================================================
function initCharCounters() {
  const counters = [
    { id: 'present_address',    max: 300, ccId: 'cc-present_address' },
    { id: 'permanent_address',  max: 300, ccId: 'cc-permanent_address' },
    { id: 'reason_for_leaving', max: 500, ccId: 'cc-reason_for_leaving' }
  ];

  counters.forEach(({ id, max, ccId }) => {
    const el = document.getElementById(id);
    const cc = document.getElementById(ccId);
    if (!el || !cc) return;

    const update = () => {
      const len = el.value.length;
      cc.textContent = `${len} / ${max}`;
      cc.className = 'char-counter';
      if (len > max * 0.9) cc.classList.add('warn');
      if (len >= max)      cc.classList.add('over');
    };
    el.addEventListener('input', update);
    update();
  });
}

// ============================================================
//  FILE UPLOAD PREVIEW (unchanged)
// ============================================================
function getFileIcon(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (['jpg','jpeg','png','gif','webp'].includes(ext)) return null;
  if (ext === 'pdf') return '📄';
  if (['doc','docx'].includes(ext)) return '📝';
  if (['xls','xlsx'].includes(ext)) return '📊';
  return '📎';
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function handleFileSelect(input, previewId) {
  const container = document.getElementById(previewId);
  if (!container) return;
  container.innerHTML = '';

  Array.from(input.files).forEach((file, idx) => {
    const item = document.createElement('div');
    item.className = 'file-preview-item';

    const ext = file.name.split('.').pop().toLowerCase();
    const isImage = ['jpg','jpeg','png','gif','webp'].includes(ext);

    if (isImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const thumb = document.createElement('img');
        thumb.className = 'file-preview-thumb';
        thumb.src = e.target.result;
        item.insertBefore(thumb, item.firstChild);
      };
      reader.readAsDataURL(file);
      const ph = document.createElement('div');
      ph.className = 'file-preview-icon';
      ph.textContent = '🖼️';
      item.appendChild(ph);
    } else {
      const iconEl = document.createElement('div');
      iconEl.className = 'file-preview-icon';
      iconEl.textContent = getFileIcon(file) || '📎';
      item.appendChild(iconEl);
    }

    const info = document.createElement('div');
    info.className = 'file-preview-info';
    info.innerHTML = `
      <div class="file-preview-name" title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</div>
      <div class="file-preview-size">${formatFileSize(file.size)}</div>
    `;
    item.appendChild(info);

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'file-remove-btn';
    removeBtn.textContent = '✕ Remove';
    removeBtn.onclick = () => {
      item.remove();
      showToast('File removed from preview', 'info', 2000);
    };
    item.appendChild(removeBtn);

    container.appendChild(item);
  });

  if (input.files.length > 0) {
    showToast(`${input.files.length} file(s) selected`, 'success', 2000);
  }
}

function handleDragOver(e, zoneId) {
  e.preventDefault();
  const zone = document.getElementById(zoneId);
  if (zone) zone.classList.add('dragover');
}

function handleDragLeave(zoneId) {
  const zone = document.getElementById(zoneId);
  if (zone) zone.classList.remove('dragover');
}

function handleDrop(e, inputId, zoneId) {
  e.preventDefault();
  handleDragLeave(zoneId);
  const input = document.getElementById(inputId);
  if (!input) return;

  const previewMap = {
    'zone-aadhar': 'preview-aadhar',
    'zone-photo':  'preview-photo',
    'zone-resume': 'preview-resume',
    'zone-docs':   'preview-docs'
  };

  const dt = new DataTransfer();
  Array.from(e.dataTransfer.files).forEach(f => dt.items.add(f));
  input.files = dt.files;
  handleFileSelect(input, previewMap[zoneId] || '');
}

// ============================================================
//  KNOWN PERSON — OPTIONAL TOGGLE (unchanged)
// ============================================================
function toggleKnownPerson(isUnknown) {
  const fields = document.getElementById('knownPersonFields');
  const nameEl = document.querySelector('[name="known_person_name"]');
  const relEl  = document.getElementById('known_person_relationship');
  const projEl = document.querySelector('[name="known_person_project"]');

  if (!fields) return;

  if (isUnknown) {
    fields.style.display = 'none';
    if (nameEl) { nameEl.removeAttribute('required'); nameEl.value = 'None'; }
    if (relEl)  { relEl.removeAttribute('required');  relEl.value = ''; }
    if (projEl) { projEl.removeAttribute('required'); projEl.value = 'N/A'; }
  } else {
    fields.style.display = 'block';
    if (nameEl) { nameEl.setAttribute('required','required'); nameEl.value = ''; }
    if (relEl)  { relEl.setAttribute('required','required'); }
    if (projEl) { projEl.setAttribute('required','required'); projEl.value = ''; }
  }
}

// ============================================================
//  ESCAPE HTML (unchanged)
// ============================================================
function escapeHtml(text) {
  if (!text) return '';
  return String(text).replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  })[m]);
}

// ============================================================
//  TOGGLE HELPERS (unchanged)
// ============================================================
function toggleOther(selectEl, inputId) {
  const inputEl = document.getElementById(inputId);
  if (!inputEl) return;
  inputEl.style.display = selectEl.value === 'Other' ? 'block' : 'none';
}

function toggleOtherInput(selectId, inputId) {
  const selectEl = document.getElementById(selectId);
  const inputEl  = document.getElementById(inputId);
  if (selectEl && inputEl) {
    if (selectEl.value === 'Other') {
      inputEl.style.display = 'block';
      inputEl.focus();
    } else {
      inputEl.style.display = 'none';
      inputEl.value = '';
    }
  }
}

function toggleMarriageYear() {
  const maritalStatus = document.getElementById('marital_status');
  const marriageField = document.getElementById('marriageYearField');
  if (!maritalStatus || !marriageField) return;
  marriageField.style.display = maritalStatus.value === 'Married' ? 'block' : 'none';
}

function toggleBoardUniversity() {
  const qual = document.getElementById('qual') ? document.getElementById('qual').value : '';
  const boardSelect = document.getElementById('board');
  const boardOther = document.getElementById('board_other');
  const universityInput = document.getElementById('board_university_input');
  const boardLabel = document.querySelector("label[for='board']");

  if (qual === 'SSLC' || qual === 'HSC') {
    if (boardSelect) boardSelect.style.display = 'block';
    if (boardOther) boardOther.style.display = 'none';
    if (universityInput) universityInput.style.display = 'none';
    if (boardLabel) boardLabel.innerText = 'Board';
  } else {
    if (boardSelect) boardSelect.style.display = 'none';
    if (boardOther) boardOther.style.display = 'none';
    if (universityInput) universityInput.style.display = 'block';
    if (boardLabel) boardLabel.innerText = 'University';
  }
}

function updateStreamOptions() {
  const qualEl = document.getElementById('qual');
  const streamDropdown = document.getElementById('stream');
  const otherInput = document.getElementById('stream_other');
  if (!qualEl || !streamDropdown || !otherInput) return;

  const qual = qualEl.value;
  streamDropdown.innerHTML = '<option value="">Select</option>';

  if (streamOptions[qual]) {
    streamOptions[qual].forEach(option => {
      const opt = document.createElement('option');
      opt.value = option;
      opt.textContent = option;
      streamDropdown.appendChild(opt);
    });
  }

  const otherOpt = document.createElement('option');
  otherOpt.value = 'Other';
  otherOpt.textContent = 'Other';
  streamDropdown.appendChild(otherOpt);

  streamDropdown.value = '';
  otherInput.value = '';
  otherInput.style.display = 'none';
}

// ============================================================
//  EXPERIENCE (unchanged, but added progress bar update)
// ============================================================
function toggleExperienceTable() {
  const statusEl = document.getElementById('experience_status');
  const container = document.getElementById('experienceTableContainer');
  const reasonField = document.getElementById('reason_for_leaving');
  if (!statusEl || !container) return;

  const status = statusEl.value;
  container.style.display = (status === 'Experienced') ? 'block' : 'none';

  if (reasonField) {
    if (status === 'Fresher') {
      reasonField.removeAttribute('required');
      reasonField.placeholder = 'N/A — Not applicable for freshers';
    } else {
      reasonField.setAttribute('required', 'required');
      reasonField.placeholder = 'Briefly explain your reason for leaving...';
    }
  }

  if (status !== 'Experienced') {
    const ep = document.getElementById('experiencePreview'); if (ep) ep.innerHTML = '';
    const te = document.getElementById('totalExperience');  if (te) te.value = '';
    experienceDataArray = [];
  }
  updateProgressBarForStep(currentStep);
}

function calculateTotalExperience() {
  let total = 0;
  experienceDataArray.forEach(exp => {
    const from = new Date(exp.frommonth);
    const to   = new Date(exp.tomonth);
    total += (to - from) / (1000 * 60 * 60 * 24 * 365);
  });
  const te = document.getElementById('totalExperience');
  if (te) te.value = total.toFixed(1);
}

function validateMonths() {
  const fromEl = document.getElementById('frommonth');
  const toEl   = document.getElementById('tomonth');
  if (!fromEl || !toEl || !fromEl.value || !toEl.value) return true;

  const from  = new Date(fromEl.value);
  const to    = new Date(toEl.value);
  const today = new Date();

  if (to > today) {
    showToast('"To" month cannot be in the future', 'error');
    toEl.value = '';
    return false;
  }
  if (from >= to) {
    showToast('"From" date must be before "To" date', 'error');
    toEl.value = '';
    return false;
  }
  return true;
}

function addExperience() {
  if (!validateMonths()) return;

  const company       = document.getElementById('previouscompany').value.trim();
  const office        = document.getElementById('companyoffice').value.trim();
  const designation   = document.getElementById('designation').value.trim();
  const projectname   = document.getElementById('projectname').value.trim();
  const projectlocation = document.getElementById('projectlocation').value.trim();
  const projectvalue  = document.getElementById('projectvalue').value.trim();
  const role          = document.getElementById('role').value.trim();
  const frommonth     = document.getElementById('frommonth').value;
  const tomonth       = document.getElementById('tomonth').value;

  if (!company || !role || !frommonth || !tomonth) {
    showToast('Please fill all required Experience fields (Company, Role, From, To)', 'error');
    return;
  }

  experienceDataArray.push({ projectname, projectlocation, projectvalue, previouscompany: company, companyoffice: office, designation, role, frommonth, tomonth });

  const from = new Date(frommonth);
  const to   = new Date(tomonth);
  const expYears = ((to - from) / (1000 * 60 * 60 * 24 * 365)).toFixed(1);

  const li = document.createElement('li');
  li.setAttribute('data-index', experienceDataArray.length - 1);
  li.style.cssText = 'background:#f8f9fb; border-left:4px solid #2d5a8c; border-radius:8px; padding:14px 16px; margin-bottom:10px; list-style:none;';
  li.innerHTML = `
    <b>${escapeHtml(company)}</b> (${escapeHtml(office)})<br>
    Designation: ${escapeHtml(designation)}<br>
    Project: ${escapeHtml(projectname)} — ${escapeHtml(projectlocation)}<br>
    Value: ${escapeHtml(projectvalue)} &nbsp;|&nbsp; Role: ${escapeHtml(role)}<br>
    From: ${frommonth} → To: ${tomonth} &nbsp;
    <span style="background:#dbeafe; color:#1e40af; font-size:12px; font-weight:700; padding:2px 8px; border-radius:12px;">${expYears} yrs</span>
    <button type="button" onclick="removeExperience(this)" style="float:right; background:#dc2626!important; color:white!important; border:none!important; border-radius:6px!important; padding:4px 10px!important; font-size:12px!important; cursor:pointer; width:auto!important; min-width:auto!important; margin:0!important;">✖</button>
  `;

  document.getElementById('experiencePreview').appendChild(li);
  calculateTotalExperience();

  ['previouscompany','companyoffice','designation','projectname','projectlocation','projectvalue','role','frommonth','tomonth'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  showToast('Experience entry added ✔', 'success', 2500);
  saveDraft();
  updateProgressBarForStep(currentStep);
}

function removeExperience(btn) {
  const li    = btn.closest('li') || btn.parentElement;
  const index = parseInt(li.getAttribute('data-index'));
  experienceDataArray.splice(index, 1);
  li.remove();
  document.querySelectorAll('#experiencePreview li').forEach((item, idx) => {
    item.setAttribute('data-index', idx);
  });
  calculateTotalExperience();
  showToast('Experience entry removed', 'info', 2000);
  updateProgressBarForStep(currentStep);
}

// ============================================================
//  EDUCATION — LEGACY (unchanged, kept for compatibility)
// ============================================================
function addEducationPreview() {
  const qualValue   = document.getElementById('qual') ? document.getElementById('qual').value : '';
  const qual        = qualValue === 'Other' ? (document.getElementById('qual_other') ? document.getElementById('qual_other').value : '') : qualValue;
  const streamValue = document.getElementById('stream') ? document.getElementById('stream').value : '';
  const stream      = streamValue === 'Other' ? (document.getElementById('stream_other') ? document.getElementById('stream_other').value : '') : streamValue;
  const mediumValue = document.getElementById('medium') ? document.getElementById('medium').value : '';
  const medium      = mediumValue === 'Other' ? (document.getElementById('medium_other') ? document.getElementById('medium_other').value : '') : mediumValue;

  let boardOrUniversity = '';
  if (qualValue === 'SSLC' || qualValue === 'HSC') {
    const boardValue = document.getElementById('board') ? document.getElementById('board').value : '';
    boardOrUniversity = boardValue === 'Other' ? (document.getElementById('board_other') ? document.getElementById('board_other').value : '') : boardValue;
  } else {
    boardOrUniversity = document.getElementById('board_university_input') ? document.getElementById('board_university_input').value : '';
  }

  const from          = document.getElementById('from') ? document.getElementById('from').value : '';
  const to            = document.getElementById('to') ? document.getElementById('to').value : '';
  const collegeSchool = document.getElementById('university') ? document.getElementById('university').value : '';
  const mode          = document.getElementById('mode') ? document.getElementById('mode').value : '';

  if (!qual || !stream || !from || !to || !medium || !boardOrUniversity || !collegeSchool || !mode) {
    showToast('Please fill in all Education fields', 'error');
    return;
  }

  educationDataArray.push({ qual, stream, from, to, medium, board: boardOrUniversity, university: collegeSchool, mode });
  educationCount++;

  const container = document.getElementById('educationPreviewContainer');
  if (!container) return;
  const line = document.createElement('div');
  line.className = 'edu-preview-line';
  line.setAttribute('data-index', educationDataArray.length - 1);
  line.innerHTML = `
    <strong>${educationCount}.</strong>
    ${escapeHtml(qual)} — ${escapeHtml(stream)} — ${escapeHtml(from)} to ${escapeHtml(to)} —
    ${escapeHtml(medium)} — ${escapeHtml(boardOrUniversity)} — ${escapeHtml(mode)} — ${escapeHtml(collegeSchool)}
    <button type="button" onclick="removeEducation(this)">✖</button>
  `;
  container.appendChild(line);

  ['qual','stream','from','to','medium','board','board_university_input','university','mode'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  ['qual_other','stream_other','medium_other','board_other'].forEach(id => {
    const el = document.getElementById(id); if (el) { el.value = ''; el.style.display = 'none'; }
  });
  showToast('Education entry added ✔', 'success', 2500);
  updateProgressBarForStep(currentStep);
}

function removeEducation(btn) {
  const line = btn.closest('.edu-preview-line') || btn.parentElement;
  const index = parseInt(line.getAttribute('data-index'));
  educationDataArray.splice(index, 1);
  line.remove();
  renumberEducation();
  updateProgressBarForStep(currentStep);
}

function renumberEducation() {
  const lines = document.querySelectorAll('#educationPreviewContainer .edu-preview-line');
  educationCount = 0;
  lines.forEach((line, index) => {
    educationCount++;
    line.setAttribute('data-index', index);
    const strong = line.querySelector('strong');
    if (strong) strong.innerText = `${index + 1}.`;
  });
}

// ============================================================
//  FAMILY SECTION (unchanged, added progress bar updates)
// ============================================================
const fatherNilChk        = null;
const fatherNameEl        = document.getElementById('fatherName');
const fatherAgeEl         = document.getElementById('fatherAge');
const fatherOccupationEl  = document.getElementById('fatherOccupation');
const fatherMaritalStatusEl = document.getElementById('fatherMaritalStatus');
const fatherLocationEl    = document.getElementById('fatherLocation');
const fatherPhoneEl       = document.getElementById('fatherPhone');

const motherNilChk        = null;
const motherNameEl        = document.getElementById('motherName');
const motherAgeEl         = document.getElementById('motherAge');
const motherOccupationEl  = document.getElementById('motherOccupation');
const motherMaritalStatusEl = document.getElementById('motherMaritalStatus');
const motherLocationEl    = document.getElementById('motherLocation');
const motherPhoneEl       = document.getElementById('motherPhone');

const otherRelEl          = document.getElementById('otherRel');
const otherNameEl         = document.getElementById('otherName');
const otherAgeEl          = document.getElementById('otherAge');
const otherOccupationEl   = document.getElementById('otherOccupation');
const otherLocationEl     = document.getElementById('otherLocation');
const otherMaritalStatusEl= document.getElementById('otherMaritalStatus');
const otherPhoneEl        = document.getElementById('otherPhone');

function toggleFatherFields(isNil) {
  const fatherFields = [fatherNameEl, fatherAgeEl, fatherOccupationEl, fatherMaritalStatusEl, fatherLocationEl, fatherPhoneEl];
  fatherFields.forEach(el => {
    if (!el) return;
    if (isNil) {
      el.value = 'NIL';
      el.disabled = true;
      el.style.backgroundColor = '#e8ecf1';
      el.style.color = '#999';
      el.removeAttribute('required');
    } else {
      el.value = '';
      el.disabled = false;
      el.style.backgroundColor = '';
      el.style.color = '#3d4d5c';
      el.setAttribute('required','required');
    }
  });
}

function toggleMotherFields(isNil) {
  const motherFields = [motherNameEl, motherAgeEl, motherOccupationEl, motherMaritalStatusEl, motherLocationEl, motherPhoneEl];
  motherFields.forEach(el => {
    if (!el) return;
    if (isNil) {
      el.value = 'NIL';
      el.disabled = true;
      el.style.backgroundColor = '#e8ecf1';
      el.style.color = '#999';
      el.removeAttribute('required');
    } else {
      el.value = '';
      el.disabled = false;
      el.style.backgroundColor = '';
      el.style.color = '#3d4d5c';
    }
  });
}

function validateFamilyDetails() {
  const isFatherNil = fatherNilChk && fatherNilChk.checked;
  const isMotherNil = motherNilChk && motherNilChk.checked;

  if (!isFatherNil) {
    if (!fatherNameEl || !fatherNameEl.value.trim()) {
      showToast("Father's Full Name is required", 'error');
      if (fatherNameEl) fatherNameEl.focus();
      return false;
    }
    if (!fatherOccupationEl || !fatherOccupationEl.value.trim()) {
      showToast("Father's Occupation is required", 'error');
      if (fatherOccupationEl) fatherOccupationEl.focus();
      return false;
    }
    if (!fatherPhoneEl || !fatherPhoneEl.value.trim()) {
      showToast("Father's Phone Number is required", 'error');
      if (fatherPhoneEl) fatherPhoneEl.focus();
      return false;
    }
  }

  if (!isMotherNil) {
    if (!motherNameEl || !motherNameEl.value.trim()) {
      showToast("Mother's Full Name is required (or check 'Mother details not available')", 'error');
      if (motherNameEl) motherNameEl.focus();
      return false;
    }
    if (!motherOccupationEl || !motherOccupationEl.value.trim()) {
      showToast("Mother's Occupation is required (or check 'Mother details not available')", 'error');
      if (motherOccupationEl) motherOccupationEl.focus();
      return false;
    }
    if (!motherPhoneEl || !motherPhoneEl.value.trim()) {
      showToast("Mother's Phone Number is required (or check 'Mother details not available')", 'error');
      if (motherPhoneEl) motherPhoneEl.focus();
      return false;
    }
  }
  return true;
}

function clearOtherFamilyInputs() {
  if (otherRelEl)           otherRelEl.value = '';
  if (otherNameEl)          otherNameEl.value = '';
  if (otherAgeEl)           otherAgeEl.value = '';
  if (otherOccupationEl)    otherOccupationEl.value = '';
  if (otherLocationEl)      otherLocationEl.value = '';
  if (otherMaritalStatusEl) otherMaritalStatusEl.value = '';
  if (otherPhoneEl)         otherPhoneEl.value = '';
}

function renderOtherFamilyLine(rel, name, age, occ, loc, marital, ph) {
  const container = document.getElementById('otherFamilyPreviewContainer');
  if (!container) return;

  otherFamilyCount++;
  const line = document.createElement('div');
  line.className = 'edu-preview-line';
  line.setAttribute('data-index', otherFamilyDataArray.length - 1);

  const parts = [];
  if (rel)    parts.push(escapeHtml(rel));
  if (name)   parts.push(escapeHtml(name));
  if (age)    parts.push(escapeHtml(age + ' yrs'));
  if (occ)    parts.push(escapeHtml(occ));
  if (loc)    parts.push(escapeHtml(loc));
  if (marital)parts.push(escapeHtml(marital));
  if (ph)     parts.push(escapeHtml(ph));

  line.innerHTML = `
    <div style="flex:1;"><strong>${otherFamilyCount}.</strong> ${parts.join(', ')}</div>
    <button type="button" onclick="removeOtherFamily(this)" style="background:#ef4444!important; color:white!important; border:none!important; padding:6px 10px!important; border-radius:6px!important; cursor:pointer; font-weight:600!important; min-width:36px!important; width:auto!important; margin:0!important; float:none!important;">✖</button>
  `;
  container.appendChild(line);
}

function addOtherFamily() {
  const rel    = otherRelEl          ? otherRelEl.value.trim()           : '';
  const name   = otherNameEl         ? otherNameEl.value.trim()          : '';
  const age    = otherAgeEl          ? otherAgeEl.value.trim()           : '';
  const occ    = otherOccupationEl   ? otherOccupationEl.value.trim()    : '';
  const loc    = otherLocationEl     ? otherLocationEl.value.trim()      : '';
  const marital= otherMaritalStatusEl? otherMaritalStatusEl.value.trim() : '';
  const ph     = otherPhoneEl        ? otherPhoneEl.value.trim()         : '';

  if (!rel)  { showToast('Please select Relationship', 'error'); return; }
  if (!name) { showToast('Please enter Name', 'error'); return; }

  otherFamilyDataArray.push({ relationship: rel, name, age, occupation: occ, location: loc, maritalStatus: marital, phone: ph });
  renderOtherFamilyLine(rel, name, age, occ, loc, marital, ph);
  clearOtherFamilyInputs();
  showToast('Family member added ✔', 'success', 2500);
  saveDraft();
  updateProgressBarForStep(currentStep);
}

function removeOtherFamily(btn) {
  const line = btn.closest('.edu-preview-line') || btn.parentElement;
  const index = parseInt(line.getAttribute('data-index'), 10);
  otherFamilyDataArray.splice(index, 1);
  line.remove();
  renumberOtherFamily();
  updateProgressBarForStep(currentStep);
}

function renumberOtherFamily() {
  const container = document.getElementById('otherFamilyPreviewContainer');
  if (!container) return;
  const lines = container.querySelectorAll('.edu-preview-line');
  otherFamilyCount = 0;
  lines.forEach((line, idx) => {
    otherFamilyCount++;
    line.setAttribute('data-index', idx);
    const strong = line.querySelector('strong');
    if (strong) strong.innerText = (idx + 1) + '.';
  });
}

// ============================================================
//  EDUCATION — NEW STATIC SECTIONS (unchanged, added progress bar updates)
// ============================================================
const sslcNilChk = document.getElementById('sslcNilChk');
const hscNilChk  = document.getElementById('hscNilChk');
const ugNilChk   = document.getElementById('ugNilChk');

const otherQualNameEl      = document.getElementById('otherQualName');
const otherQualInstituteEl = document.getElementById('otherQualInstitute');
const otherQualMediumEl    = document.getElementById('otherQualMedium');
const otherQualMediumOtherEl = document.getElementById('otherQualMediumOther');
const otherQualYearEl      = document.getElementById('otherQualYear');

if (sslcNilChk) sslcNilChk.addEventListener('change', function() { toggleEducationFields('sslc', this.checked); updateProgressBarForStep(currentStep); });
if (hscNilChk)  hscNilChk.addEventListener('change',  function() { toggleEducationFields('hsc',  this.checked); updateProgressBarForStep(currentStep); });
if (ugNilChk)   ugNilChk.addEventListener('change',   function() { toggleEducationFields('ug',   this.checked); updateProgressBarForStep(currentStep); });

function toggleEducationFields(level, isNil) {
  const inputIds = {
    sslc: ['sslcSchool','sslcUpto','sslcBoard','sslcMedium','sslcYear','sslcBoardOther','sslcMediumOther'],
    hsc:  ['hscSchool','hscStream','hscBoard','hscMedium','hscYear','hscStreamOther','hscBoardOther','hscMediumOther'],
    ug:   ['ugCourse','ugSpecialization','ugCollege','ugUniversity','ugMedium','ugMediumOther','ugMode','ugYear']
  };
  const fieldIds = inputIds[level] || [];
  fieldIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (isNil) {
      el.value = '';
      el.disabled = true;
      el.style.opacity = '0.6';
      el.style.cursor = 'not-allowed';
    } else {
      el.disabled = false;
      el.style.opacity = '1';
      el.style.cursor = 'auto';
      if (id.includes('Other')) { el.style.display = 'none'; el.value = ''; }
    }
  });
}

function clearOtherEducationInputs() {
  if (otherQualNameEl)      otherQualNameEl.value = '';
  if (otherQualInstituteEl) otherQualInstituteEl.value = '';
  if (otherQualMediumEl)    otherQualMediumEl.value = '';
  if (otherQualMediumOtherEl) { otherQualMediumOtherEl.value = ''; otherQualMediumOtherEl.style.display = 'none'; }
  if (otherQualYearEl)      otherQualYearEl.value = '';
  const univEl = document.getElementById('otherQualUniversity');
  const modeEl = document.getElementById('otherQualMode');
  if (univEl) univEl.value = '';
  if (modeEl) modeEl.value = '';
}

function renderOtherEducationLine(qualName, institute, medium, year) {
  const container = document.getElementById('otherEducationPreviewContainer');
  if (!container) return;

  otherEducationCount++;
  const line = document.createElement('div');
  line.className = 'edu-preview-line';
  line.setAttribute('data-index', otherEducationDataArray.length - 1);

  const parts = [];
  if (qualName)  parts.push(escapeHtml(qualName));
  if (institute) parts.push(escapeHtml(institute));
  if (medium)    parts.push(escapeHtml(medium));
  if (year)      parts.push(escapeHtml(year));

  line.innerHTML = `
    <div style="flex:1;"><strong>${otherEducationCount}.</strong> ${parts.join(', ')}</div>
    <button type="button" onclick="removeOtherEducation(this)" style="background:#ef4444!important; color:white!important; border:none!important; padding:6px 10px!important; border-radius:8px!important; cursor:pointer; font-weight:600!important; min-width:36px!important; width:auto!important; margin:0!important; float:none!important;">✖</button>
  `;
  container.appendChild(line);
}

function addOtherEducation() {
  const qualName  = otherQualNameEl      ? otherQualNameEl.value.trim()      : '';
  const institute = otherQualInstituteEl ? otherQualInstituteEl.value.trim() : '';
  const mediumVal = otherQualMediumEl    ? otherQualMediumEl.value.trim()    : '';
  const medium    = mediumVal === 'Other' ? (otherQualMediumOtherEl ? otherQualMediumOtherEl.value.trim() : '') : mediumVal;
  const year      = otherQualYearEl      ? otherQualYearEl.value.trim()      : '';

  if (!qualName)  { showToast('Please enter Qualification / Certification name', 'error'); return; }
  if (!institute) { showToast('Please enter Institute / Organization name', 'error'); return; }

  otherEducationDataArray.push({ qualification: qualName, institute, medium, year });
  renderOtherEducationLine(qualName, institute, medium, year);
  clearOtherEducationInputs();
  showToast('Qualification added ✔', 'success', 2500);
  saveDraft();
  updateProgressBarForStep(currentStep);
}

function removeOtherEducation(btn) {
  const line = btn.closest('.edu-preview-line') || btn.parentElement;
  const index = parseInt(line.getAttribute('data-index'), 10);
  otherEducationDataArray.splice(index, 1);
  line.remove();
  renumberOtherEducation();
  updateProgressBarForStep(currentStep);
}

function renumberOtherEducation() {
  const container = document.getElementById('otherEducationPreviewContainer');
  if (!container) return;
  const lines = container.querySelectorAll('.edu-preview-line');
  otherEducationCount = 0;
  lines.forEach((line, idx) => {
    otherEducationCount++;
    line.setAttribute('data-index', idx);
    const strong = line.querySelector('strong');
    if (strong) strong.innerText = (idx + 1) + '.';
  });
}

function getEducationData() {
  const isSslcNil = sslcNilChk && sslcNilChk.checked;
  const isHscNil  = hscNilChk  && hscNilChk.checked;
  const isUgNil   = ugNilChk   && ugNilChk.checked;

  const educationArray = [];
  const v = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };

  if (!isSslcNil) {
    const sslcMedium = v('sslcMedium') === 'Other' ? v('sslcMediumOther') : v('sslcMedium');
    const board = v('sslcBoard') === 'Other' ? v('sslcBoardOther') : v('sslcBoard');
    educationArray.push({ level:'01.SSLC', school:v('sslcSchool'), board, medium:sslcMedium, year:v('sslcYear') });
  }
  if (!isHscNil) {
    const hscMedium = v('hscMedium') === 'Other' ? v('hscMediumOther') : v('hscMedium');
    const stream    = v('hscStream') === 'Other' ? v('hscStreamOther') : v('hscStream');
    const board     = v('hscBoard')  === 'Other' ? v('hscBoardOther')  : v('hscBoard');
    educationArray.push({ level:'02.HSC', school:v('hscSchool'), stream, board, medium:hscMedium, year:v('hscYear') });
  }
  if (!isUgNil) {
    const ugMedium = v('ugMedium') === 'Other' ? v('ugMediumOther') : v('ugMedium');
    educationArray.push({ level:'03.UG', course:v('ugCourse'), specialization:v('ugSpecialization'), college:v('ugCollege'), university:v('ugUniversity'), medium:ugMedium, mode:v('ugMode'), year:v('ugYear') });
  }
  if (otherEducationDataArray.length > 0) {
    educationArray.push({ level:'04.Other', qualifications: otherEducationDataArray });
  }
  return educationArray;
}

function getFamilyData() {
  return {
    father: {
      name:          fatherNameEl          ? fatherNameEl.value.trim()          : '',
      age:           fatherAgeEl           ? fatherAgeEl.value.trim()           : '',
      occupation:    fatherOccupationEl    ? fatherOccupationEl.value.trim()    : '',
      maritalStatus: fatherMaritalStatusEl ? fatherMaritalStatusEl.value.trim() : '',
      location:      fatherLocationEl      ? fatherLocationEl.value.trim()      : '',
      phone:         fatherPhoneEl         ? fatherPhoneEl.value.trim()         : '',
      isNil: false
    },
    mother: {
      name:          motherNameEl          ? motherNameEl.value.trim()          : '',
      age:           motherAgeEl           ? motherAgeEl.value.trim()           : '',
      occupation:    motherOccupationEl    ? motherOccupationEl.value.trim()    : '',
      maritalStatus: motherMaritalStatusEl ? motherMaritalStatusEl.value.trim() : '',
      location:      motherLocationEl      ? motherLocationEl.value.trim()      : '',
      phone:         motherPhoneEl         ? motherPhoneEl.value.trim()         : '',
      isNil: false
    },
    otherFamily: otherFamilyDataArray
  };
}

// ============================================================
//  SKILLS (unchanged, added progress bar updates)
// ============================================================
function toggleOtherSkill(select) {
  const otherInput = document.getElementById('otherSkill');
  if (!otherInput) return;
  otherInput.style.display = select.value === 'Other' ? 'inline-block' : 'none';
}

function addSkillPreview() {
  const skillSelect     = document.getElementById('skillSelect');
  const otherSkillInput = document.getElementById('otherSkill');
  const proficiencySelect = document.getElementById('skillProficiency');
  if (!skillSelect || !proficiencySelect) return;

  let skill = skillSelect.value;
  if (skill === 'Other') {
    skill = otherSkillInput ? otherSkillInput.value.trim() : '';
    if (!skill) { showToast("Please enter a skill name for 'Other'", 'error'); return; }
  }

  const proficiency = proficiencySelect.value;
  if (!skill)       { showToast('Please select a skill', 'error'); return; }
  if (!proficiency) { showToast('Please select proficiency level', 'error'); return; }

  const isDuplicate = skillsDataArray.some(s => s.skill.toLowerCase() === skill.toLowerCase());
  if (isDuplicate) { showToast(`"${skill}" already added`, 'warning'); return; }

  skillsDataArray.push({ skill, proficiency });
  skillCount++;

  const container = document.getElementById('skillPreviewContainer');
  const line = document.createElement('div');
  line.className = 'edu-preview-line';
  line.setAttribute('data-index', skillsDataArray.length - 1);

  const profColors = { Excellent:'#dcfce7|#166534', Good:'#dbeafe|#1e40af', Average:'#fef9c3|#854d0e' };
  const [bg, fg] = (profColors[proficiency] || '#f3f4f6|#374151').split('|');

  line.innerHTML = `
    <strong>${skillCount}.</strong>
    <b style="margin:0 8px;">${escapeHtml(skill)}</b>
    <span style="background:${bg}; color:${fg}; font-size:12px; font-weight:700; padding:2px 10px; border-radius:12px;">${escapeHtml(proficiency)}</span>
    <button type="button" onclick="removeSkill(this)" style="float:right; background:#dc2626!important; color:white!important; border:none!important; border-radius:6px!important; padding:4px 10px!important; font-size:12px!important; cursor:pointer; width:auto!important; min-width:auto!important; margin:0!important;">✖</button>
  `;
  container.appendChild(line);

  skillSelect.selectedIndex = 0;
  proficiencySelect.value = '';
  if (otherSkillInput) { otherSkillInput.value = ''; otherSkillInput.style.display = 'none'; }
  showToast(`Skill "${skill}" added ✔`, 'success', 2500);
  saveDraft();
  updateProgressBarForStep(currentStep);
}

function removeSkill(btn) {
  const line = btn.closest('.edu-preview-line') || btn.parentElement;
  const index = parseInt(line.getAttribute('data-index'));
  skillsDataArray.splice(index, 1);
  line.remove();
  renumberSkills();
  updateProgressBarForStep(currentStep);
}

function renumberSkills() {
  const lines = document.querySelectorAll('#skillPreviewContainer .edu-preview-line');
  skillCount = 0;
  lines.forEach((line, index) => {
    skillCount++;
    line.setAttribute('data-index', index);
    const strong = line.querySelector('strong');
    if (strong) strong.innerText = `${skillCount}.`;
  });
}

// ============================================================
//  REFERENCES (unchanged, added progress bar updates)
// ============================================================
function addReference() {
  const row = document.querySelector('.referenceRow');
  if (!row) return;

  const nameEl  = row.querySelector('[name="ref_name[]"]');
  const compEl  = row.querySelector('[name="ref_company[]"]');
  const desigEl = row.querySelector('[name="ref_designation[]"]');
  const contEl  = row.querySelector('[name="ref_contact[]"]');

  const name        = nameEl  ? nameEl.value.trim()  : '';
  const company     = compEl  ? compEl.value.trim()  : '';
  const designation = desigEl ? desigEl.value.trim() : '';
  const contact     = contEl  ? contEl.value.trim()  : '';

  if (!name || !company || !designation || !contact) {
    showToast('Please fill all Reference fields (Name, Company, Designation, Contact)', 'error');
    return;
  }

  referencesDataArray.push({ name, company, designation, contact });

  const preview = document.createElement('div');
  preview.className = 'edu-preview-line';
  preview.setAttribute('data-index', referencesDataArray.length - 1);
  preview.innerHTML = `
    <div style="flex:1;">
      <strong>${refCount}.</strong>
      <b>${escapeHtml(name)}</b> — ${escapeHtml(company)} — ${escapeHtml(designation)} — 📞 ${escapeHtml(contact)}
    </div>
    <button type="button" onclick="removeReference(this)" style="background:#dc2626!important; color:white!important; border:none!important; border-radius:6px!important; padding:4px 10px!important; font-size:12px!important; cursor:pointer; width:auto!important; min-width:auto!important; margin:0!important; float:none!important;">✖</button>
  `;
  document.getElementById('referencePreview').appendChild(preview);
  refCount++;

  row.querySelectorAll('input, textarea').forEach(el => el.value = '');
  showToast('Reference added ✔', 'success', 2500);
  saveDraft();
  updateProgressBarForStep(currentStep);
}

function removeReference(btn) {
  const preview = btn.closest('.edu-preview-line') || btn.parentElement;
  const index   = parseInt(preview.getAttribute('data-index'));
  referencesDataArray.splice(index, 1);
  preview.remove();
  reindexReferences();
  updateProgressBarForStep(currentStep);
}

function reindexReferences() {
  const previews = document.querySelectorAll('#referencePreview .edu-preview-line');
  refCount = 1;
  previews.forEach((el, idx) => {
    el.setAttribute('data-index', idx);
    const strong = el.querySelector('strong');
    if (strong) strong.innerText = `${idx + 1}.`;
  });
  refCount = previews.length + 1;
}

// ============================================================
//  FILE HELPERS (unchanged)
// ============================================================
const getBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload  = () => resolve({ base64: reader.result.split(',')[1], name: file.name, type: file.type });
  reader.onerror = (error) => reject(error);
});

async function processMultipleFiles(inputId) {
  const inputEl = document.getElementById(inputId);
  if (!inputEl || !inputEl.files.length) return [];
  const filesData = [];
  for (let i = 0; i < inputEl.files.length; i++) {
    const file   = inputEl.files[i];
    const base64 = await fileToBase64(file);
    filesData.push({ name: file.name, type: file.type || 'application/octet-stream', base64: base64.split(',')[1] });
  }
  return filesData;
}

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

// ============================================================
//  CHECKBOX VALIDATION (unchanged)
// ============================================================
function getCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(el => el.value);
}

function validateCheckboxGroups() {
  const languageSpeakGroup = document.getElementById('languageSpeakGroup');
  const languageWriteGroup = document.getElementById('languageWriteGroup');
  let isValid = true;

  if (languageSpeakGroup) {
    const isChecked = Array.from(languageSpeakGroup.querySelectorAll('input[name="languageSpeak"]')).some(cb => cb.checked);
    if (!isChecked) { languageSpeakGroup.classList.add('error'); isValid = false; }
    else            { languageSpeakGroup.classList.remove('error'); }
  }
  if (languageWriteGroup) {
    const isChecked = Array.from(languageWriteGroup.querySelectorAll('input[name="languageWrite"]')).some(cb => cb.checked);
    if (!isChecked) { languageWriteGroup.classList.add('error'); isValid = false; }
    else            { languageWriteGroup.classList.remove('error'); }
  }
  return isValid;
}

// ============================================================
//  BUILD EDUCATION ROWS (unchanged)
// ============================================================
function buildEducationRows() {
  const rows = [];
  let idx = 1;
  const v   = (id) => document.getElementById(id)?.value.trim() || '';
  const chk = (id) => document.getElementById(id)?.checked;

  if (!chk('hscNilChk')) {
    const stream    = v('hscStream') === 'Other' ? v('hscStreamOther') : v('hscStream');
    const board     = v('hscBoard')  === 'Other' ? v('hscBoardOther')  : v('hscBoard');
    const hscMedium = v('hscMedium') === 'Other' ? v('hscMediumOther') : v('hscMedium');
    rows.push({ education_index: String(idx++).padStart(2,'0'), qualification:'HSC', specialization:stream, from_year:'', to_year:v('hscYear'), medium:hscMedium, board_university:board, college_school:v('hscSchool'), mode_of_study:'Regular' });
  }
  if (!chk('ugNilChk')) {
    const ugMedium = v('ugMedium') === 'Other' ? v('ugMediumOther') : v('ugMedium');
    rows.push({ education_index: String(idx++).padStart(2,'0'), qualification:v('ugCourse'), specialization:v('ugSpecialization'), from_year:'', to_year:v('ugYear'), medium:ugMedium, board_university:v('ugUniversity'), college_school:v('ugCollege'), mode_of_study:v('ugMode') });
  }
  otherEducationDataArray.forEach(oth => {
    rows.push({ education_index: String(idx++).padStart(2,'0'), qualification:oth.qualification, specialization:'', from_year:'', to_year:oth.year, medium:'', board_university:oth.institute, college_school:'', mode_of_study:'' });
  });
  return rows;
}

// ============================================================
//  BUILD FAMILY ROWS (unchanged)
// ============================================================
function buildFamilyRows() {
  const rows = [];
  const fd   = getFamilyData();

  rows.push({ family_index:'01', family_member:fd.father.name, family_relation:'Father', family_age:fd.father.age, family_occupation:fd.father.occupation, family_location:fd.father.location, family_phone:fd.father.phone, family_marital:fd.father.maritalStatus });
  rows.push({ family_index:'02', family_member:fd.mother.name, family_relation:'Mother', family_age:fd.mother.age, family_occupation:fd.mother.occupation, family_location:fd.mother.location, family_phone:fd.mother.phone, family_marital:fd.mother.maritalStatus });

  fd.otherFamily.forEach((mem, i) => {
    rows.push({ family_index: String(i+3).padStart(2,'0'), family_member:mem.name, family_relation:mem.relationship, family_age:mem.age, family_occupation:mem.occupation, family_location:mem.location||'', family_phone:mem.phone, family_marital:mem.maritalStatus||'' });
  });
  return rows;
}

// ============================================================
//  MAIN SUBMIT (unchanged)
// ============================================================
async function submitCandidateForm(event) {
  event.preventDefault();
  const form = document.getElementById('candidateForm');
  if (!form) return;

  // ── Required file validation ──────────────────────────────
  const aadharFiles = document.getElementById('aadhar_upload')?.files.length > 0;
  const photoFiles  = document.getElementById('photo_upload')?.files.length > 0;
  const resumeFiles = document.getElementById('resume_upload')?.files.length > 0;
  if (!aadharFiles || !photoFiles || !resumeFiles) {
    const missing = [];
    if (!aadharFiles) missing.push('Aadhar Card');
    if (!photoFiles)  missing.push('Passport Photo');
    if (!resumeFiles) missing.push('Resume');
    showToast('⚠️ Please upload: ' + missing.join(', '), 'error', 6000);
    goToStep(5);
    // Scroll to docs section
    setTimeout(() => {
      const docsEl = document.getElementById('section-docs');
      if (docsEl) docsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Open docs accordion if closed
      const docsHeader = docsEl?.querySelector('.accordion-header');
      const docsBody = docsEl?.querySelector('.accordion-body');
      if (docsHeader && docsBody && !docsBody.classList.contains('open')) {
        docsBody.classList.add('open');
        docsHeader.classList.add('open');
      }
    }, 300);
    return;
  }

  // ── All required fields validation ───────────────────────
  for (let s = 1; s <= totalSteps; s++) {
    if (!validateStep(s)) {
      showToast('Please complete all required fields. Step ' + s + ' is incomplete.', 'error', 5000);
      goToStep(s);
      return;
    }
  }

  const experienceStatusEl = document.getElementById('experience_status');
  const experienceStatus   = experienceStatusEl ? experienceStatusEl.value : '';

  if (experienceStatus === 'Experienced' && experienceDataArray.length === 0) {
    showToast('Please add at least ONE Experience entry before submitting', 'error', 5000);
    scrollToSection('section-experience');
    return;
  }

  if (skillsDataArray.length === 0) {
    showToast('Please add at least ONE Skill before submitting', 'error', 5000);
    scrollToSection('section-skills');
    return;
  }

  if (referencesDataArray.length === 0) {
    showToast('Please add at least ONE Reference before submitting', 'error', 5000);
    scrollToSection('section-other');
    return;
  }

  const checkboxGroupsValid = validateCheckboxGroups();

  form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  form.querySelectorAll('.error-label').forEach(el => el.classList.remove('error-label'));

  const isFormValid = form.checkValidity() && checkboxGroupsValid;

  if (!isFormValid) {
    validateCheckboxGroups();
    const invalidFields = Array.from(form.querySelectorAll(':invalid'));
    const errorNotification = document.getElementById('errorNotification');
    const errorList         = document.getElementById('errorList');

    if (errorList) errorList.innerHTML = '';

    invalidFields.forEach((el, index) => {
      el.classList.add('error');
      const id = el.id;
      if (id) {
        const lbl = form.querySelector(`label[for="${id}"]`);
        if (lbl) lbl.classList.add('error-label');
      }
      const fieldLabel = id
        ? (form.querySelector(`label[for="${id}"]`)?.textContent || id)
        : 'Field';
      const fieldLabelClean = fieldLabel.replace(/[*:]$/g, '').trim();
      if (errorList) {
        const listItem = document.createElement('li');
        listItem.textContent = fieldLabelClean + ' is required';
        errorList.appendChild(listItem);
      }

      if (index === 0) {
        if (errorNotification) {
          errorNotification.style.display = 'block';
          errorNotification.scrollIntoView({ behavior:'smooth', block:'start' });
        }
        setTimeout(() => {
          if (el.type !== 'hidden') el.focus();
        }, 300);
      }
    });

    if (errorNotification) errorNotification.style.display = 'block';
    showToast(`${invalidFields.length} field(s) need attention`, 'error', 5000);
    return;
  }

  const errorNotification = document.getElementById('errorNotification');
  if (errorNotification) errorNotification.style.display = 'none';

  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) submitBtn.disabled = true;
  document.getElementById('loadingOverlay').style.display = 'flex';

  try {
    const formData = new FormData(form);

    let selectedSpeak = getCheckedValues('languageSpeak');
    const otherSpeakChecked = document.getElementById('langSpeakOthersChk')?.checked;
    const otherSpeakInput   = document.getElementById('otherSpeak');
    if (otherSpeakChecked && otherSpeakInput?.value.trim()) {
      selectedSpeak = selectedSpeak.filter(v => v !== 'Others');
      selectedSpeak.push(otherSpeakInput.value.trim());
    }

    let selectedWrite = getCheckedValues('languageWrite');
    const otherWriteChecked = document.getElementById('langWriteOthersChk')?.checked;
    const otherWriteInput   = document.getElementById('otherWrite');
    if (otherWriteChecked && otherWriteInput?.value.trim()) {
      selectedWrite = selectedWrite.filter(v => v !== 'Others');
      selectedWrite.push(otherWriteInput.value.trim());
    }

    async function uploadFile(file, folder) {
      const ext      = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabaseClient.storage.from('Onboarding-files').upload(fileName, file, { upsert: false });
      if (error) throw new Error(`File upload failed: ${error.message}`);
      const { data: urlData } = supabaseClient.storage.from('Onboarding-files').getPublicUrl(fileName);
      return urlData.publicUrl;
    }

    async function uploadMultiple(inputId, folder) {
      const input = document.getElementById(inputId);
      if (!input || !input.files.length) return [];
      const urls = [];
      for (const file of input.files) { urls.push(await uploadFile(file, folder)); }
      return urls;
    }

    const [aadharUrls, photoUrls, resumeUrls, docsUrls] = await Promise.all([
      uploadMultiple('aadhar_upload',   'aadhar'),
      uploadMultiple('photo_upload',    'photo'),
      uploadMultiple('resume_upload',   'resume'),
      uploadMultiple('documents_input', 'documents'),
    ]);

    const appNo   = 'PNC-' + Date.now().toString().slice(-6);
    const eduRows = buildEducationRows();
    const famRows = buildFamilyRows();

    const edu0 = eduRows[0]               || {};
    const exp0 = experienceDataArray[0]   || {};
    const sk0  = skillsDataArray[0]       || {};
    const ref0 = referencesDataArray[0]   || {};
    const fam0 = famRows[0]               || {};

    const payload = {
      submitted_at:   new Date().toISOString(),
      application_no: appNo,

      full_name:        formData.get('full_name')         || '',
      dob_year:         formData.get('dob_year')          || '',
      marital_status:   formData.get('marital_status')    || '',
      marriage_year:    document.getElementById('marriage_year')?.value || '',
      applied_post:     formData.get('applied_post')      || '',
      present_address:  formData.get('present_address')   || '',
      permanent_address:formData.get('permanent_address') || '',
      phone_no:         formData.get('phone_no')          || '',
      language_speak:   selectedSpeak.join(', '),
      language_write:   selectedWrite.join(', '),
      know_company:     formData.get('knowCompany')       || '',

      experience_status: formData.get('experience_status') || '',
      total_experience:  document.getElementById('totalExperience')?.value || '',
      experience_index:  exp0.frommonth ? String(experienceDataArray.indexOf(exp0)+1).padStart(2,'0') : '',
      project_name:      exp0.projectname     || '',
      project_location:  exp0.projectlocation || '',
      project_value:     exp0.projectvalue    || '',
      company_name:      exp0.previouscompany || '',
      company_office:    exp0.companyoffice   || '',
      designation:       exp0.designation     || '',
      role:              exp0.role            || '',
      from_month:        exp0.frommonth       || '',
      to_month:          exp0.tomonth         || '',

      education_index:  edu0.education_index  || '',
      qualification:    edu0.qualification    || '',
      specialization:   edu0.specialization   || '',
      from_year:        edu0.from_year        || '',
      to_year:          edu0.to_year          || '',
      medium:           edu0.medium           || '',
      board_university: edu0.board_university || '',
      college_school:   edu0.college_school   || '',
      mode_of_study:    edu0.mode_of_study    || '',

      skill_index:      sk0.skill ? '01' : '',
      skill_name:       sk0.skill       || '',
      skill_proficiency:sk0.proficiency || '',

      willing_tn:                    formData.get('willing_tn')                    || '',
      preferred_place:               formData.get('preferred_place')               || '',
      stay_in_camp:                  formData.get('stay_in_camp')                  || '',
      vehicle_owned:                 formData.get('vehicle_owned')                 || '',
      license_no:                    formData.get('license_no')                    || '',
      health_problem:                formData.get('health_problem')                || '',
      health_problem_details:        formData.get('health_problem_details')        || '',
      physically_challenged:         formData.get('physically_challenged')         || '',
      physically_challenged_details: formData.get('physically_challenged_details') || '',
      reason_for_leaving:            formData.get('reason_for_leaving')            || '',

      reference_index: ref0.name ? '01' : '',
      ref_name:        ref0.name        || '',
      ref_company:     ref0.company     || '',
      ref_designation: ref0.designation || '',
      ref_contact:     ref0.contact     || '',

      family_index:      fam0.family_index      || '',
      family_member:     fam0.family_member     || '',
      family_relation:   fam0.family_relation   || '',
      family_age:        fam0.family_age        || '',
      family_occupation: fam0.family_occupation || '',
      family_location:   fam0.family_location   || '',
      family_phone:      fam0.family_phone      || '',
      family_marital:    fam0.family_marital    || '',

      known_person_name:         formData.get('known_person_name')         || '',
      known_person_relationship: formData.get('known_person_relationship') || '',
      relative_type:             formData.get('relative_type')             || '',
      known_person_project:      formData.get('known_person_project')      || '',

      aadhar_urls:   aadharUrls,
      photo_urls:    photoUrls,
      resume_urls:   resumeUrls,
      document_urls: docsUrls,

      all_education_json:  eduRows,
      all_experience_json: experienceDataArray,
      all_skills_json:     skillsDataArray,
      all_references_json: referencesDataArray,
      all_family_json:     famRows,
    };

    const { error: insertError } = await supabaseClient.from('Onboarding').insert([payload]);
    if (insertError) throw new Error(insertError.message);

    showToast('✅ Application submitted successfully!', 'success', 6000);

    try { localStorage.removeItem(DRAFT_KEY); } catch(e) {}

    form.reset();

    const safeReset = (id) => { const el = document.getElementById(id); if (el) el.innerHTML = ''; };
    const safeVal   = (id) => { const el = document.getElementById(id); if (el) el.value = ''; };

    safeReset('otherEducationPreviewContainer');
    safeReset('otherFamilyPreviewContainer');
    safeReset('skillPreviewContainer');
    safeReset('referencePreview');
    safeReset('experiencePreview');
    safeReset('preview-aadhar');
    safeReset('preview-photo');
    safeReset('preview-resume');
    safeReset('preview-docs');

    ['sslcSchool','sslcYear','hscSchool','hscYear','ugCourse','ugSpecialization','ugCollege','ugUniversity','ugYear','otherQualName','otherQualInstitute','otherQualYear'].forEach(id => safeVal(id));
    ['fatherName','fatherAge','fatherOccupation','fatherLocation','fatherPhone','motherName','motherAge','motherOccupation','motherLocation','motherPhone'].forEach(id => safeVal(id));
    safeVal('totalExperience');

    educationDataArray = experienceDataArray = familyDataArray = skillsDataArray = referencesDataArray = otherFamilyDataArray = otherEducationDataArray = [];
    educationCount = skillCount = otherFamilyCount = otherEducationCount = 0;
    refCount = 1;

    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (error) {
    console.error('Submit error:', error);
    showToast('❌ Error submitting form: ' + error.message, 'error', 8000);
  } finally {
    document.getElementById('loadingOverlay').style.display = 'none';
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) submitBtn.disabled = false;
  }
}

// ============================================================
//  PDF PREVIEW (unchanged)
// ============================================================
function generateProfessionalPDF() {
  const { jsPDF } = window.jspdf;
  if (!jsPDF) { showToast('PDF library not loaded. Please refresh.', 'error'); return; }

  const doc = new jsPDF();
  doc.setFontSize(18); doc.setFont(undefined,'bold');
  doc.text('P&C PROJECTS PRIVATE LIMITED', 105, 15, { align:'center' });
  doc.setFontSize(14);
  doc.text('Candidate Application Form', 105, 23, { align:'center' });
  doc.setFontSize(11); doc.setFont(undefined,'normal');

  let y = 35;
  const fullName      = document.getElementById('full_name')?.value      || 'N/A';
  const dobYear       = document.getElementById('dob_year')?.value        || 'N/A';
  const maritalStatus = document.getElementById('marital_status')?.value  || 'N/A';
  const appliedPost   = document.getElementById('applied_post')?.value    || 'N/A';
  const phoneNo       = document.getElementById('phone_no')?.value        || 'N/A';

  doc.setFont(undefined,'bold'); doc.text('Personal Information', 14, y); y += 7;
  doc.setFont(undefined,'normal');
  doc.text(`Full Name: ${fullName}`,      14, y); y += 6;
  doc.text(`Year of Birth: ${dobYear}`,   14, y); y += 6;
  doc.text(`Marital Status: ${maritalStatus}`, 14, y); y += 6;
  doc.text(`Applied Post: ${appliedPost}`, 14, y); y += 6;
  doc.text(`Phone: ${phoneNo}`,            14, y); y += 10;

  if (educationDataArray.length > 0) {
    doc.setFont(undefined,'bold'); doc.text('Education', 14, y); y += 7;
    doc.setFont(undefined,'normal');
    educationDataArray.forEach((edu, i) => { doc.text(`${i+1}. ${edu.qual} — ${edu.stream} (${edu.from} to ${edu.to})`, 14, y); y += 6; });
    y += 4;
  }
  if (experienceDataArray.length > 0) {
    doc.setFont(undefined,'bold'); doc.text('Experience', 14, y); y += 7;
    doc.setFont(undefined,'normal');
    experienceDataArray.forEach((exp, i) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(`${i+1}. ${exp.previouscompany} — ${exp.designation}`, 14, y); y += 6;
    });
    y += 4;
  }
  if (skillsDataArray.length > 0) {
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFont(undefined,'bold'); doc.text('Skills', 14, y); y += 7;
    doc.setFont(undefined,'normal');
    skillsDataArray.forEach((skill, i) => { doc.text(`${i+1}. ${skill.skill} — ${skill.proficiency}`, 14, y); y += 6; });
  }

  doc.save('Application_Preview.pdf');
  showToast('PDF downloaded ✔', 'success', 3000);
}

// ============================================================
//  AUTO FILL TEST (unchanged)
// ============================================================
function autoFillTest() {
  document.getElementById('full_name').value         = 'Suresh Kumar';
  document.getElementById('dob_year').value          = '1998-06-15';
  document.getElementById('marital_status').value    = 'Single';
  toggleMarriageYear();
  document.getElementById('applied_post').value      = 'Site Engineer';
  document.getElementById('phone_no').value          = '9876543210';
  document.getElementById('present_address').value   = 'No 12, Test Street, Chennai - 600001';
  document.getElementById('permanent_address').value = 'No 12, Test Street, Chennai - 600001';

  document.querySelectorAll('input[name="languageSpeak"]').forEach(cb => { if (['English','Tamil'].includes(cb.value)) cb.checked = true; });
  document.querySelectorAll('input[name="languageWrite"]').forEach(cb => { if (['English','Tamil'].includes(cb.value)) cb.checked = true; });
  document.getElementById('knowCompany').value = 'Reference';

  document.getElementById('experience_status').value = 'Experienced';
  toggleExperienceTable();
  document.getElementById('previouscompany').value   = 'ABC Constructions';
  document.getElementById('companyoffice').value     = 'Chennai';
  document.getElementById('designation').value       = 'Junior Engineer';
  document.getElementById('projectname').value       = 'Metro Project';
  document.getElementById('projectlocation').value   = 'Chennai';
  document.getElementById('projectvalue').value      = '50 Cr';
  document.getElementById('role').value              = 'Site supervision';
  document.getElementById('frommonth').value         = '2020-01';
  document.getElementById('tomonth').value           = '2023-01';
  addExperience();

  document.getElementById('hscSchool').value  = 'Govt Higher Secondary School';
  document.getElementById('hscStream').value  = 'Science';
  document.getElementById('hscBoard').value   = 'State Board';
  document.getElementById('hscMedium').value  = 'Tamil';
  document.getElementById('hscYear').value    = '2015';

  document.getElementById('ugCourse').value         = 'B.E';
  document.getElementById('ugSpecialization').value = 'Civil Engineering';
  document.getElementById('ugCollege').value        = 'XYZ Engineering College';
  document.getElementById('ugUniversity').value     = 'Anna University';
  document.getElementById('ugMode').value           = 'Regular';
  document.getElementById('ugYear').value           = '2020';

  document.getElementById('fatherName').value          = 'Raman Kumar';
  document.getElementById('fatherAge').value           = '55';
  document.getElementById('fatherOccupation').value    = 'Business';
  document.getElementById('fatherMaritalStatus').value = 'Married';
  document.getElementById('fatherLocation').value      = 'Chennai';
  document.getElementById('fatherPhone').value         = '9999999991';

  document.getElementById('motherName').value          = 'Selvi Raman';
  document.getElementById('motherAge').value           = '50';
  document.getElementById('motherOccupation').value    = 'Homemaker';
  document.getElementById('motherMaritalStatus').value = 'Married';
  document.getElementById('motherLocation').value      = 'Chennai';
  document.getElementById('motherPhone').value         = '9999999992';

  document.getElementById('otherRel').value        = 'Brother';
  document.getElementById('otherName').value       = 'Vijay Kumar';
  document.getElementById('otherAge').value        = '28';
  document.getElementById('otherOccupation').value = 'Software Engineer';
  document.getElementById('otherPhone').value      = '9999999993';
  addOtherFamily();

  document.getElementById('skillSelect').value      = 'AutoCAD';
  document.getElementById('skillProficiency').value = 'Good';
  addSkillPreview();

  document.querySelector('[name="willing_tn"]').value          = 'Yes';
  document.querySelector('[name="preferred_place"]').value     = 'Chennai';
  document.querySelector('[name="stay_in_camp"]').value        = 'No';
  document.getElementById('vehicle_owned').value              = 'Two Wheeler';
  document.getElementById('health_problem').value             = 'No';
  document.getElementById('physically_challenged').value      = 'No';
  document.querySelector('[name="reason_for_leaving"]').value = 'Career growth';

  document.querySelector('[name="ref_name[]"]').value        = 'Suresh';
  document.querySelector('[name="ref_company[]"]').value     = 'XYZ Pvt Ltd';
  document.querySelector('[name="ref_designation[]"]').value = 'Manager';
  document.querySelector('[name="ref_contact[]"]').value     = '8888888888';
  addReference();

  document.querySelector('[name="known_person_name"]').value    = 'Karthik';
  document.getElementById('known_person_relationship').value   = 'Friend';
  document.querySelector('[name="known_person_project"]').value = 'Highway Project';

  showToast('✅ Test data filled! Upload files manually.', 'success', 5000);
}

// ============================================================
//  LIVE VALIDATION (unchanged)
// ============================================================
function attachLiveValidation() {
  const form = document.getElementById('candidateForm');
  if (!form) return;

  form.querySelectorAll('input, select, textarea').forEach(el => {
    if (el.willValidate) {
      el.addEventListener('blur', () => validateField(el));
    }
  });
}

// ============================================================
//  DOM CONTENT LOADED (updated)
// ============================================================
document.addEventListener('DOMContentLoaded', function () {

  checkForDraft();
  initCharCounters();
  updateStreamOptions();
  attachLiveValidation();

  const copyBtn = document.getElementById('copyAddressBtn');
  if (copyBtn) {
    copyBtn.addEventListener('change', function() {
      if (this.checked) {
        const present = document.getElementById('present_address').value.trim();
        document.getElementById('permanent_address').value = present;
        validateField(document.getElementById('permanent_address'));
        showToast('Address copied ✔', 'info', 2000);
      } else {
        document.getElementById('permanent_address').value = '';
      }
    });
  }

  const experienceStatus = document.getElementById('experience_status');
  const totalExpField    = document.getElementById('totalExperience');
  if (experienceStatus && totalExpField) {
    experienceStatus.addEventListener('change', function() {
      if (this.value === 'Experienced') {
        totalExpField.setAttribute('required','true');
        totalExpField.setAttribute('aria-required','true');
      } else {
        totalExpField.removeAttribute('required');
        totalExpField.setAttribute('aria-required','false');
      }
    });
  }

  const maritalEl = document.getElementById('marital_status');
  if (maritalEl) maritalEl.addEventListener('change', toggleMarriageYear);

  const vehicleEl = document.getElementById('vehicle_owned');
  if (vehicleEl) vehicleEl.addEventListener('change', function() {
    const show = ['Two Wheeler','Four Wheeler'].includes(this.value);
    const licenseField = document.getElementById('licenseField');
    if (licenseField) licenseField.style.display = show ? 'block' : 'none';
  });

  const healthEl = document.getElementById('health_problem');
  if (healthEl) healthEl.addEventListener('change', function() {
    const healthDetails = document.getElementById('healthDetails');
    if (healthDetails) healthDetails.style.display = this.value === 'Yes' ? 'block' : 'none';
  });

  const physEl = document.getElementById('physically_challenged');
  if (physEl) physEl.addEventListener('change', function() {
    const physicalDetails = document.getElementById('physicalDetails');
    if (physicalDetails) physicalDetails.style.display = this.value === 'Yes' ? 'block' : 'none';
  });

  const knownRelEl = document.getElementById('known_person_relationship');
  if (knownRelEl) knownRelEl.addEventListener('change', function() {
    const relativeDetail = document.getElementById('relativeDetail');
    if (relativeDetail) relativeDetail.style.display = this.value === 'Other' ? 'block' : 'none';
  });

  const langSpeakChk = document.getElementById('langSpeakOthersChk');
  if (langSpeakChk) langSpeakChk.addEventListener('change', function() {
    const otherSpeakGroup = document.getElementById('otherSpeakGroup');
    if (otherSpeakGroup) otherSpeakGroup.style.display = this.checked ? 'block' : 'none';
  });

  const langWriteChk = document.getElementById('langWriteOthersChk');
  if (langWriteChk) langWriteChk.addEventListener('change', function() {
    const otherWriteGroup = document.getElementById('otherWriteGroup');
    if (otherWriteGroup) otherWriteGroup.style.display = this.checked ? 'block' : 'none';
  });

  const qualEl2 = document.getElementById('qual');
  if (qualEl2) qualEl2.addEventListener('change', updateStreamOptions);

  const candidateFormEl = document.getElementById('candidateForm');
  if (candidateFormEl) candidateFormEl.addEventListener('submit', submitCandidateForm);

  const marriageYearEl = document.getElementById('marriage_year');
  if (marriageYearEl) marriageYearEl.max = new Date().getFullYear();

  // Initialise multi-step
  currentStep = 1;
  showStep(1);
});