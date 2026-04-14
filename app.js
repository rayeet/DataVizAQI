let appData = {
  constants: {
    "ventilation": { "rest_rate_lph": 550, "walking_rate_lph": 900, "cycling_rate_lph": 2400 },
    "deposition": { "pm25_fraction": 0.27 },
    "indoor_outdoor": { "indoor_pm25_ratio_no_purifier": 0.50, "indoor_pm25_ratio_hepa_h13": 0.005, "indoor_pm25_ratio_hepa_standard": 0.03, "indoor_pm25_ratio_budget_hepa": 0.10 },
    "equivalents": { "cigarette_pm25_mg": 12 }
  },
  pm25: {
    "data": [
      { "year": 2010, "annual_avg": 122 }, { "year": 2011, "annual_avg": 128 }, { "year": 2012, "annual_avg": 131 },
      { "year": 2013, "annual_avg": 135 }, { "year": 2014, "annual_avg": 139 }, { "year": 2015, "annual_avg": 143 },
      { "year": 2016, "annual_avg": 136 }, { "year": 2017, "annual_avg": 141 }, { "year": 2018, "annual_avg": 113 },
      { "year": 2019, "annual_avg": 107 }, { "year": 2020, "annual_avg": 92 }, { "year": 2021, "annual_avg": 108 },
      { "year": 2022, "annual_avg": 112 }, { "year": 2023, "annual_avg": 109 }, { "year": 2024, "annual_avg": 106 }
    ]
  },
  shield: {
    "purifier_tiers": [
      { "id": "budget", "annual_cost_inr": 9000 },
      { "id": "mid", "annual_cost_inr": 18000 },
      { "id": "premium", "annual_cost_inr": 52000 }
    ]
  },
  workers: {
    "personas": [
      {
        "id": "gig_delivery",
        "label": "Gig delivery worker",
        "receipt_descriptor": "Swiggy / Zomato rider",
        "commute_pm25_ugm3": 148,
        "no2_exhaust_ugm3": 92,
        "indoor_pm25_ugm3": 74,
        "outdoor_pm25_ugm3": 148,
        "weighted_daily_exposure_ugm3": 98.4,
        "cigarette_equivalent_per_day": 4.5,
        "life_expectancy_loss_years": 12.6,
        "monthly_income_inr": 18000,
        "health_insurance": "None",
        "disease_heart_pct": 27, "disease_stroke_pct": 26, "disease_copd_pct": 24, "disease_lung_cancer_pct": 20,
        "privilege_rank": "BOTTOM 18%"
      },
      {
        "id": "house_help",
        "label": "House help",
        "receipt_descriptor": "Domestic / household worker",
        "commute_pm25_ugm3": 106,
        "no2_exhaust_ugm3": null,
        "indoor_pm25_ugm3": 89,
        "outdoor_pm25_ugm3": 106,
        "weighted_daily_exposure_ugm3": 82.1,
        "cigarette_equivalent_per_day": 3.7,
        "life_expectancy_loss_years": 10.8,
        "monthly_income_inr": 12000,
        "health_insurance": "None",
        "disease_heart_pct": 25, "disease_stroke_pct": 25, "disease_copd_pct": 22, "disease_lung_cancer_pct": 18,
        "privilege_rank": "BOTTOM 22%"
      },
      {
        "id": "security_guard",
        "label": "Security guard",
        "receipt_descriptor": "Residential / commercial guard",
        "commute_pm25_ugm3": 112,
        "no2_exhaust_ugm3": null,
        "indoor_pm25_ugm3": 95,
        "outdoor_pm25_ugm3": 112,
        "weighted_daily_exposure_ugm3": 103.6,
        "cigarette_equivalent_per_day": 4.7,
        "life_expectancy_loss_years": 11.2,
        "monthly_income_inr": 14000,
        "health_insurance": "Basic ESIC",
        "disease_heart_pct": 28, "disease_stroke_pct": 27, "disease_copd_pct": 25, "disease_lung_cancer_pct": 21,
        "privilege_rank": "BOTTOM 20%"
      },
      {
        "id": "street_vendor",
        "label": "Street vendor",
        "receipt_descriptor": "Roadside / market vendor",
        "commute_pm25_ugm3": 138,
        "no2_exhaust_ugm3": 78,
        "indoor_pm25_ugm3": null,
        "outdoor_pm25_ugm3": 138,
        "weighted_daily_exposure_ugm3": 126.4,
        "cigarette_equivalent_per_day": 5.7,
        "life_expectancy_loss_years": 13.1,
        "monthly_income_inr": 9000,
        "health_insurance": "None",
        "disease_heart_pct": 32, "disease_stroke_pct": 31, "disease_copd_pct": 28, "disease_lung_cancer_pct": 24,
        "privilege_rank": "BOTTOM 25%"
      }
    ]
  }
};

let state = {
  user: { cost: 0, pmInhaled: 0, cigs: 0, lifeLost: 0, exposureAvg: 0 },
  workers: [],
  workerStats: null
};

// Start directly since data is statically attached
function init() {
  startPhase1();
}

// 2. Phase 1 Mechanics
const questions = ['q_years', 'q_outdoors', 'q_purifier', 'q_work_purifier', 'q_commute', 'q_commute_time', 'q_worker'];
let currentQIndex = 0;

function startPhase1() {
  setTimeout(() => { showNextQuestion(); }, 100);

  function attemptAdvanceYears() {
    const el = document.getElementById('input_years');
    const warn = document.getElementById('warn_years');
    if (el.value) {
      if (parseInt(el.value) >= 40) {
        warn.style.opacity = '1';
      } else {
        warn.style.opacity = '0';
        advanceQuestion();
      }
    }
  }

  function attemptAdvanceOutdoors() {
    const el = document.getElementById('input_outdoors');
    const warn = document.getElementById('warn_outdoors');
    if (el.value) {
      if (parseFloat(el.value) > 24) {
        warn.style.opacity = '1';
      } else {
        warn.style.opacity = '0';
        advanceQuestion();
      }
    }
  }

  function attemptAdvanceCommuteTime() {
    const el = document.getElementById('input_commute_time');
    const warn = document.getElementById('warn_commute_time');
    if (el.value) {
      if (parseFloat(el.value) > 24) {
        warn.style.opacity = '1';
      } else {
        warn.style.opacity = '0';
        advanceQuestion();
      }
    }
  }

  function handleEnter(e) {
    if((e.key === 'Enter' || e.keyCode === 13) && e.target.value) {
      e.target.blur(); 
      if (e.target.id === 'input_years') attemptAdvanceYears();
      else if (e.target.id === 'input_outdoors') attemptAdvanceOutdoors();
      else if (e.target.id === 'input_commute_time') attemptAdvanceCommuteTime();
      else advanceQuestion();
    }
  }

  document.getElementById('input_years').addEventListener('keydown', handleEnter);
  document.getElementById('input_outdoors').addEventListener('keydown', handleEnter);
  document.getElementById('input_commute_time').addEventListener('keydown', handleEnter);
  
  document.getElementById('input_years').addEventListener('blur', (e) => {
    if (e.target.value && currentQIndex === 0) {
      if (parseInt(e.target.value) >= 40) document.getElementById('warn_years').style.opacity = '1';
      else { document.getElementById('warn_years').style.opacity = '0'; advanceQuestion(); }
    }
  });
  document.getElementById('input_outdoors').addEventListener('blur', (e) => {
    if (e.target.value && currentQIndex === 1) {
      if (parseFloat(e.target.value) > 24) document.getElementById('warn_outdoors').style.opacity = '1';
      else { document.getElementById('warn_outdoors').style.opacity = '0'; advanceQuestion(); }
    }
  });

  document.getElementById('input_commute_time').addEventListener('blur', (e) => {
    if (e.target.value && currentQIndex === 5) {
      if (parseFloat(e.target.value) > 24) document.getElementById('warn_commute_time').style.opacity = '1';
      else { document.getElementById('warn_commute_time').style.opacity = '0'; advanceQuestion(); }
    }
  });

  document.querySelectorAll('#input_home_purifier_options .t-option').forEach(opt => {
    opt.addEventListener('click', (e) => {
      document.getElementById('input_home_purifier').value = e.target.getAttribute('data-value');
      advanceQuestion();
    });
  });

  document.querySelectorAll('#input_work_purifier_options .t-option').forEach(opt => {
    opt.addEventListener('click', (e) => {
      document.getElementById('input_work_purifier').value = e.target.getAttribute('data-value');
      advanceQuestion();
    });
  });

  document.querySelectorAll('#input_commute_options .t-option').forEach(opt => {
    opt.addEventListener('click', (e) => {
      document.getElementById('input_commute').value = e.target.getAttribute('data-value');
      advanceQuestion();
    });
  });

  let selectedWorkers = [];
  const workerConfirmBtn = document.getElementById('btn_worker_confirm');
  
  workerConfirmBtn.addEventListener('click', () => {
    if (selectedWorkers.length > 0) {
      document.getElementById('input_worker').value = selectedWorkers.join(',');
      advanceQuestion();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && currentQIndex === 6) {
      if (selectedWorkers.length > 0) {
        document.getElementById('input_worker').value = selectedWorkers.join(',');
        advanceQuestion();
      }
    }
  });

  document.querySelectorAll('#input_worker_options .t-option').forEach(opt => {
    opt.addEventListener('click', (e) => {
      const val = e.target.getAttribute('data-value');
      if (selectedWorkers.includes(val)) {
        selectedWorkers = selectedWorkers.filter(v => v !== val);
        e.target.classList.remove('active-option');
      } else {
        selectedWorkers.push(val);
        e.target.classList.add('active-option');
      }
      
      if (selectedWorkers.length > 0) {
        workerConfirmBtn.style.display = 'inline-block';
        setTimeout(() => workerConfirmBtn.style.opacity = '1', 50);
      } else {
        workerConfirmBtn.style.opacity = '0';
        setTimeout(() => workerConfirmBtn.style.display = 'none', 300);
      }
    });
  });
}

function showNextQuestion() {
  if (currentQIndex < questions.length) {
    const qEl = document.getElementById(questions[currentQIndex]);
    qEl.style.display = 'flex';
    setTimeout(() => {
      qEl.style.opacity = '1';
      const input = qEl.querySelector('input, select');
      if (input) input.focus();
      
      const options = qEl.querySelectorAll('.t-option');
      options.forEach((opt, idx) => {
        setTimeout(() => { opt.style.opacity = '1'; opt.style.transform = 'translateY(0)'; }, idx * 80);
      });
    }, 50);
  } else {
    document.getElementById('p1-title-screen').style.opacity = '0';
    setTimeout(() => {
      document.getElementById('p1-title-screen').style.display = 'none';
      calculateAudit();
      const choice = document.getElementById('input_worker').value || 'gig_delivery';
      const choices = choice.split(',');
      state.workers = appData.workers.personas.filter(p => choices.includes(p.id));
      if (state.workers.length === 0) {
         state.workers = [appData.workers.personas[0]];
      }
      goToPhase3();
    }, 800);
  }
}

let isAdvancing = false;
function advanceQuestion() {
  if (isAdvancing) return;
  isAdvancing = true;
  const oldQ = document.getElementById(questions[currentQIndex]);
  oldQ.style.opacity = '0';
  setTimeout(() => {
    oldQ.style.display = 'none';
    currentQIndex++;
    isAdvancing = false;
    showNextQuestion();
  }, 800);
}

function calculateAudit() {
  let yearsInDelhi = parseInt(document.getElementById('input_years').value) || 1;
  if (yearsInDelhi > 40) yearsInDelhi = 40;
  let outdoors = parseFloat(document.getElementById('input_outdoors').value) || 0;
  let commuteHours = parseFloat(document.getElementById('input_commute_time').value) || 0;
  let homePurifier = document.getElementById('input_home_purifier').value || 'none';
  let workPurifier = document.getElementById('input_work_purifier').value || 'none';
  let commuteModeVal = document.getElementById('input_commute').value || 'ac_car';
  let commuteModeString = 'Personal AC Car';
  let commuteMult = 0.25;
  if(commuteModeVal === 'metro') { commuteModeString = 'Metro / AC Cab'; commuteMult = 0.5; }
  if(commuteModeVal === 'auto') { commuteModeString = 'Auto / Bus / Two-wheeler'; commuteMult = 1.2; }

  let totalDepositedUg = 0;
  let annualShieldCost = appData.shield.purifier_tiers.find(p => p.id === homePurifier)?.annual_cost_inr || 0;

  function getTierKey(tierName) {
    if(tierName === 'budget') return 'budget_hepa';
    if(tierName === 'premium') return 'hepa_h13';
    if(tierName === 'mid') return 'hepa_standard';
    return 'no_purifier';
  }

  let indoorRatioHome = appData.constants.indoor_outdoor["indoor_pm25_ratio_" + getTierKey(homePurifier)] || 0.50;
  let indoorRatioWork = appData.constants.indoor_outdoor["indoor_pm25_ratio_" + getTierKey(workPurifier)] || 0.50;
  let depFraction = appData.constants.deposition.pm25_fraction;

  let workHours = Math.min(8, Math.max(0, 24 - outdoors - commuteHours));
  let homeHours = Math.max(0, 24 - outdoors - workHours - commuteHours);
  let currentYear = 2024;
  let avgWeightedExposure = 0;

  for (let i = 0; i < yearsInDelhi; i++) {
    const yrList = appData.pm25.data;
    let pmData = yrList.find(d => d.year === (currentYear - i)) || yrList[0];
    const pm25 = pmData.annual_avg;

    let dailyOutUg = (appData.constants.ventilation.rest_rate_lph * outdoors / 1000) * pm25;
    let pm25IndoorHome = pm25 * indoorRatioHome;
    let pm25IndoorWork = pm25 * indoorRatioWork;
    let pm25Commute = pm25 * commuteMult;
    
    let dailyHomeUg = (appData.constants.ventilation.rest_rate_lph * homeHours / 1000) * pm25IndoorHome;
    let dailyWorkUg = (appData.constants.ventilation.rest_rate_lph * workHours / 1000) * pm25IndoorWork;
    let dailyCommuteUg = (appData.constants.ventilation.rest_rate_lph * commuteHours / 1000) * pm25Commute;

    totalDepositedUg += (dailyOutUg + dailyHomeUg + dailyWorkUg + dailyCommuteUg) * depFraction * 365;

    if (i === 0) {
      avgWeightedExposure = ((outdoors * pm25) + (homeHours * pm25IndoorHome) + (workHours * pm25IndoorWork) + (commuteHours * pm25Commute)) / 24;
    }
  }

  const pm25_2024 = appData.pm25.data.find(d => d.year === 2024).annual_avg;
  let cigsPerDay = avgWeightedExposure / 22;

  let computedCommutePm25 = pm25_2024 * commuteMult;

  let ansYearsLost = ((avgWeightedExposure - 5) / 10) * 0.98 * (yearsInDelhi / 70);

  state.envParams = {
    outdoorsTime: outdoors, homeHours: homeHours, workHours: workHours,
    pm25Outdoor: pm25_2024, pm25Home: pm25_2024 * indoorRatioHome, pm25Work: pm25_2024 * indoorRatioWork,
    weightedAvg: avgWeightedExposure, cost: annualShieldCost, commuteMode: commuteModeString, commutePm25: computedCommutePm25,
    yearsInDelhi: yearsInDelhi
  };
  state.user.exposureAvg = Number(avgWeightedExposure.toFixed(1));
  state.user.cigs = cigsPerDay.toFixed(1);
  state.user.lifeLost = ansYearsLost;
}

function goToPhase3() {
  document.getElementById('phase1').classList.remove('active');
  setTimeout(() => {
    const p3 = document.getElementById('phase3');
    p3.style.visibility = 'visible';
    p3.style.pointerEvents = 'auto';
    p3.classList.add('active');

    buildReceipt();

    setTimeout(() => {
      document.getElementById('thread_line').classList.add('draw');
      document.getElementById('receipt_section').style.opacity = '1';

      setTimeout(() => {
        const outro = document.querySelector('.receipt-outro');
        const footer = document.querySelector('.sources-footer');
        if (outro) outro.style.opacity = '1';
        if (footer) footer.style.opacity = '1';
      }, 1400); 
    }, 800);
  }, 700);
}

function getAsciiBar(val, max = 100, chars = 25) {
  const filled = Math.min(chars, Math.max(0, Math.round((val / max) * chars)));
  return '█'.repeat(filled) + '▒'.repeat(chars - filled);
}

function buildReceipt() {
  const uEnv = state.envParams;
  const c = document.getElementById('user_receipt_container');
  c.innerHTML = \`
    <div class="thread" id="thread_line"></div>
    <div class="receipt-col">
      <div class="receipt-header">PERSONAL AIR EXPOSURE RECEIPT</div>
      <div class="receipt-section-title">Daily exposure profile (PM2.5)</div>
      <div class="receipt-row">
        <span class="r-title">Home Exposure - \${uEnv.pm25Home.toFixed(1)} µg/m³</span>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:10px; color:#000;">GOOD</span>
          <span class="receipt-bar">\${getAsciiBar(uEnv.pm25Home)}</span>
          <span style="font-size:10px; color:#000;">POOR</span>
        </div>
      </div>
      <div class="receipt-row">
        <span class="r-title">Work Exposure - \${uEnv.pm25Work.toFixed(1)} µg/m³</span>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:10px; color:#000;">GOOD</span>
          <span class="receipt-bar">\${getAsciiBar(uEnv.pm25Work)}</span>
          <span style="font-size:10px; color:#000;">POOR</span>
        </div>
      </div>
      <div class="receipt-row">
        <span class="r-title">Outdoor Exposure - \${uEnv.pm25Outdoor.toFixed(1)} µg/m³</span>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:10px; color:#000;">GOOD</span>
          <span class="receipt-bar">\${getAsciiBar(uEnv.pm25Outdoor)}</span>
          <span style="font-size:10px; color:#000;">POOR</span>
        </div>
      </div>
      <div class="receipt-row">
        <span class="r-title">Commute - \${uEnv.commutePm25.toFixed(1)} µg/m³</span>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:10px; color:#000;">GOOD</span>
          <span class="receipt-bar">\${getAsciiBar(uEnv.commutePm25)}</span>
          <span style="font-size:10px; color:#000;">POOR</span>
        </div>
      </div>
      <div class="receipt-row">
        <span class="r-title">Weighted daily exposure - \${state.user.exposureAvg.toFixed(1)} μg/m³</span>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:10px; color:#000;">GOOD</span>
          <span class="receipt-bar">\${getAsciiBar(state.user.exposureAvg)}</span>
          <span style="font-size:10px; color:#000;">POOR</span>
        </div>
      </div>

      <div class="receipt-section-title">Cumulative</div>
      <div class="receipt-row"><span class="r-title">Cigarette equivalent/day</span><span class="r-val">\${state.user.cigs}</span></div>
      <div class="receipt-row"><span class="r-title">Disease risk - low</span></div>

      <div class="receipt-section-title">Final</div>
      <div class="receipt-row"><span class="r-title">PRIVILEGE RANK</span><span class="r-val" style="color:#8A9E8B;">TOP 12%</span></div>

      <div class="receipt-box-left">
        You are among a small minority in Delhi who can afford to be less exposed to air pollution. The systems that protect you are out of reach for most.
      </div>
    </div>
  \`;
}

// Thermal Printer Implementation
function formatThermalReceipt(worker) {
  const line = () => '-'.repeat(32) + '\\n';
  const pad = (left, right) => {
    let str = left;
    let spaces = 32 - left.length - right.length;
    if (spaces < 1) spaces = 1;
    return str + ' '.repeat(spaces) + right + '\\n';
  };
  const center = (text) => {
    let spaces = Math.max(0, Math.floor((32 - text.length) / 2));
    return ' '.repeat(spaces) + text + '\\n';
  };

  let out = '';
  out += center('EXPOSURE BILL - UNPAID') + '\\n';
  out += center(worker.receipt_descriptor) + '\\n';
  out += line();
  
  out += 'DAILY EXPOSURE PROFILE OF\\n';
  out += 'THE PERSON WHO:\\n';
  if (worker.id === 'gig_delivery') {
    out += 'DELIVERS YOUR FOOD & GROCERIES\\n';
  } else if (worker.id === 'house_help') {
    out += 'HELPS RUN YOUR HOME\\n';
  } else if (worker.id === 'security_guard') {
    out += 'GUARDS YOUR BUILDING\\n';
  } else if (worker.id === 'street_vendor') {
    out += 'SELLS YOU THINGS ON THE STREET\\n';
  }
  out += line();
  
  out += center(\`Commute - \${worker.commute_pm25_ugm3} ug/m3\`) + '\\n';
  out += center(getAsciiBar(worker.commute_pm25_ugm3, 100, 25)) + '\\n';
  if (worker.indoor_pm25_ugm3) {
    out += center(\`Indoor - \${worker.indoor_pm25_ugm3} ug/m3\`) + '\\n';
    out += center(getAsciiBar(worker.indoor_pm25_ugm3, 100, 25)) + '\\n';
  }
  out += center(\`Outdoor - \${worker.outdoor_pm25_ugm3} ug/m3\`) + '\\n';
  out += center(getAsciiBar(worker.outdoor_pm25_ugm3, 100, 25)) + '\\n';
  if (worker.no2_exhaust_ugm3 !== null) {
      out += center(\`NO2 Exhaust - \${worker.no2_exhaust_ugm3} ug/m3\`) + '\\n';
  }
  out += center(\`Total Weighted - \${worker.weighted_daily_exposure_ugm3.toFixed(1)} ug/m3\`) + '\\n';
  out += center(getAsciiBar(worker.weighted_daily_exposure_ugm3, 100, 25)) + '\\n';
  out += line();

  out += 'CUMULATIVE TOLL\\n';
  out += pad('Cigarettes/day:', \`\${worker.cigarette_equivalent_per_day}\`);
  out += pad('Disease Risk:', \`Heart Disease\`);
  out += pad('             ', \`Lung Cancer\`);
  out += line();
  
  out += 'FINAL RANK\\n';
  out += pad('PRIVILEGE:', worker.privilege_rank);
  out += line();
  
  out += '\\nBecause they cannot afford\\n';
  out += 'to filter their air, this\\n';
  out += 'worker absorbs the full\\n';
  out += 'toxicity of the city.\\n';
  out += 'Clean air is a luxury good.\\n\\n\\n\\n\\n\\n';
  
  return out;
}

// Commented out hardware thermal printer implementation
/*
document.getElementById('print_btn').addEventListener('click', async () => {
  if (!("serial" in navigator)) {
     alert("Web Serial API is not fully supported in your browser. Please try Chrome, Edge, or Opera.");
     return;
  }
  try {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    const writer = port.writable.getWriter();
    const encoder = new TextEncoder();
    
    // Format the worker's text based on the 32 char thermal paper width
    const textStr = formatThermalReceipt(state.worker);
    
    await writer.write(encoder.encode(textStr));
    writer.releaseLock();
    await port.close();
    
    // Show the congratulations message on-screen!
    const printMessage = document.getElementById('print_message');
    printMessage.innerHTML = "You are exposed to higher pollution levels due to limited access to protective infrastructure.";
    printMessage.style.color = "red";
    printMessage.style.borderLeftColor = "red";
    printMessage.classList.add('show');
    
  } catch (err) {
    console.error("Printer connection failed:", err);
    // Even if it failed, for testing purposes, we can uncomment the below
    // to show the message. But generally, only show if it succeeded.
    // const printMessage = document.getElementById('print_message');
    // printMessage.innerHTML = "You are exposed to higher pollution levels due to limited access to protective infrastructure.";
    // printMessage.style.color = "red";
    // printMessage.style.borderLeftColor = "red";
    // printMessage.classList.add('show');
    alert("Connection to printer failed or was cancelled.");
  }
});
*/

// Download as PNG implementation with matching UI elements
document.getElementById('print_btn').addEventListener('click', async () => {
  for (let i = 0; i < state.workers.length; i++) {
    const worker = state.workers[i];
    
    const canvas = document.createElement('canvas');
    // 4x6 portrait print ratio (101.6mm x 152.4mm / ~254 DPI)
    canvas.width = 1016; 
    canvas.height = 1524;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // UI Layout Borders simulating .receipt-col
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 10;
    ctx.strokeRect(32, 32, canvas.width - 64, canvas.height - 64);
    ctx.lineWidth = 4;
    ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);
    
    let yOffset = 140;
    const leftX = 96;
    
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    // Header (.receipt-header)
    ctx.fillStyle = '#000000';
    ctx.font = '28px monospace';
    ctx.fillText('EXPOSURE BILL - UNPAID', leftX, yOffset);
    yOffset += 40;
    ctx.fillText((worker.receipt_descriptor || '').toUpperCase(), leftX, yOffset);
    yOffset += 48;
    
    ctx.beginPath();
    ctx.moveTo(96, yOffset);
    ctx.lineTo(canvas.width - 96, yOffset);
    ctx.lineWidth = 2;
    ctx.stroke();
    yOffset += 48;
    
    function drawSectionTitle(title) {
      ctx.font = 'normal 30px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#000000';
      ctx.letterSpacing = '3px';
      ctx.fillText(title.toUpperCase(), leftX, yOffset);
      ctx.letterSpacing = '0px';
      yOffset += 56;
    }
    
    function drawRow(titleWithVal, valExtra, barStr, isFinal) {
      ctx.font = '33px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#555555';
      ctx.fillText(titleWithVal, leftX, yOffset);
      yOffset += 40;
      
      if (valExtra) {
        ctx.fillStyle = isFinal ? '#8F6B6B' : '#000000';
        ctx.fillText(valExtra, leftX, yOffset);
        yOffset += 40;
      }
      
      if (barStr) {
        ctx.font = '24px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#000000';
        ctx.fillText('GOOD', leftX, yOffset + 4);
        
        let goodWidth = ctx.measureText('GOOD').width;
        let pad = 12;
        let barX = leftX + goodWidth + pad;

        ctx.font = '30px "Courier New", Consolas, monospace';
        ctx.letterSpacing = '6px';
        
        ctx.save();
        ctx.beginPath();
        // Clip to create the thin bar appearance
        ctx.rect(barX, yOffset, canvas.width, 16); 
        ctx.clip();
        ctx.fillText(barStr, barX, yOffset);
        ctx.restore();
        
        let barWidth = ctx.measureText(barStr).width;
        let poorX = barX + barWidth + pad;
        
        ctx.font = '24px "Space Grotesk", sans-serif';
        ctx.letterSpacing = '0px';
        ctx.fillText('POOR', poorX, yOffset + 4);

        yOffset += 16 + 24; 
      }
      yOffset += 12;
    }
    
    // Category 1
    drawSectionTitle('Daily exposure profile (PM2.5)');
    drawRow(\`Commute - \${worker.commute_pm25_ugm3} µg/m³\`, null, getAsciiBar(worker.commute_pm25_ugm3));
    if (worker.indoor_pm25_ugm3) {
      drawRow(\`Indoor - \${worker.indoor_pm25_ugm3} µg/m³\`, null, getAsciiBar(worker.indoor_pm25_ugm3));
    }
    drawRow(\`Outdoor - \${worker.outdoor_pm25_ugm3} µg/m³\`, null, getAsciiBar(worker.outdoor_pm25_ugm3));
    if (worker.no2_exhaust_ugm3 !== null) {
      drawRow(\`NO2 Exhaust - \${worker.no2_exhaust_ugm3} µg/m³\`, null, null);
    }
    drawRow(\`Weighted daily exposure - \${worker.weighted_daily_exposure_ugm3.toFixed(1)} µg/m³\`, null, getAsciiBar(worker.weighted_daily_exposure_ugm3));
    
    yOffset += 24;
    
    // Category 2
    drawSectionTitle('Cumulative');
    drawRow('Cigarette equivalent/day', \`\${worker.cigarette_equivalent_per_day}\`, null);
    const risks = [];
    if(worker.disease_heart_pct) risks.push(\`Heart Disease\`);
    if(worker.disease_lung_cancer_pct) risks.push(\`Lung Cancer\`);
    drawRow('Elevated disease risk', risks.join(', '), null);
    
    yOffset += 24;
    
    // Category 3
    drawSectionTitle('Final');
    drawRow('PRIVILEGE RANK', worker.privilege_rank, null, true);
    
    // Conclusion Box (.receipt-box-right)
    yOffset += 32;
    const boxMargin = 96;
    const boxPad = 48;
    const boxText = "Because they cannot afford to filter their air, this worker absorbs the full toxicity of the city. Clean air is a luxury good.";
    
    // Wrap
    const words = boxText.split(' ');
    let line = '';
    const linesArr = [];
    ctx.font = '33px "Space Grotesk", sans-serif';
    for(let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      let metrics = ctx.measureText(testLine);
      if (metrics.width > (canvas.width - boxMargin*2 - boxPad*2) && n > 0) {
        linesArr.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    linesArr.push(line);
    
    ctx.fillStyle = '#000000';
    let ty = yOffset + boxPad;
    linesArr.forEach(l => {
      ctx.fillText(l.trim(), leftX, ty);
      ty += 48;
    });
    
    const link = document.createElement('a');
    link.download = \`Receipt download/exposure_receipt_\${worker.id}_\${Date.now()}.png\`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    await new Promise(r => setTimeout(r, 600)); // Delay between downloads
  }

  
  // Show the brutalist congratulations message on-screen
  const printMessage = document.getElementById('print_message');
  printMessage.innerHTML = "Thank you for your contribution. This person's lungs have been charged accordingly.";
  printMessage.style.color = "red";
  printMessage.style.borderLeftColor = "red";
  printMessage.classList.add('show');
});

// Kickoff
init();