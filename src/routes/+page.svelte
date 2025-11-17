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

<main class="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
  <section class="w-full max-w-xl border border-slate-800 rounded-2xl p-6 md:p-8 bg-slate-900/80 backdrop-blur">
    <header class="space-y-2 mb-6">
      <h1 class="text-3xl font-semibold tracking-tight">
        What Time Is It?
      </h1>
      <p class="text-sm text-slate-400 leading-relaxed">
        A tiny word-jazz reminder. You pick the moment. Later, a calm little voice
        shows up—in your inbox or on your phone—and asks one slippery question:
        <span class="italic">"What time is it?"</span>
      </p>
    </header>

    <form class="space-y-5" on:submit={submit}>
      <div class="space-y-1">
        <label class="block text-sm font-medium">
          How should the question find you?
        </label>
        <div class="flex gap-4 text-sm">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" bind:group={channel} value="email" />
            <span>Email whisper</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" bind:group={channel} value="call" />
            <span>Phone call apparition</span>
          </label>
        </div>
      </div>

      {#if channel === 'email'}
        <div class="space-y-1">
          <label class="block text-sm font-medium" for="email">
            Email address
          </label>
          <input
            id="email"
            type="email"
            bind:value={email}
            required
            class="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm outline-none focus:ring focus:ring-sky-500"
            placeholder="you@example.com"
          />
          <p class="text-xs text-slate-500">
            Later on, an email will drift in and ask you what time it really is.
          </p>
        </div>
      {:else}
        <div class="space-y-1">
          <label class="block text-sm font-medium" for="phone">
            Phone number
          </label>
          <input
            id="phone"
            type="tel"
            bind:value={phone}
            required
            class="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm outline-none focus:ring focus:ring-sky-500"
            placeholder="+1 555 123 4567"
          />
          <p class="text-xs text-slate-500">
            You'll get a short call. A voice. A question. No sales pitch. Just time.
          </p>
        </div>
      {/if}

      <div class="space-y-1">
        <label class="block text-sm font-medium" for="time">
          When should the question arrive?
        </label>
        <input
          id="time"
          type="datetime-local"
          bind:value={scheduledTime}
          required
          class="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm outline-none focus:ring focus:ring-sky-500"
        />
        <p class="text-xs text-slate-500">
          Your local time. Think of it as dropping a little pin in your own timeline.
        </p>
      </div>

      <button
        type="submit"
        class="w-full rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-medium py-2 text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {#if loading}
          Setting the moment…
        {:else}
          Schedule my "What time is it?" moment
        {/if}
      </button>
    </form>

    {#if status}
      <p class="mt-4 text-xs text-slate-400 leading-relaxed">
        {status}
      </p>
    {/if}

    <footer class="mt-6 border-t border-slate-800 pt-3">
      <p class="text-[0.7rem] text-slate-500">
        This is a toy for humans who like strange little questions.
        No spam, no lists, just one nudge from the future.
      </p>
    </footer>
  </section>
</main>
