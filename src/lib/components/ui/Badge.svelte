<script lang="ts">
	import { cn } from '$lib/utils/cn';

	let {
		variant = 'default',
		size = 'md',
		class: className = '',
		...props
	}: {
		variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
		size?: 'sm' | 'md' | 'lg';
		class?: string;
		[key: string]: any;
	} = $props();

	const baseClasses = 'inline-flex items-center rounded-full font-medium';

	const variants = {
		default: 'bg-gray-100 text-gray-800',
		primary: 'bg-blue-100 text-blue-800',
		secondary: 'bg-gray-100 text-gray-800',
		success: 'bg-green-100 text-green-800',
		warning: 'bg-yellow-100 text-yellow-800',
		danger: 'bg-red-100 text-red-800'
	};

	const sizes = {
		sm: 'px-2 py-0.5 text-xs',
		md: 'px-2.5 py-0.5 text-xs',
		lg: 'px-3 py-1 text-sm'
	};
</script>

<span
	class={cn(baseClasses, variants[variant], sizes[size], className)}
	{...props}
>
	<slot />
</span>