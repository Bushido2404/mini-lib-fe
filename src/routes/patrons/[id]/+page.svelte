<script lang="ts">
	import type { Patron } from '$lib/interfaces';
	import { Alert, Button, Card, Notification } from '$lib/components';

	let { data } = $props();
	const patron: Patron | null = data.patron;
</script>

<div class="space-y-6">
	<Notification />
	
	{#if data.error}
		<Alert variant="error" title="Error loading patron">
			{data.error}
		</Alert>
		<Button variant="secondary">
			<a href="/patrons">Back to Patrons</a>
		</Button>
	{:else if !patron}
		<Alert variant="error" title="Patron not found">
			The requested patron could not be found or has been deleted.
		</Alert>
		<Button variant="secondary">
			<a href="/patrons">Back to Patrons</a>
		</Button>
	{:else}
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold text-gray-900">Patron Details</h1>
		<div class="flex gap-2">
			<Button variant="secondary">
				<a href="/patrons">Back to Patrons</a>
			</Button>
			<Button variant="primary">
				<a href="/patrons/{patron._id}/edit">Edit Patron</a>
			</Button>
			<form method="POST" action="?/delete" class="inline" on:submit={(e) => { if (!confirm('Are you sure you want to delete this patron?')) e.preventDefault(); }}>
				<Button variant="danger" type="submit">Delete</Button>
			</form>
		</div>
	</div>

	<Card>
		<div class="flex items-center mb-6">
			<div class="flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
				<span class="text-xl font-medium text-white">
					{patron.firstName?.[0] || 'P'}{patron.lastName?.[0] || ''}
				</span>
			</div>
			<div class="ml-4">
				<h2 class="text-2xl font-bold text-gray-900">
					{patron.firstName} {patron.lastName}
				</h2>
				<p class="text-gray-500">{patron.email}</p>
			</div>
		</div>

		<div class="grid gap-6 md:grid-cols-2">
			<div class="space-y-4">
				<div>
					<h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Personal Information</h3>
					<div class="mt-2 space-y-3">
						<div>
							<dt class="text-sm font-medium text-gray-700">First Name</dt>
							<dd class="text-sm text-gray-900">{patron.firstName}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-700">Last Name</dt>
							<dd class="text-sm text-gray-900">{patron.lastName}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-700">Email</dt>
							<dd class="text-sm text-gray-900">{patron.email}</dd>
						</div>
					</div>
				</div>
			</div>

			<div class="space-y-4">
				<div>
					<h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Contact Information</h3>
					<div class="mt-2 space-y-3">
						<div>
							<dt class="text-sm font-medium text-gray-700">Phone</dt>
							<dd class="text-sm text-gray-900">{patron.phone}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-700">Address</dt>
							<dd class="text-sm text-gray-900">{patron.address}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-700">Created At</dt>
							<dd class="text-sm text-gray-900">{new Date(patron.createdAt).toLocaleDateString()}</dd>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Card>
	{/if}
</div>