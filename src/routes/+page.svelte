<script lang="ts">
  import { onMount } from 'svelte';
  
  let phone = '';
  let scheduledTime = '';
  let status = '';
  let loading = false;
  let mysticalPhrase = '';
  let mouseX = 0;
  let mouseY = 0;
  let currentHour = 0;
  let showEasterEgg = false;
  
  const mysticalPhrases = [
    'Time whispers in spirals...',
    'The clock ticks backwards in dreams...',
    'What is time but a jazz riff in the void?',
    'Tick... tock... or is it tock... tick?',
    'In the quantum realm, now is always...',
    'Ken Nordine knows what time it isn\'t...',
    'Between seconds, infinity breathes...',
    'The fourth dimension winks at you...',
    'Chronos laughed, and time bent...',
    'Your future self sends regards...'
  ];
  
  onMount(() => {
    mysticalPhrase = mysticalPhrases[Math.floor(Math.random() * mysticalPhrases.length)];
    currentHour = new Date().getHours();
    
    // Rotate mystical phrase every 8 seconds
    const phraseInterval = setInterval(() => {
      mysticalPhrase = mysticalPhrases[Math.floor(Math.random() * mysticalPhrases.length)];
    }, 8000);
    
    return () => clearInterval(phraseInterval);
  });
  
  function handleMouseMove(e: MouseEvent) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }
  
  function handleTitleClick() {
    showEasterEgg = !showEasterEgg;
    setTimeout(() => showEasterEgg = false, 3000);
  }

  // Basic client-side validation
  function validateForm(): string | null {
    if (!phone || phone.trim() === '') {
      return 'The void awaits... but first, a phone number';
    }
    
    if (!scheduledTime) {
      return 'Time itself needs coordinates, friend';
    }
    
    // Check if time is in the past
    const scheduled = new Date(scheduledTime);
    const now = new Date();
    
    if (scheduled < now) {
      return 'Even Ken Nordine can\'t call into yesterday...';
    }
    
    return null;
  }

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    
    // Client-side validation
    const validationError = validateForm();
    if (validationError) {
      status = validationError;
      return;
    }
    
    loading = true;
    const loadingPhrases = [
      'Consulting the cosmic calendar...',
      'Winding the metaphysical clock...',
      'Tuning into the frequency of tomorrow...',
      'Setting the coordinates in spacetime...',
      'Whispering to the future...'
    ];
    status = loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)];

    try {
      const res = await fetch('/api/schedule-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toNumber: phone,
          scheduledAt: new Date(scheduledTime).toISOString()
        })
      });

      if (res.ok) {
        const successPhrases = [
          "The ritual is complete. Ken will find you in the timestream...",
          "A voice from the ether has been summoned. It knows your number...",
          "The question has been scheduled. Time will deliver it like a postcard from nowhere...",
          "Done. At the appointed hour, reality will ring...",
          "Your temporal covenant is sealed. What time is it? You'll know when you know..."
        ];
        status = successPhrases[Math.floor(Math.random() * successPhrases.length)];
        phone = '';
        scheduledTime = '';
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        status = `The spirits got tangled in the wires: ${errorData.error || 'Try the incantation again'}`;
      }
    } catch (err) {
      console.error(err);
      status = 'Static in the cosmic radio. The signal will clear... try again shortly.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Baskervville:ital@0;1&family=Space+Mono:wght@400;700&family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&family=Special+Elite&display=swap" rel="stylesheet">
</svelte:head>

<svelte:window on:mousemove={handleMouseMove} />

<main class="min-h-screen flex items-center justify-center relative overflow-hidden">
  <!-- Ken Nordine inspired golden background -->
  <div class="absolute inset-0 bg-gradient-to-br from-[#E8A740] via-[#D89030] to-[#C87820]"></div>
  
  <!-- Enhanced paper/grain texture overlay for authentic 60s poster feel -->
  <div class="absolute inset-0 opacity-30 bg-noise"></div>
  <div class="absolute inset-0 opacity-10 bg-grain-heavy"></div>
  
  <!-- Floating mystical symbols -->
  <div class="absolute left-[15%] top-[10%] text-6xl opacity-20 animate-float-symbol" style="font-family: 'Courier Prime', monospace;">∞</div>
  <div class="absolute right-[20%] top-[30%] text-5xl opacity-25 animate-float-symbol-reverse" style="font-family: 'Courier Prime', monospace;">◐</div>
  <div class="absolute left-[25%] bottom-[20%] text-7xl opacity-15 animate-spin-very-slow" style="font-family: 'Courier Prime', monospace;">☊</div>
  <div class="absolute right-[12%] bottom-[35%] text-4xl opacity-20 animate-pulse-mystical" style="font-family: 'Courier Prime', monospace;">⧖</div>
  <div class="absolute left-[8%] top-[45%] text-6xl opacity-15 animate-float-symbol" style="font-family: 'Courier Prime', monospace;">⚡</div>
  <div class="absolute right-[30%] top-[60%] text-5xl opacity-20 animate-spin-reverse" style="font-family: 'Courier Prime', monospace;">⌇</div>
  
  <!-- Mystical phrase that floats across -->
  {#if mysticalPhrase}
    <div class="absolute top-[5%] left-0 right-0 text-center pointer-events-none">
      <p class="text-sm text-white/40 italic animate-fade-in-out tracking-wider" style="font-family: 'Baskervville', serif; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
        {mysticalPhrase}
      </p>
    </div>
  {/if}
  
  <!-- Easter egg modal -->
  {#if showEasterEgg}
    <div class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none animate-fade-in">
      <div class="bg-[#2B2B2B] text-white px-8 py-6 rounded-lg border-4 border-[#E8A740] shadow-2xl animate-scale-in">
        <p class="text-2xl font-bold mb-2" style="font-family: 'Courier Prime', monospace;">🕰️ SECRET TRANSMISSION 🕰️</p>
        <p class="text-sm italic" style="font-family: 'Baskervville', serif;">
          "Time is a flat circle made of jazz notes..."<br/>
          <span class="text-xs text-[#E8A740]">— Ken Nordine (probably)</span>
        </p>
      </div>
    </div>
  {/if}
  
  <!-- Large abstract geometric shapes - Word Jazz inspired -->
  <!-- Big red circle (left side) -->
  <div class="absolute -left-32 top-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#D94C3D] to-[#B83C2D] rounded-full opacity-90 animate-float-slow"></div>
  
  <!-- Pink overlapping circle -->
  <div class="absolute left-[10%] top-[15%] w-[450px] h-[450px] bg-gradient-to-br from-[#E8638C] to-[#D5547A] rounded-full opacity-85 mix-blend-multiply animate-float-slower"></div>
  
  <!-- Black accent shape (bottom) -->
  <div class="absolute left-[5%] bottom-[10%] w-0 h-0 border-l-[150px] border-l-transparent border-r-[150px] border-r-transparent border-b-[200px] border-b-black/80 opacity-70"></div>
  
  <!-- Right side large yellow circle with text pattern -->
  <div class="absolute -right-24 top-[20%] w-[400px] h-[400px] rounded-full overflow-hidden opacity-80">
    <div class="absolute inset-0 bg-gradient-to-br from-[#F5B840] to-[#E8A740]"></div>
    <div class="absolute inset-0 text-repeating opacity-30"></div>
  </div>
  
  <!-- Smaller accent circles -->
  <div class="absolute right-[15%] bottom-[25%] w-[180px] h-[180px] bg-white rounded-full opacity-60 animate-pulse-slow"></div>
  <div class="absolute right-[8%] top-[15%] w-[120px] h-[120px] bg-[#2B2B2B] rounded-full opacity-70 animate-pulse-slower"></div>
  
  <!-- Abstract curved shape top right -->
  <div class="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-[#D94C3D]/60 to-transparent rounded-full blur-3xl"></div>
  
  <section class="w-full max-w-2xl relative z-10 mx-4">
    <div class="border-4 border-[#2B2B2B] rounded-lg p-8 md:p-12 bg-white/95 backdrop-blur-sm shadow-2xl relative overflow-hidden">
    <!-- Decorative corner triangles -->
    <div class="absolute top-0 left-0 w-0 h-0 border-t-[40px] border-t-[#D94C3D] border-r-[40px] border-r-transparent"></div>
    <div class="absolute bottom-0 right-0 w-0 h-0 border-b-[40px] border-b-[#D94C3D] border-l-[40px] border-l-transparent"></div>
    
    <header class="space-y-4 mb-8 text-center relative z-10">
      <!-- Small "JAZZ HORIZONS" style label -->
      <div class="text-xs tracking-[0.3em] text-[#2B2B2B] uppercase font-bold mb-2" style="font-family: 'Space Mono', monospace;">
        A somewhat new medium
      </div>
      
      <h1 class="text-4xl md:text-6xl font-black tracking-tight text-[#2B2B2B] drop-shadow-sm" style="font-family: 'Courier Prime', monospace; letter-spacing: -0.02em;">
        WHAT TIME IS IT?
      </h1>
      
      <!-- Mid-century modern divider -->
      <div class="flex justify-center items-center gap-3 my-6">
        <div class="w-12 h-0.5 bg-[#D94C3D]"></div>
        <div class="w-3 h-3 bg-[#E8638C] rotate-45"></div>
        <div class="text-sm tracking-widest text-[#2B2B2B] font-bold" style="font-family: 'Space Mono', monospace;">WORD JAZZ</div>
        <div class="w-3 h-3 bg-[#E8638C] rotate-45"></div>
        <div class="w-12 h-0.5 bg-[#D94C3D]"></div>
      </div>
      
      <p class="text-sm md:text-base text-[#2B2B2B] leading-relaxed max-w-lg mx-auto" style="font-family: 'Baskervville', serif;">
        You pick the moment. Later, a calm little voice<br/>
        shows up and asks one slippery question
      </p>
    </header>

    <form class="space-y-6" on:submit={submit}>
      <div class="space-y-2 text-center">
        <label class="block text-sm font-bold tracking-wide text-[#2B2B2B] uppercase" for="phone" style="font-family: 'Space Mono', monospace; letter-spacing: 0.1em;">
          Phone number
        </label>
        <input
          id="phone"
          type="tel"
          bind:value={phone}
          required
          class="w-full bg-[#FFF9E6] border-3 border-[#2B2B2B] rounded-md px-4 py-3 text-base text-[#2B2B2B] outline-none focus:border-[#D94C3D] focus:shadow-lg transition-all placeholder:text-gray-500 font-mono text-center"
          placeholder="+1 555 123 4567"
          style="font-family: 'Courier Prime', monospace;"
        />
        <p class="text-xs text-[#2B2B2B]/70 italic" style="font-family: 'Baskervville', serif;">
          A voice from the ether. A question. Just <em>time</em>.
        </p>
      </div>

      <div class="space-y-2 text-center">
        <label class="block text-sm font-bold tracking-wide text-[#2B2B2B] uppercase" for="time" style="font-family: 'Space Mono', monospace; letter-spacing: 0.1em;">
          When should the question arrive?
        </label>
        <input
          id="time"
          type="datetime-local"
          bind:value={scheduledTime}
          required
          class="w-full bg-[#FFF9E6] border-3 border-[#2B2B2B] rounded-md px-4 py-3 text-base text-[#2B2B2B] outline-none focus:border-[#D94C3D] focus:shadow-lg transition-all font-mono text-center"
          style="font-family: 'Courier Prime', monospace; color-scheme: light;"
        />
        <p class="text-xs text-[#2B2B2B]/70 italic" style="font-family: 'Baskervville', serif;">
          Your local time. A pin dropped in the fabric of <em>now</em>.
        </p>
      </div>

      <button
        type="submit"
        class="group w-full bg-[#2B2B2B] hover:bg-[#D94C3D] text-white font-bold py-5 text-base tracking-widest uppercase shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden border-4 border-[#2B2B2B] hover:border-[#D94C3D] hover:scale-105 active:scale-95 rounded-xl"
        disabled={loading}
        style="font-family: 'Space Mono', monospace; letter-spacing: 0.15em;"
      >
        <!-- Animated background shapes -->
        <div class="absolute inset-0 bg-gradient-to-r from-[#E8638C] via-[#D94C3D] to-[#E8638C] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <!-- Geometric accent shapes that appear on hover -->
        <div class="absolute top-0 left-0 w-0 h-0 border-t-[30px] border-t-[#E8A740] border-r-[30px] border-r-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
        <div class="absolute bottom-0 right-0 w-0 h-0 border-b-[30px] border-b-[#E8A740] border-l-[30px] border-l-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
        
        <!-- Circle elements that scale on hover -->
        <div class="absolute top-1/2 left-4 w-3 h-3 bg-[#E8A740] rounded-full -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300"></div>
        <div class="absolute top-1/2 right-4 w-3 h-3 bg-[#E8A740] rounded-full -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300"></div>
        
        <span class="relative z-10 flex items-center justify-center gap-3">
          {#if loading}
            <span class="inline-block w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></span>
            Setting the moment…
          {:else}
            <span class="inline-block text-xl group-hover:animate-bounce">▶</span>
            SCHEDULE THE QUESTION
            <span class="inline-block text-xl group-hover:animate-bounce animation-delay-150">◀</span>
          {/if}
        </span>
        
        <!-- Pulsing glow effect -->
        <div class="absolute inset-0 border-4 border-[#E8A740] opacity-0 group-hover:opacity-50 animate-pulse-glow"></div>
      </button>
    </form>

    {#if status}
      <div class="mt-6 p-4 bg-[#FFF9E6] border-l-4 border-[#D94C3D] rounded-md relative">
        <div class="absolute top-0 left-0 w-1 h-full bg-[#E8638C] animate-pulse rounded-l-md"></div>
        <p class="text-sm text-[#2B2B2B] leading-relaxed font-mono" style="font-family: 'Space Mono', monospace;">
          {status}
        </p>
      </div>
    {/if}

    <footer class="mt-8 border-t-2 border-[#2B2B2B] pt-6">
      <p class="text-xs text-[#2B2B2B]/60 text-center leading-relaxed uppercase tracking-wider" style="font-family: 'Space Mono', monospace;">
        A toy for humans who dig strange questions<br />
        <span class="text-[#2B2B2B]/40">· No spam · No lists · Just one nudge from the future ·</span>
      </p>
    </footer>
    </div>
  </section>
</main>

<style>
  /* Film grain noise texture - lighter pattern */
  .bg-noise {
    background-image: 
      repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.05) 2px, rgba(0,0,0,.05) 4px),
      repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,.05) 2px, rgba(0,0,0,.05) 4px);
    animation: grain 8s steps(10) infinite;
  }

  /* Heavy vintage grain for authentic 60s poster feel */
  .bg-grain-heavy {
    background-image: 
      repeating-radial-gradient(circle at 20% 30%, transparent 0, rgba(0,0,0,.02) 1px, transparent 2px),
      repeating-radial-gradient(circle at 80% 70%, transparent 0, rgba(0,0,0,.02) 1px, transparent 2px),
      repeating-radial-gradient(circle at 50% 50%, transparent 0, rgba(0,0,0,.015) 1px, transparent 2px);
    animation: grain-drift 12s linear infinite;
  }

  @keyframes grain {
    0%, 100% { transform: translate(0, 0); }
    10% { transform: translate(-5%, -5%); }
    20% { transform: translate(-10%, 5%); }
    30% { transform: translate(5%, -10%); }
    40% { transform: translate(-5%, 15%); }
    50% { transform: translate(-10%, 5%); }
    60% { transform: translate(15%, 0); }
    70% { transform: translate(0, 10%); }
    80% { transform: translate(-15%, 0); }
    90% { transform: translate(10%, 5%); }
  }

  @keyframes grain-drift {
    0%, 100% { 
      opacity: 1;
      transform: translate(0, 0) scale(1);
    }
    25% {
      opacity: 0.8;
      transform: translate(-2%, -2%) scale(1.01);
    }
    50% {
      opacity: 1;
      transform: translate(2%, 2%) scale(0.99);
    }
    75% {
      opacity: 0.9;
      transform: translate(-1%, 1%) scale(1);
    }
  }

  /* Scanline effect like old TV */
  .bg-scanlines {
    background: linear-gradient(
      to bottom,
      transparent 50%,
      rgba(255, 255, 255, 0.03) 51%
    );
    background-size: 100% 4px;
    animation: scanlines 8s linear infinite;
  }

  @keyframes scanlines {
    0% { background-position: 0 0; }
    100% { background-position: 0 100%; }
  }

  /* Floating animations */
  @keyframes float-slow {
    0%, 100% {
      transform: translate(0, 0) scale(1);
      opacity: 0.4;
    }
    33% {
      transform: translate(30px, -30px) scale(1.1);
      opacity: 0.5;
    }
    66% {
      transform: translate(-30px, 30px) scale(0.9);
      opacity: 0.3;
    }
  }

  @keyframes float-slower {
    0%, 100% {
      transform: translate(0, 0) scale(1) rotate(0deg);
      opacity: 0.3;
    }
    50% {
      transform: translate(-40px, -40px) scale(1.2) rotate(180deg);
      opacity: 0.5;
    }
  }

  .animate-float-slow {
    animation: float-slow 15s ease-in-out infinite;
  }

  .animate-float-slower {
    animation: float-slower 20s ease-in-out infinite;
  }

  /* Spinning shapes for psychedelic feel */
  @keyframes spin-very-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes spin-reverse {
    from { transform: rotate(45deg); }
    to { transform: rotate(-315deg); }
  }

  .animate-spin-very-slow {
    animation: spin-very-slow 30s linear infinite;
  }

  .animate-spin-reverse {
    animation: spin-reverse 25s linear infinite;
  }

  /* Subtle glitch effect on title */
  @keyframes subtle-glitch {
    0%, 100% {
      transform: translate(0);
      text-shadow: 3px 3px 0px rgba(255,255,255,0.1), 6px 6px 0px rgba(255,255,255,0.05);
    }
    25% {
      transform: translate(-2px, 2px);
      text-shadow: 3px 3px 0px rgba(255,255,255,0.15), 6px 6px 0px rgba(255,255,255,0.08);
    }
    50% {
      transform: translate(2px, -2px);
      text-shadow: 3px 3px 0px rgba(255,255,255,0.12), 6px 6px 0px rgba(255,255,255,0.06);
    }
    75% {
      transform: translate(-1px, -1px);
      text-shadow: 3px 3px 0px rgba(255,255,255,0.1), 6px 6px 0px rgba(255,255,255,0.05);
    }
  }

  .animate-subtle-glitch {
    animation: subtle-glitch 4s ease-in-out infinite;
  }

  /* Pulse animations for ambient elements */
  @keyframes pulse-slow {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 0.6;
      transform: scale(1.05);
    }
  }

  @keyframes pulse-slower {
    0%, 100% {
      opacity: 0.2;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.1);
    }
  }

  .animate-pulse-slow {
    animation: pulse-slow 4s ease-in-out infinite;
  }

  .animate-pulse-slower {
    animation: pulse-slower 6s ease-in-out infinite;
  }

  /* Monospace input styling */
  input[type="tel"],
  input[type="datetime-local"] {
    font-variant-numeric: tabular-nums;
  }

  /* Custom focus glow effect */
  input:focus {
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1),
                0 0 20px rgba(255, 255, 255, 0.05);
  }

  /* Button press effect */
  button:active:not(:disabled) {
    transform: scale(0.98);
  }

  /* Pulsing glow animation for button */
  @keyframes pulse-glow {
    0%, 100% {
      transform: scale(1);
      opacity: 0;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.5;
    }
  }

  .animate-pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite;
  }

  /* Stagger animation delay */
  .animation-delay-150 {
    animation-delay: 150ms;
  }

  /* Enhanced input hover effects */
  input[type="tel"]:hover,
  input[type="datetime-local"]:hover {
    border-color: #E8638C;
    box-shadow: 0 0 0 3px rgba(232, 99, 140, 0.1);
  }

  /* Vintage label animations */
  label {
    transition: all 0.3s ease;
  }

  label:hover {
    color: #D94C3D;
    transform: translateX(2px);
  }

  /* Custom focus state with 60s colors */
  input:focus {
    border-color: #D94C3D !important;
    box-shadow: 0 0 0 4px rgba(217, 76, 61, 0.1),
                0 0 20px rgba(232, 99, 140, 0.2) !important;
  }
</style>
