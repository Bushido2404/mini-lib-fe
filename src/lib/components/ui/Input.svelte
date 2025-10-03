<script lang="ts">
	import { cn } from '$lib/utils/cn';

	let {
		type = 'text',
		placeholder = '',
		value = $bindable(''),
		disabled = false,
		required = false,
		class: className = '',
		...props
	}: {
		type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
		placeholder?: string;
		value?: string | number;
		disabled?: boolean;
		required?: boolean;
		class?: string;
		[key: string]: any;
	} = $props();

	const baseClasses = 'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm';
</script>

<input
	class={cn(baseClasses, className)}
	{type}
	{placeholder}
	bind:value
	{disabled}
	{required}
	{...props}
/>