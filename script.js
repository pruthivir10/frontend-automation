   // Tab switching
    const tabCalendar = document.getElementById('tab-calendar');
    const tabTimer = document.getElementById('tab-timer');
    const modeLabel = document.getElementById('modeLabel');

    function setActiveTab(tab){
      [tabCalendar, tabTimer].forEach(t=>{
        t.classList.toggle('active', t===tab);
        t.setAttribute('aria-selected', t===tab ? 'true' : 'false');
      });
      modeLabel.textContent = tab === tabCalendar ? 'Calendar' : 'Timer';
    }
    tabCalendar.addEventListener('click', ()=>setActiveTab(tabCalendar));
    tabTimer.addEventListener('click', ()=>setActiveTab(tabTimer));

    // Counter & states
    const textarea = document.getElementById('message');
    const counter = document.getElementById('counter');
    const MAX = textarea.maxLength;

    function updateCounter(){
      const len = textarea.value.length;
      counter.textContent = `${len} / ${MAX}`;
      counter.className = 'counter ' + (len >= MAX ? 'max' : len > MAX*0.85 ? 'warn' : 'ok');
    }
    textarea.addEventListener('input', updateCounter);
    updateCounter();

    // Templates popover
    const tplBtn = document.getElementById('tplBtn');
    const tplMenu = document.getElementById('tplMenu');

    tplBtn.addEventListener('click', ()=>{
      tplMenu.classList.toggle('open');
    });
    document.addEventListener('click', (e)=>{
      if(!tplMenu.contains(e.target) && e.target !== tplBtn){
        tplMenu.classList.remove('open');
      }
    });
    document.querySelectorAll('.tpl').forEach(item=>{
      item.addEventListener('click', ()=>{
        textarea.value = item.getAttribute('data-fill');
        updateCounter();
        tplMenu.classList.remove('open');
        textarea.focus();
      });
    });

    // AI Suggest (mock generator)
    const aiBtn = document.getElementById('aiBtn');
    const samples = [
      "Hi {{name}}, just a reminder about your schedule on {{date}}. Need to adjust? Reply RESCHEDULE.",
      "Hello {{name}} — your {{company}} trial ends on {{date}}. Want an extension? Reply EXTEND.",
      "Hey {{name}}! Quick update on {{product}}: new features go live on {{date}}. Read more: {{link}}.",
      "Hi {{name}}, thanks for being with {{company}}. Can you rate your experience (1–5)? It helps us improve."
    ];
    function pick(arr){ return arr[Math.floor(Math.random()*arr.length)] }

    function generateMessage(seed){
      // simple, deterministic-ish mock “AI” using seed
      const base = pick(samples);
      if(seed && seed.length>10){
        return base.replace("{{link}}","{{helpLink}}").replace("update","update regarding your request");
      }
      return base;
    }
    aiBtn.addEventListener('click', ()=>{
      const current = textarea.value.trim();
      const suggestion = generateMessage(current);
      textarea.value = suggestion;
      updateCounter();
      textarea.focus();
    });

    // Keyboard shortcut: Ctrl/Cmd + I triggers AI Suggest
    document.addEventListener('keydown', (e)=>{
      if((e.ctrlKey || e.metaKey) && (e.key.toLowerCase()==='i')){
        e.preventDefault();
        aiBtn.click();
      }
    });

    // Clear
    document.getElementById('clearBtn').addEventListener('click', ()=>{
      textarea.value = '';
      updateCounter();
      textarea.focus();
    });

    /*
      —— Hooking up to your real AI backend ——
      Replace generateMessage() + aiBtn handler with a fetch to your API:

      aiBtn.addEventListener('click', async ()=>{
        aiBtn.disabled = true; aiBtn.textContent = 'Generating…';
        try{
          const res = await fetch('/api/generate', {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({
              prompt: textarea.value,
              mode: tabCalendar.classList.contains('active') ? 'calendar' : 'timer'
            })
          });
          const data = await res.json();
          textarea.value = data.message;
        } finally {
          aiBtn.disabled = false; aiBtn.textContent = '⚡ AI Suggest';
          updateCounter(); textarea.focus();
        }
      });
    */
