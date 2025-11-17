<script lang="ts">
  let channel: 'email' | 'call' = 'email';
  let email = '';
  let phone = '';
  let scheduledTime = '';
  let status = '';
  let loading = false;

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    loading = true;
    status = 'Setting the clock on this little experiment…';

    try {
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel,
          email: channel === 'email' ? email : null,
          phone: channel === 'call' ? phone : null,
          scheduledTime
        })
      });

      if (res.ok) {
        status = "All right. Later on, a quiet voice will check in and ask: \"What time is it?\"";
        email = '';
        phone = '';
        scheduledTime = '';
      } else {
        const text = await res.text();
        status = `Something hiccuped: ${text}`;
      }
    } catch (err) {
      console.error(err);
      status = 'The universe bumped the needle. Try again in a moment.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Baskervville:ital@0;1&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">
</svelte:head>

<main class="min-h-screen flex items-center justify-center relative overflow-hidden">
  <!-- Retro background with organic shapes -->
  <div class="absolute inset-0 bg-gradient-to-br from-[#2d1b1b] via-[#1a2828] to-[#1f1a2d]"></div>
  
  <!-- Floating organic shapes for that 60s vibe -->
  <div class="absolute top-10 left-10 w-96 h-96 bg-[#d97234]/10 rounded-full blur-3xl animate-pulse-slow"></div>
  <div class="absolute bottom-10 right-10 w-80 h-80 bg-[#d4a137]/10 rounded-full blur-3xl animate-pulse-slower"></div>
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-[#347a7a]/10 rounded-[40%_60%_70%_30%/60%_30%_70%_40%] blur-3xl"></div>
  
  <section class="w-full max-w-2xl relative z-10 mx-4">
    <div class="border-4 border-[#d97234]/40 rounded-sm p-8 md:p-12 bg-gradient-to-br from-[#1a1410]/95 via-[#1f1f1f]/95 to-[#1a1410]/95 backdrop-blur-xl shadow-2xl">
    <header class="space-y-4 mb-8 text-center">
      <h1 class="text-5xl md:text-6xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#d97234] via-[#d4a137] to-[#347a7a] drop-shadow-lg" style="font-family: 'Baskervville', serif;">
        What Time Is It?
      </h1>
      <div class="w-24 h-1 bg-gradient-to-r from-transparent via-[#d4a137] to-transparent mx-auto"></div>
      <p class="text-base text-[#d4a137]/90 leading-relaxed max-w-lg mx-auto" style="font-family: 'Space Grotesk', sans-serif;">
        A tiny word-jazz reminder. You pick the moment. Later, a calm little voice
        shows up—in your inbox or on your phone—and asks one slippery question:
        <span class="italic text-[#d97234] font-medium">"What time is it?"</span>
      </p>
    </header>

    <form class="space-y-6" on:submit={submit}>
      <div class="space-y-3">
        <label class="block text-sm font-bold tracking-wide text-[#d4a137] uppercase" style="font-family: 'Space Grotesk', sans-serif; letter-spacing: 0.1em;">
          How should the question find you?
        </label>
        <div class="flex gap-6 text-base">
          <label class="flex items-center gap-3 cursor-pointer group">
            <input 
              type="radio" 
              bind:group={channel} 
              value="email" 
              class="w-5 h-5 accent-[#d97234] cursor-pointer"
            />
            <span class="text-[#cbb89e] group-hover:text-[#d4a137] transition-colors" style="font-family: 'Space Grotesk', sans-serif;">Email whisper</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer group">
            <input 
              type="radio" 
              bind:group={channel} 
              value="call" 
              class="w-5 h-5 accent-[#d97234] cursor-pointer"
            />
            <span class="text-[#cbb89e] group-hover:text-[#d4a137] transition-colors" style="font-family: 'Space Grotesk', sans-serif;">Phone call apparition</span>
          </label>
        </div>
      </div>

      {#if channel === 'email'}
        <div class="space-y-2">
          <label class="block text-sm font-bold tracking-wide text-[#d4a137] uppercase" for="email" style="font-family: 'Space Grotesk', sans-serif; letter-spacing: 0.1em;">
            Email address
          </label>
          <input
            id="email"
            type="email"
            bind:value={email}
            required
            class="w-full bg-[#0f0d0a] border-2 border-[#d97234]/40 px-4 py-3 text-base text-[#d4a137] outline-none focus:border-[#d97234] focus:shadow-lg focus:shadow-[#d97234]/20 transition-all placeholder:text-[#6b5d4f]"
            placeholder="you@example.com"
            style="font-family: 'Space Grotesk', sans-serif;"
          />
          <p class="text-xs text-[#8b7355] italic" style="font-family: 'Space Grotesk', sans-serif;">
            Later on, an email will drift in and ask you what time it really is.
          </p>
        </div>
      {:else}
        <div class="space-y-2">
          <label class="block text-sm font-bold tracking-wide text-[#d4a137] uppercase" for="phone" style="font-family: 'Space Grotesk', sans-serif; letter-spacing: 0.1em;">
            Phone number
          </label>
          <input
            id="phone"
            type="tel"
            bind:value={phone}
            required
            class="w-full bg-[#0f0d0a] border-2 border-[#d97234]/40 px-4 py-3 text-base text-[#d4a137] outline-none focus:border-[#d97234] focus:shadow-lg focus:shadow-[#d97234]/20 transition-all placeholder:text-[#6b5d4f]"
            placeholder="+1 555 123 4567"
            style="font-family: 'Space Grotesk', sans-serif;"
          />
          <p class="text-xs text-[#8b7355] italic" style="font-family: 'Space Grotesk', sans-serif;">
            You'll get a short call. A voice. A question. No sales pitch. Just time.
          </p>
        </div>
      {/if}

      <div class="space-y-2">
        <label class="block text-sm font-bold tracking-wide text-[#d4a137] uppercase" for="time" style="font-family: 'Space Grotesk', sans-serif; letter-spacing: 0.1em;">
          When should the question arrive?
        </label>
        <input
          id="time"
          type="datetime-local"
          bind:value={scheduledTime}
          required
          class="w-full bg-[#0f0d0a] border-2 border-[#d97234]/40 px-4 py-3 text-base text-[#d4a137] outline-none focus:border-[#d97234] focus:shadow-lg focus:shadow-[#d97234]/20 transition-all"
          style="font-family: 'Space Grotesk', sans-serif; color-scheme: dark;"
        />
        <p class="text-xs text-[#8b7355] italic" style="font-family: 'Space Grotesk', sans-serif;">
          Your local time. Think of it as dropping a little pin in your own timeline.
        </p>
      </div>

      <button
        type="submit"
        class="w-full bg-gradient-to-r from-[#d97234] to-[#d4a137] hover:from-[#e88244] hover:to-[#e4b147] text-[#1a1410] font-bold py-4 text-base tracking-wide uppercase shadow-lg hover:shadow-xl hover:shadow-[#d97234]/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group"
        disabled={loading}
        style="font-family: 'Space Grotesk', sans-serif; letter-spacing: 0.1em;"
      >
        <span class="relative z-10">
          {#if loading}
            Setting the moment…
          {:else}
            Schedule my "What time is it?" moment
          {/if}
        </span>
        <div class="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
      </button>
    </form>

    {#if status}
      <div class="mt-6 p-4 bg-[#0f0d0a] border-l-4 border-[#347a7a]">
        <p class="text-sm text-[#9ab5b5] leading-relaxed italic" style="font-family: 'Space Grotesk', sans-serif;">
          {status}
        </p>
      </div>
    {/if}

    <footer class="mt-8 border-t-2 border-[#d97234]/20 pt-6">
      <p class="text-xs text-[#8b7355] text-center leading-relaxed" style="font-family: 'Space Grotesk', sans-serif;">
        This is a toy for humans who like strange little questions.<br />
        No spam, no lists, just one nudge from the future.
      </p>
    </footer>
    </div>
  </section>
</main>

<style>
  @keyframes pulse-slow {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.1);
    }
  }

  @keyframes pulse-slower {
    0%, 100% {
      opacity: 0.2;
      transform: scale(1);
    }
    50% {
      opacity: 0.4;
      transform: scale(1.15);
    }
  }

  .animate-pulse-slow {
    animation: pulse-slow 8s ease-in-out infinite;
  }

  .animate-pulse-slower {
    animation: pulse-slower 12s ease-in-out infinite;
  }

  /* Custom radio button styling for that retro feel */
  input[type="radio"] {
    appearance: none;
    -webkit-appearance: none;
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid #d97234;
    border-radius: 50%;
    background: #0f0d0a;
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;
  }

  input[type="radio"]:checked {
    background: #d97234;
    box-shadow: 0 0 0 2px #0f0d0a, 0 0 0 4px #d97234;
  }

  input[type="radio"]:checked::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0.4rem;
    height: 0.4rem;
    background: #1a1410;
    border-radius: 50%;
  }
</style>
