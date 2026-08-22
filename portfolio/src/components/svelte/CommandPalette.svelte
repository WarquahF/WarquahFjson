<script lang="ts">
  import { onMount } from 'svelte';
  import { sections, social } from '../../data/nav';
  import { projects } from '../../data/projects';

  type Item = { label: string; hint: string; action: () => void };

  let open = false;
  let query = '';
  let activeIndex = 0;
  let inputEl: HTMLInputElement;
  let triggerEl: HTMLElement | null = null;

  const items: Item[] = [
    ...sections.map((s) => ({
      label: s.label,
      hint: 'section',
      action: () => goTo(s.href),
    })),
    ...projects.map((p) => ({
      label: p.name,
      hint: 'project',
      action: () => {
        goTo('#projects');
        setTimeout(() => window.dispatchEvent(new CustomEvent('open-project', { detail: p.slug })), 250);
      },
    })),
    { label: 'GitHub', hint: 'link', action: () => window.open(social.github, '_blank') },
    { label: 'Email', hint: 'link', action: () => (window.location.href = `mailto:${social.email}`) },
    { label: 'X', hint: 'link', action: () => window.open(social.x, '_blank') },
  ];

  $: filtered = query
    ? items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()))
    : items;

  $: if (activeIndex >= filtered.length) activeIndex = Math.max(0, filtered.length - 1);

  function goTo(href: string) {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    close();
  }

  function openPalette() {
    triggerEl = document.activeElement as HTMLElement;
    open = true;
    query = '';
    activeIndex = 0;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => inputEl?.focus());
  }

  function close() {
    open = false;
    document.body.style.overflow = '';
    triggerEl?.focus();
  }

  function onGlobalKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      open ? close() : openPalette();
    } else if (e.key === 'Escape' && open) {
      close();
    }
  }

  function onInputKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % filtered.length;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + filtered.length) % filtered.length;
    } else if (e.key === 'Enter' && filtered[activeIndex]) {
      filtered[activeIndex].action();
    }
  }

  onMount(() => {
    const triggers = document.querySelectorAll<HTMLElement>('[data-command-trigger]');
    triggers.forEach((t) => t.addEventListener('click', openPalette));
    return () => triggers.forEach((t) => t.removeEventListener('click', openPalette));
  });
</script>

<svelte:window on:keydown={onGlobalKeydown} />

{#if open}
  <div class="scrim" on:click={close} aria-hidden="true"></div>
  <div class="palette glass" role="dialog" aria-modal="true" aria-label="Command palette">
    <div class="palette-input-row">
      <span class="mono palette-prompt">⌘K</span>
      <input
        bind:this={inputEl}
        bind:value={query}
        on:keydown={onInputKeydown}
        class="mono palette-input"
        type="text"
        placeholder="Search sections, projects, links…"
        aria-label="Search"
        autocomplete="off"
      />
      <span class="mono palette-esc">esc</span>
    </div>

    <ul class="palette-list mono" role="listbox">
      {#each filtered as item, i}
        <li role="option" aria-selected={i === activeIndex}>
          <button
            type="button"
            class:active={i === activeIndex}
            on:click={item.action}
            on:mouseenter={() => (activeIndex = i)}
          >
            <span>{item.label}</span>
            <span class="palette-hint">{item.hint}</span>
          </button>
        </li>
      {:else}
        <li class="palette-empty">No matches.</li>
      {/each}
    </ul>

    <div class="palette-footer mono">
      <span>↑↓ navigate</span>
      <span>↵ select</span>
      <span>esc close</span>
    </div>
  </div>
{/if}

<style>
  .scrim {
    position: fixed;
    inset: 0;
    background: rgba(11, 11, 13, 0.7);
    backdrop-filter: blur(3px);
    z-index: 95;
    animation: fade-in 0.15s ease;
  }

  .palette {
    position: fixed;
    top: 14vh;
    left: 50%;
    transform: translateX(-50%);
    width: min(32rem, 92vw);
    border-radius: 10px;
    z-index: 96;
    animation: drop-in 0.2s var(--ease, ease);
  }

  @media (prefers-reduced-motion: reduce) {
    .palette,
    .scrim {
      animation: none;
    }
  }

  @keyframes drop-in {
    from {
      opacity: 0;
      transform: translate(-50%, -6px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
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

  .palette-input-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.9rem 1.1rem;
    border-bottom: 1px solid var(--line);
  }

  .palette-prompt {
    font-size: var(--step--1);
    color: var(--signal);
  }

  .palette-input {
    flex: 1;
    background: none;
    border: none;
    color: var(--ink);
    font-size: var(--step-0);
    outline: none;
  }

  .palette-input::placeholder {
    color: var(--ink-faint);
  }

  .palette-esc {
    font-size: var(--step--1);
    color: var(--ink-faint);
  }

  .palette-list {
    list-style: none;
    margin: 0;
    padding: 0.4rem;
    max-height: 18rem;
    overflow-y: auto;
  }

  .palette-list button {
    width: 100%;
    display: flex;
    justify-content: space-between;
    text-align: left;
    padding: 0.6rem 0.7rem;
    border-radius: 4px;
    font-size: var(--step--1);
    color: var(--ink-dim);
  }

  .palette-list button.active {
    background: var(--bg);
    color: var(--ink);
  }

  .palette-hint {
    color: var(--ink-faint);
  }

  .palette-empty {
    padding: 1rem;
    font-size: var(--step--1);
    color: var(--ink-faint);
  }

  .palette-footer {
    display: flex;
    gap: 1.25rem;
    padding: 0.7rem 1.1rem;
    border-top: 1px solid var(--line);
    font-size: var(--step--1);
    color: var(--ink-faint);
  }
</style>
