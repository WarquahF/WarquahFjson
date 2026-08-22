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
    class="panel glass"
    role="dialog"
    aria-modal="true"
    aria-labelledby="panel-title"
    tabindex="-1"
    bind:this={panelEl}
  >
    <div class="panel-head">
      <span class="mono panel-kind">{project.kind}</span>
      <button class="mono panel-close" type="button" on:click={close} aria-label="Close">Esc ✕</button>
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
    background: rgba(11, 11, 13, 0.7);
    backdrop-filter: blur(3px);
    z-index: 90;
    animation: fade-in 0.2s ease;
  }

  .panel {
    position: fixed;
    top: 0;
    right: 0;
    height: 100dvh;
    width: min(28rem, 100vw);
    border-left: 1px solid rgba(255, 255, 255, 0.07);
    border-top: none;
    border-right: none;
    border-bottom: none;
    border-radius: 0;
    z-index: 91;
    padding: clamp(1.5rem, 4vw, 2.5rem);
    overflow-y: auto;
    animation: slide-in 0.35s var(--ease, ease);
  }

  @media (prefers-reduced-motion: reduce) {
    .panel {
      animation: none;
    }
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
    font-size: var(--step--1);
    color: var(--signal);
  }

  .panel-close {
    font-size: var(--step--1);
    color: var(--ink-faint);
    border: 1px solid var(--line-strong);
    border-radius: var(--radius);
    padding: 0.3rem 0.55rem;
  }

  .panel-close:hover {
    color: var(--ink);
  }

  .panel-title {
    font-size: var(--step-3);
    margin-top: 1.25rem;
  }

  .panel-detail {
    margin-top: 0.9rem;
  }

  .panel-points {
    list-style: none;
    padding: 0;
    margin: 1.5rem 0 0;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    border-top: 1px solid var(--line);
    padding-top: 1.25rem;
  }

  .panel-points li {
    font-size: var(--step--1);
    color: var(--ink-dim);
    padding-left: 1rem;
    position: relative;
  }

  .panel-points li::before {
    content: '—';
    position: absolute;
    left: 0;
    color: var(--ink-faint);
  }

  .panel :global(.flow) {
    margin-top: 1.5rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--line);
  }

  .panel-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1.5rem;
  }

  .panel-stack span {
    font-size: var(--step--1);
    color: var(--ink-dim);
    border: 1px solid var(--line-strong);
    border-radius: var(--radius);
    padding: 0.25rem 0.55rem;
  }

  .panel-link {
    display: inline-block;
    margin-top: 2rem;
    font-size: var(--step--1);
    color: var(--signal);
    text-decoration: none;
  }
</style>
