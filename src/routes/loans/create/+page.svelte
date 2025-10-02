<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { Book, Patron } from '$lib/api';

	let { data, form } = $props();
	const books: Book[] = data.books;
	const patrons: Patron[] = data.patrons;
	
	let loading = $state(false);
	const selectedBookId = $page.url.searchParams.get('bookId');
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold">Borrow Book</h1>
		<a href="/loans" class="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
			Back to Loans
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

			<div>
				<label for="bookId" class="block text-sm font-medium text-gray-700">Book</label>
				<select
					id="bookId"
					name="bookId"
					required
					class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				>
					<option value="">Select a book</option>
					{#each books as book}
						<option value={book.id} selected={book.id === selectedBookId}>
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
					class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				>
					<option value="">Select a patron</option>
					{#each patrons as patron}
						<option value={patron.id}>
							{patron.firstName} {patron.lastName} ({patron.email})
						</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="borrowedDate" class="block text-sm font-medium text-gray-700">Borrowed Date</label>
				<input
					id="borrowedDate"
					name="borrowedDate"
					type="date"
					required
					class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					value={form?.borrowedDate || new Date().toISOString().split('T')[0]}
				/>
			</div>

			<div class="flex gap-2">
				<button
					type="submit"
					disabled={loading}
					class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
				>
					{loading ? 'Creating...' : 'Create Loan'}
				</button>
				<a href="/loans" class="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400">
					Cancel
				</a>
			</div>
		</form>
	</div>
</div>