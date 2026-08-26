<script lang="ts">
  import { onMount } from 'svelte';
  import { projects } from '../../data/projects';

  let open = false;
  let activeSlug: string | null = null;
  let triggerEl: HTMLElement | null = null;
  let panelEl: HTMLElement;

  $: project = projects.find((p) => p.slug === activeSlug) ?? null;

  onMount(() => {
    const onOpen = (e: Event) => {
      triggerEl = document.activeElement as HTMLElement;
      activeSlug = (e as CustomEvent<string>).detail;
      open = true;
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => panelEl?.focus());
    };
    window.addEventListener('open-project', onOpen);
    return () => window.removeEventListener('open-project', onOpen);
  });

  function close() {
    open = false;
    document.body.style.overflow = '';
    triggerEl?.focus();
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') close();
  }
</script>

<svelte:window on:keydown={onKeydown} />

{#if open && project}
  <div class="scrim" on:click={close} aria-hidden="true"></div>
  <div
    class="panel"
    role="dialog"
    aria-modal="true"
    aria-labelledby="panel-title"
    tabindex="-1"
    bind:this={panelEl}
  >
    <div class="panel-head">
      <span class="mono panel-kind">{project.kind}</span>
      <button class="mono panel-close" type="button" on:click={close} aria-label="Close">Esc <span class="close-x">✕</span></button>
    </div>

    <h3 id="panel-title" class="panel-title">{project.name}</h3>
    <p class="panel-detail">{project.detail}</p>

    <ul class="panel-points mono">
      {#each project.points as point}
        <li>{point}</li>
      {/each}
    </ul>

    {#if project.flow}
      <div class="flow" aria-label="Request flow diagram">
        {#each project.flow as row, rowIndex}
          <div class="flow-row" style="justify-content: {row.length > 1 ? 'space-between' : 'flex-start'}">
            {#each row as step}
              <span class="flow-node" data-branch={step.branch ?? false}>{step.label}</span>
            {/each}
          </div>
          {#if rowIndex < project.flow.length - 1}
            <div class="flow-connector">
              <svg viewBox="0 0 6 22" preserveAspectRatio="none">
                <line x1="3" y1="0" x2="3" y2="22" />
                <circle r="2.5" />
              </svg>
            </div>
          {/if}
        {/each}
      </div>
    {/if}

    <div class="panel-stack mono">
      {#each project.stack as tech}
        <span>{tech}</span>
      {/each}
    </div>

    {#if project.href}
      <a class="panel-link mono" href={project.href} target="_blank" rel="noreferrer">
        View on GitHub →
      </a>
    {/if}
  </div>
{/if}

<style>
  .scrim {
    position: fixed;
    inset: 0;
    background: rgba(11, 11, 13, 0.65);
    backdrop-filter: blur(2px);
    z-index: 90;
    animation: fade-in 0.15s ease;
  }

  .panel {
    position: fixed;
    top: 0;
    right: 0;
    height: 100dvh;
    width: min(28rem, 100vw);
    background: var(--bg);
    border-left: 1px solid var(--line);
    border-radius: 0;
    z-index: 91;
    padding: clamp(1.25rem, 3vw, 2rem);
    overflow-y: auto;
    animation: slide-in 0.3s var(--ease, ease);
  }

  @media (prefers-reduced-motion: reduce) {
    .panel,
    .scrim {
      animation: none;
    }
  }

  @keyframes slide-in {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .panel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .panel-kind {
    font-size: var(--step--2);
    color: var(--signal);
    letter-spacing: 0.04em;
  }

  .panel-close {
    font-size: var(--step--2);
    color: var(--ink-faint);
    border: 1px solid var(--line-strong);
    border-radius: var(--radius);
    padding: 0.2rem 0.45rem;
    transition: color 0.2s var(--ease-out), border-color 0.2s var(--ease-out);
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .panel-close:hover {
    color: var(--ink);
    border-color: var(--ink-faint);
  }

  .close-x {
    font-size: 0.7em;
  }

  .panel-title {
    font-size: var(--step-3);
    margin-top: var(--space-lg);
    line-height: 1.1;
  }

  .panel-detail {
    margin-top: var(--space-md);
    line-height: 1.55;
  }

  .panel-points {
    margin: var(--space-lg) 0 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    border-top: 1px solid var(--line);
    padding-top: var(--space-lg);
  }

  .panel-points li {
    font-size: var(--step--1);
    color: var(--ink-dim);
    padding-left: 0.9rem;
    position: relative;
    line-height: 1.5;
  }

  .panel-points li::before {
    content: '—';
    position: absolute;
    left: 0;
    color: var(--ink-faint);
  }

  .panel :global(.flow) {
    margin-top: var(--space-lg);
    padding-top: var(--space-lg);
    border-top: 1px solid var(--line);
  }

  .panel-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: var(--space-lg);
  }

  .panel-stack span {
    font-size: var(--step--2);
    color: var(--ink-faint);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    padding: 0.2rem 0.5rem;
  }

  .panel-link {
    display: inline-block;
    margin-top: var(--space-xl);
    font-size: var(--step--1);
    color: var(--signal);
    text-decoration: none;
    transition: opacity 0.2s var(--ease-out);
  }

  .panel-link:hover {
    opacity: 0.8;
  }
</style>
