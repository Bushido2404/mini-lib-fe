<script lang="ts">
	import { page } from '$app/stores';
	import type { Book } from '$lib/interfaces';
	import { filterBooks } from '$lib/api/book';

	let { data } = $props();
	const allBooks: Book[] = data.books;
	const user = data.user;
	// Search and filter state
	let searchTitle = $state($page.url.searchParams.get('title') || '');
	let searchAuthor = $state($page.url.searchParams.get('author') || '');
	let searchYear = $state($page.url.searchParams.get('year') || '');

	// Filtered books based on search criteria
	let books = $derived(
		filterBooks(allBooks, {
			title: searchTitle,
			author: searchAuthor,
			year: searchYear
		})
	);

	function clearFilters() {
		searchTitle = '';
		searchAuthor = '';
		searchYear = '';
	}
</script>

<div class="space-y-6">
	{#if data.error}
		<div class="rounded-md bg-red-50 p-4">
			<div class="flex">
				<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
					<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
				</svg>
				<div class="ml-3">
					<h3 class="text-sm font-medium text-red-800">Error loading books</h3>
					<p class="mt-1 text-sm text-red-700">{data.error}</p>
				</div>
			</div>
		</div>
	{/if}
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold text-gray-900">Books</h1>
		{#if user?.role === 'ADMIN'}
			<a
				href="/books/create"
				class="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
			>
				<svg class="mr-1.5 -ml-0.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
					<path
						d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
					/>
				</svg>
				Add Book
			</a>
		{/if}
	</div>

	<!-- Search and Filter Section -->
	<div class="rounded-lg bg-white p-6 shadow">
		<h3 class="mb-4 text-lg font-medium text-gray-900">Search & Filter</h3>
		<div class="grid gap-4 md:grid-cols-4">
			<div>
				<label for="title" class="block text-sm font-medium text-gray-700">Title</label>
				<input
					id="title"
					type="text"
					bind:value={searchTitle}
					placeholder="Search by title..."
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
				/>
			</div>
			<div>
				<label for="author" class="block text-sm font-medium text-gray-700">Author</label>
				<input
					id="author"
					type="text"
					bind:value={searchAuthor}
					placeholder="Search by author..."
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
				/>
			</div>
			<div>
				<label for="year" class="block text-sm font-medium text-gray-700">Publication Year</label>
				<input
					id="year"
					type="number"
					bind:value={searchYear}
					placeholder="e.g. 2023"
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
				/>
			</div>
			<div class="flex items-end space-x-2">
				<div class="flex items-center justify-center text-sm text-gray-500">
					Showing {books.length} of {allBooks.length} books
				</div>
				<button
					type="button"
					on:click={clearFilters}
					class="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200"
				>
					Clear
				</button>
			</div>
		</div>
	</div>

	{#if books.length === 0}
		<div class="py-12 text-center">
			<svg
				class="mx-auto h-12 w-12 text-gray-400"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
				/>
			</svg>
			<h3 class="mt-2 text-sm font-medium text-gray-900">No books found</h3>
			<p class="mt-1 text-sm text-gray-500">
				{searchTitle || searchAuthor || searchYear
					? 'Try adjusting your search criteria.'
					: 'Get started by adding a new book.'}
			</p>
		</div>
	{:else}
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each books as book}
				<div
					class="group relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
				>
					{#if book.coverPath}
						<div class="aspect-h-3 aspect-w-2 mb-4 overflow-hidden rounded-lg">
							<img
								src="/api/books/{book._id}/download-cover"
								alt="{book.title} cover"
								class="h-full w-full object-cover object-center group-hover:opacity-75"
							/>
						</div>
					{:else}
						<div
							class="aspect-h-3 aspect-w-2 mb-4 flex items-center justify-center rounded-lg bg-gray-100"
						>
							<svg
								class="h-12 w-12 text-gray-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
								/>
							</svg>
						</div>
					{/if}

					<h3 class="mb-2 text-lg font-semibold text-gray-900">
						<a href="/books/{book._id}" class="hover:text-blue-600">
							{book.title}
						</a>
					</h3>
					<p class="mb-1 text-sm text-gray-600">by {book.author}</p>
					<p class="mb-1 text-sm text-gray-500">Published: {book.publicationYear}</p>
					<p class="mb-4 text-xs text-gray-400">ISBN: {book.isbn}</p>

					<div class="flex flex-wrap gap-2">
						<a
							href="/books/{book._id}"
							class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
						>
							View Details
						</a>
						{#if user?.role === 'USER'}
							<a
								href="/loans/create?bookId={book._id}"
								class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-100"
							>
								Borrow
							</a>
						{/if}
						{#if user?.role === 'ADMIN'}
							<a
								href="/books/{book._id}/edit"
								class="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 hover:bg-yellow-100"
							>
								Edit
							</a>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
