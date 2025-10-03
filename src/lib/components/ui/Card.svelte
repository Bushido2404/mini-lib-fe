<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { cn } from '$lib/utils/cn';

	let {
		title = '',
		subtitle = '',
		clickable = false,
		class: className = '',
		...props
	}: {
		title?: string;
		subtitle?: string;
		clickable?: boolean;
		class?: string;
		[key: string]: any;
	} = $props();

	const dispatch = createEventDispatcher();

	const baseClasses = 'bg-white rounded-lg border border-gray-200 shadow-sm';
	const clickableClasses = 'cursor-pointer hover:shadow-md transition-shadow';

	function handleClick() {
		if (clickable) {
			dispatch('cardClick');
		}
	}
</script>

<div
	class={cn(baseClasses, clickable && clickableClasses, className)}
	on:click={handleClick}
	{...props}
>
	{#if title}
		<div class="px-6 py-4 border-b border-gray-200">
			<h3 class="text-lg font-semibold text-gray-900">{title}</h3>
			{#if subtitle}
				<p class="text-sm text-gray-600 mt-1">{subtitle}</p>
			{/if}
		</div>
	{/if}

	<div class="px-6 py-4">
		<slot />
	</div>

	{#if $$slots.actions}
		<div class="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
			<slot name="actions" />
		</div>
	{/if}
</div>