<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	let { form } = $props();
	let loading = $state(false);
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold">Add New Patron</h1>
		<a href="/patrons" class="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
			Back to Patrons
		</a>
	</div>

	<div class="rounded-lg border bg-white p-6 shadow-sm">
		<form 
			method="POST" 
			class="space-y-4"
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
				<div class="rounded bg-red-50 p-4 text-red-700">
					{form.error}
				</div>
			{/if}

			<div class="grid gap-4 md:grid-cols-2">
				<div>
					<label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
					<input
						id="firstName"
						name="firstName"
						type="text"
						required
						class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						value={form?.firstName || ''}
					/>
				</div>

				<div>
					<label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
					<input
						id="lastName"
						name="lastName"
						type="text"
						required
						class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						value={form?.lastName || ''}
					/>
				</div>
			</div>

			<div>
				<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					value={form?.email || ''}
				/>
			</div>

			<div>
				<label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
				<input
					id="phone"
					name="phone"
					type="tel"
					required
					class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					value={form?.phone || ''}
				/>
			</div>

			<div>
				<label for="address" class="block text-sm font-medium text-gray-700">Address</label>
				<textarea
					id="address"
					name="address"
					required
					rows="3"
					class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				>{form?.address || ''}</textarea>
			</div>

			<div class="flex gap-2">
				<button
					type="submit"
					disabled={loading}
					class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
				>
					{loading ? 'Creating...' : 'Create Patron'}
				</button>
				<a href="/patrons" class="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400">
					Cancel
				</a>
			</div>
		</form>
	</div>
</div>