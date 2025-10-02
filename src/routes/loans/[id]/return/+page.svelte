<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { Loan } from '$lib/api';

	let { data, form } = $props();
	const loan: Loan = data.loan;
	let loading = $state(false);
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold">Return Book</h1>
		<a href="/loans/{loan.id}" class="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
			Back to Loan
		</a>
	</div>

	<div class="rounded-lg border bg-white p-6 shadow-sm">
		<div class="mb-6 space-y-2">
			<h3 class="text-lg font-semibold">Loan Information</h3>
			<p><strong>Book:</strong> {loan.book?.title} by {loan.book?.author}</p>
			<p><strong>Patron:</strong> {loan.patron?.firstName} {loan.patron?.lastName}</p>
			<p><strong>Borrowed Date:</strong> {new Date(loan.borrowedDate).toLocaleDateString()}</p>
		</div>

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

			<div>
				<label for="returnDate" class="block text-sm font-medium text-gray-700">Return Date</label>
				<input
					id="returnDate"
					name="returnDate"
					type="date"
					required
					class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					value={form?.returnDate || new Date().toISOString().split('T')[0]}
				/>
			</div>

			<div class="flex gap-2">
				<button
					type="submit"
					disabled={loading}
					class="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
				>
					{loading ? 'Processing...' : 'Mark as Returned'}
				</button>
				<a href="/loans/{loan.id}" class="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400">
					Cancel
				</a>
			</div>
		</form>
	</div>
</div>