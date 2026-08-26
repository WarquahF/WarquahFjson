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
    // TODO(placeholder): no résumé file yet — opens the visitor's mail
    // client. Swap for a real link (e.g. window.open('/resume.pdf','_blank'))
    // once one exists.
    { label: 'Résumé — email for now', hint: 'link', action: () => (window.location.href = `mailto:${social.email}`) },
  ];

  $: filtered = query
    ? items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()))
    : items;

  $: if (activeIndex >= filtered.length) activeIndex = Math.max(0, filtered.length - 1);

  function goTo(href: string) {
    if (href.startsWith('#')) {
      const target = document.querySelector(href);
      if (!target) {
        window.location.assign(`/${href}`);
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.assign(href);
    }
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
    background: rgba(11, 11, 13, 0.6);
    backdrop-filter: blur(2px);
    z-index: 95;
    animation: fade-in 0.12s ease;
  }

  .palette {
    position: fixed;
    top: 14vh;
    left: 50%;
    transform: translateX(-50%);
    width: min(30rem, 92vw);
    border-radius: 8px;
    z-index: 96;
    animation: drop-in 0.18s var(--ease, ease);
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
      transform: translate(-50%, -4px);
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
    gap: 0.6rem;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--line);
  }

  .palette-prompt {
    font-size: var(--step--2);
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
    font-size: var(--step--2);
    color: var(--ink-faint);
  }

  .palette-list {
    padding: 0.3rem;
    max-height: 16rem;
    overflow-y: auto;
  }

  .palette-list button {
    width: 100%;
    display: flex;
    justify-content: space-between;
    text-align: left;
    padding: 0.5rem 0.6rem;
    border-radius: 4px;
    font-size: var(--step--1);
    color: var(--ink-dim);
    transition: background 0.1s var(--ease-out), color 0.1s var(--ease-out);
  }

  .palette-list button.active {
    background: var(--signal-ghost);
    color: var(--ink);
  }

  .palette-hint {
    color: var(--ink-faint);
  }

  .palette-empty {
    padding: 0.75rem;
    font-size: var(--step--1);
    color: var(--ink-faint);
  }

  .palette-footer {
    display: flex;
    gap: 1rem;
    padding: 0.55rem 1rem;
    border-top: 1px solid var(--line);
    font-size: var(--step--2);
    color: var(--ink-faint);
  }
</style>
