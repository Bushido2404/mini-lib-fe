<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { Loan } from '$lib/interfaces';
	import { Alert, Button, Card, Input, Notification } from '$lib/components';

	let { data, form } = $props();
	const loan: Loan = data.loan;
	let loading = $state(false);
</script>

<div class="space-y-6">
	<Notification />
	
	{#if data.error}
		<Alert variant="error" title="Error loading loan">
			{data.error}
		</Alert>
	{/if}

	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold text-gray-900">Return Book</h1>
		<Button variant="secondary">
			<a href="/loans/{loan._id}">Back to Loan</a>
		</Button>
	</div>

	<Card>
		<div class="mb-6">
			<h3 class="text-lg font-semibold text-gray-900 mb-4">Loan Information</h3>
			<div class="bg-gray-50 rounded-lg p-4 space-y-2">
				<div class="flex justify-between">
					<span class="font-medium text-gray-700">Book:</span>
					<span class="text-gray-900">{loan.bookId.title} by {loan.bookId.author}</span>
				</div>
				<div class="flex justify-between">
					<span class="font-medium text-gray-700">Patron:</span>
					<span class="text-gray-900">{loan.patronId.firstName} {loan.patronId.lastName}</span>
				</div>
				<div class="flex justify-between">
					<span class="font-medium text-gray-700">Borrowed Date:</span>
					<span class="text-gray-900">{new Date(loan.borrowedDate).toLocaleDateString()}</span>
				</div>
			</div>
		</div>

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
				<Alert variant="error" title="Error returning book">
					{form.error}
				</Alert>
			{/if}

			<div>
				<label for="returnDate" class="block text-sm font-medium text-gray-700">Return Date</label>
				<Input
					id="returnDate"
					name="returnDate"
					type="date"
					required
					class="mt-1"
					value={form?.returnDate || new Date().toISOString().split('T')[0]}
				/>
			</div>

			<div class="flex justify-end space-x-3">
				<Button variant="secondary">
					<a href="/loans/{loan._id}">Cancel</a>
				</Button>
				<Button
					type="submit"
					disabled={loading}
					variant="primary"
				>
					{loading ? 'Processing...' : 'Mark as Returned'}
				</Button>
			</div>
		</form>
	</Card>
</div>