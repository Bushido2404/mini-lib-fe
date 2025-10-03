<script lang="ts">
	import { page } from '$app/stores';
	import type { Patron } from '$lib/interfaces';
	import { filterPatrons } from '$lib/api/patron';
	import { Alert, Button, Input, Card, Notification } from '$lib/components';

	let { data } = $props();
	const allPatrons: Patron[] = data.patrons;

	// Search state
	let searchName = $state($page.url.searchParams.get('name') || '');
	let searchEmail = $state($page.url.searchParams.get('email') || '');

	// Filtered patrons based on search criteria
	let patrons = $derived(filterPatrons(allPatrons, {
		name: searchName,
		email: searchEmail
	}));

	function clearFilters() {
		searchName = '';
		searchEmail = '';
	}
</script>

<div class="space-y-6">
	<Notification />
	
	{#if data.error}
		<Alert variant="error" title="Error loading patrons">
			{data.error}
		</Alert>
	{/if}
	
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold text-gray-900">Patrons</h1>
		<Button variant="primary" class="inline-flex items-center">
			<svg class="mr-1.5 -ml-0.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
				<path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
			</svg>
			<a href="/patrons/create">Add Patron</a>
		</Button>
	</div>

	<!-- Search Section -->
	<Card title="Search Patrons">
		<div class="grid gap-4 md:grid-cols-3">
			<div>
				<label for="name" class="block text-sm font-medium text-gray-700">Name</label>
				<Input
					id="name"
					bind:value={searchName}
					placeholder="Search by name..."
					class="mt-1"
				/>
			</div>
			<div>
				<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
				<Input
					id="email"
					type="email"
					bind:value={searchEmail}
					placeholder="Search by email..."
					class="mt-1"
				/>
			</div>
			<div class="flex items-end space-x-2">
				<div class="text-sm text-gray-500 flex items-center justify-center">
					Showing {patrons.length} of {allPatrons.length} patrons
				</div>
				<Button variant="secondary" size="sm" on:click={clearFilters}>
					Clear
				</Button>
			</div>
		</div>
	</Card>

	{#if patrons.length === 0}
		<div class="text-center py-12">
			<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
			</svg>
			<h3 class="mt-2 text-sm font-medium text-gray-900">No patrons found</h3>
			<p class="mt-1 text-sm text-gray-500">
				{searchName || searchEmail ? 'Try adjusting your search criteria.' : 'Get started by adding a new patron.'}
			</p>
		</div>
	{:else}
		<div class="space-y-4">
			{#each patrons as patron}
				<Card clickable on:cardClick={() => window.location.href = `/patrons/${patron._id}`}>
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div class="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
								<span class="text-sm font-medium text-white">
									{patron.firstName?.[0] || 'P'}{patron.lastName?.[0] || ''}
								</span>
							</div>
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-900">{patron.firstName} {patron.lastName}</p>
							<p class="text-sm text-gray-500">{patron.email}</p>
							<p class="text-xs text-gray-400">{patron.phone}</p>
						</div>
					</div>
					
					<div slot="actions" class="flex items-center space-x-2" onclick={(e) => e.stopPropagation()}>
						<Button variant="outline" size="sm">
							<a href="/patrons/{patron._id}/edit">Edit</a>
						</Button>
						<svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
						</svg>
					</div>
				</Card>
			{/each}
		</div>
	{/if}
</div>