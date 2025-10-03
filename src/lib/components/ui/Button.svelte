<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { cn } from '$lib/utils/cn';

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		type = 'button',
		class: className = '',
		...props
	}: {
		variant?: 'primary' | 'secondary' | 'danger' | 'outline';
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		class?: string;
		[key: string]: any;
	} = $props();

	const dispatch = createEventDispatcher();

	const baseClasses =
		'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

	const variants = {
		primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
		secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
		danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
		outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
	};

	const sizes = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base'
	};

	function handleClick(event: MouseEvent) {
		if (!disabled) {
			dispatch('click', { event });
		}
	}
</script>

<button
	class={cn(baseClasses, variants[variant], sizes[size], className)}
	{disabled}
	{type}
	on:click={handleClick}
	{...props}
>
	<slot />
</button>
