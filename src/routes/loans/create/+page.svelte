<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { Book, Patron } from '$lib/interfaces';
	import { Alert, Button, Card, Input } from '$lib/components';

	let { data, form } = $props();
	const books: Book[] = data.books;
	const patrons: Patron[] = data.patrons;
	
	let loading = $state(false);
	const selectedBookId = $page.url.searchParams.get('bookId');
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold text-gray-900">Borrow Book</h1>
		<Button variant="secondary">
			<a href="/loans">Back to Loans</a>
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
				<Alert variant="error" title="Error creating loan">
					{form.error}
				</Alert>
			{/if}

			<div>
				<label for="bookId" class="block text-sm font-medium text-gray-700">Book</label>
				<select
					id="bookId"
					name="bookId"
					required
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
				>
					<option value="">Select a book</option>
					{#each books as book}
						<option value={book._id} selected={book._id === selectedBookId}>
							{book.title} by {book.author}
						</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="patronId" class="block text-sm font-medium text-gray-700">Patron</label>
				<select
					id="patronId"
					name="patronId"
					required
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
				>
					<option value="">Select a patron</option>
					{#each patrons as patron}
						<option value={patron._id}>
							{patron.firstName} {patron.lastName} ({patron.email})
						</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="borrowedDate" class="block text-sm font-medium text-gray-700">Borrowed Date</label>
				<Input
					id="borrowedDate"
					name="borrowedDate"
					type="date"
					required
					class="mt-1"
					value={form?.borrowedDate || new Date().toISOString().split('T')[0]}
				/>
			</div>

			<div class="flex justify-end space-x-3">
				<Button variant="secondary">
					<a href="/loans">Cancel</a>
				</Button>
				<Button
					type="submit"
					disabled={loading}
					variant="primary"
				>
					{loading ? 'Creating...' : 'Create Loan'}
				</Button>
			</div>
		</form>
	</Card>
</div>