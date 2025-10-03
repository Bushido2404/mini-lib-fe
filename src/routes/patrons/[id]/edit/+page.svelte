<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { Patron } from '$lib/interfaces';
	import { Alert, Button, Card, Input } from '$lib/components';

	let { data, form } = $props();
	const patron: Patron = data.patron;
	let loading = $state(false);
</script>

<div class="space-y-6">
	{#if data.error}
		<Alert variant="error" title="Error loading patron">
			{data.error}
		</Alert>
	{/if}

	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold text-gray-900">Edit Patron</h1>
		<Button variant="secondary">
			<a href="/patrons/{patron._id}">Back to Patron</a>
		</Button>
	</div>

	<Card>
		<form 
			method="POST" 
			class="space-y-6"
			use:enhance={() => {
				loading = true;
				return async ({ result }) => {
					loading = false;
					if (result.type === 'redirect') {
						goto(result.location);
					}
				};
			}}
		>
			{#if form?.error}
				<Alert variant="error" title="Error updating patron">
					{form.error}
				</Alert>
			{/if}

			<div class="grid gap-6 md:grid-cols-2">
				<div>
					<label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
					<Input
						id="firstName"
						name="firstName"
						type="text"
						required
						class="mt-1"
						value={form?.firstName || patron.firstName}
					/>
				</div>

				<div>
					<label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
					<Input
						id="lastName"
						name="lastName"
						type="text"
						required
						class="mt-1"
						value={form?.lastName || patron.lastName}
					/>
				</div>
			</div>

			<div>
				<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
				<Input
					id="email"
					name="email"
					type="email"
					required
					class="mt-1"
					value={form?.email || patron.email}
				/>
			</div>

			<div>
				<label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
				<Input
					id="phone"
					name="phone"
					type="tel"
					required
					class="mt-1"
					value={form?.phone || patron.phone}
				/>
			</div>

			<div>
				<label for="address" class="block text-sm font-medium text-gray-700">Address</label>
				<textarea
					id="address"
					name="address"
					required
					rows="3"
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
				>{form?.address || patron.address}</textarea>
			</div>

			<div class="flex justify-end space-x-3">
				<Button variant="secondary">
					<a href="/patrons/{patron._id}">Cancel</a>
				</Button>
				<Button
					type="submit"
					disabled={loading}
					variant="primary"
				>
					{loading ? 'Updating...' : 'Update Patron'}
				</Button>
			</div>
		</form>
	</Card>
</div>