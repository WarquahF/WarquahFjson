<script lang="ts">
  import { onMount } from 'svelte';

  const steps = ['loading profile...', 'loading projects...', 'ready.'];
  let visible = true;
  let stepIndex = 0;

  onMount(() => {
    if (sessionStorage.getItem('loader-seen')) {
      visible = false;
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      finish();
      return;
    }

    const interval = setInterval(() => {
      stepIndex += 1;
      if (stepIndex >= steps.length) {
        clearInterval(interval);
        setTimeout(finish, 350);
      }
    }, 420);

    return () => clearInterval(interval);
  });

  function finish() {
    visible = false;
    sessionStorage.setItem('loader-seen', '1');
  }
</script>

{#if visible}
  <div class="loader" role="status" aria-live="polite">
    <div class="loader-inner">
      <p class="mono loader-line">{steps[stepIndex]}</p>
      <button class="mono loader-skip" type="button" on:click={finish}>Skip</button>
    </div>
  </div>
{/if}

<style>
  .loader {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    background: var(--bg);
    padding: clamp(1.25rem, 5vw, 3.5rem);
    animation: loader-out 0.4s ease 1.3s forwards;
  }

  @media (prefers-reduced-motion: reduce) {
    .loader {
      animation: none;
      display: none;
    }
  }

  @keyframes loader-out {
    to {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }
  }

  .loader-inner {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  .loader-line {
    font-size: var(--step--1);
    color: var(--ink-dim);
    letter-spacing: 0.03em;
  }

  .loader-skip {
    font-size: var(--step--1);
    color: var(--ink-faint);
    border: 1px solid var(--line-strong);
    border-radius: var(--radius);
    padding: 0.3rem 0.6rem;
    transition: color 0.2s ease, border-color 0.2s ease;
  }

  .loader-skip:hover {
    color: var(--ink);
    border-color: var(--ink-faint);
  }
</style>
