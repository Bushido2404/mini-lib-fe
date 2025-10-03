<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { Alert } from '$lib/components';

	let successMessage = $state('');
	let errorMessage = $state('');

	onMount(() => {
		const message = $page.url.searchParams.get('message');
		const error = $page.url.searchParams.get('error');
		
		if (message) {
			successMessage = message;
			setTimeout(() => {
				successMessage = '';
				const url = new URL(window.location.href);
				url.searchParams.delete('message');
				window.history.replaceState({}, '', url.toString());
			}, 3000);
		}
		
		if (error) {
			errorMessage = error;
			setTimeout(() => {
				errorMessage = '';
				const url = new URL(window.location.href);
				url.searchParams.delete('error');
				window.history.replaceState({}, '', url.toString());
			}, 5000);
		}
	});
</script>

{#if successMessage}
	<Alert variant="success" title="Success">
		{successMessage}
	</Alert>
{/if}

{#if errorMessage}
	<Alert variant="error" title="Error">
		{errorMessage}
	</Alert>
{/if}