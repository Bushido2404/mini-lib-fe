<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { Book } from '$lib/api';

	let { data, form } = $props();
	const book: Book = data.book;
	let loading = $state(false);
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold text-gray-900">Edit Book</h1>
		<a href="/books/{book.id}" class="inline-flex items-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500">
			Back to Book
		</a>
	</div>

	<div class="rounded-lg bg-white p-6 shadow">
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
				<div class="rounded-md bg-red-50 p-4">
					<div class="flex">
						<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
						</svg>
						<div class="ml-3">
							<p class="text-sm text-red-800">{form.error}</p>
						</div>
					</div>
				</div>
			{/if}

			<div>
				<label for="title" class="block text-sm font-medium text-gray-700">Title</label>
				<input
					id="title"
					name="title"
					type="text"
					required
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
					value={form?.title || book.title}
				/>
			</div>

			<div>
				<label for="author" class="block text-sm font-medium text-gray-700">Author</label>
				<input
					id="author"
					name="author"
					type="text"
					required
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
					value={form?.author || book.author}
				/>
			</div>

			<div>
				<label for="publicationYear" class="block text-sm font-medium text-gray-700">Publication Year</label>
				<input
					id="publicationYear"
					name="publicationYear"
					type="number"
					required
					min="1000"
					max="2100"
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
					value={form?.publicationYear || book.publicationYear}
				/>
			</div>

			<div>
				<label for="isbn" class="block text-sm font-medium text-gray-700">ISBN</label>
				<input
					id="isbn"
					name="isbn"
					type="text"
					required
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
					value={form?.isbn || book.isbn}
				/>
			</div>

			<div class="flex justify-end space-x-3">
				<a href="/books/{book.id}" class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
					Cancel
				</a>
				<button
					type="submit"
					disabled={loading}
					class="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
				>
					{loading ? 'Updating...' : 'Update Book'}
				</button>
			</div>
		</form>
	</div>
</div>