<script lang="ts">
	import { page } from '$app/stores';
	import type { Book } from '$lib/interfaces';
	import { filterBooks } from '$lib/api/book';
	import { Alert, Button, Input, Card, Notification } from '$lib/components';

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
	<Notification />
	
	{#if data.error}
		<Alert variant="error" title="Error loading books">
			{data.error}
		</Alert>
	{/if}
	
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold text-gray-900">Books</h1>
		{#if user?.role === 'ADMIN'}
			<Button variant="primary" class="inline-flex items-center">
				<svg class="mr-1.5 -ml-0.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
					<path
						d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
					/>
				</svg>
				<a href="/books/create">Add Book</a>
			</Button>
		{/if}
	</div>

	<!-- Search and Filter Section -->
	<Card title="Search & Filter">
		<div class="grid gap-4 md:grid-cols-4">
			<div>
				<label for="title" class="block text-sm font-medium text-gray-700">Title</label>
				<Input
					id="title"
					bind:value={searchTitle}
					placeholder="Search by title..."
					class="mt-1"
				/>
			</div>
			<div>
				<label for="author" class="block text-sm font-medium text-gray-700">Author</label>
				<Input
					id="author"
					bind:value={searchAuthor}
					placeholder="Search by author..."
					class="mt-1"
				/>
			</div>
			<div>
				<label for="year" class="block text-sm font-medium text-gray-700">Publication Year</label>
				<Input
					id="year"
					type="number"
					bind:value={searchYear}
					placeholder="e.g. 2023"
					class="mt-1"
				/>
			</div>
			<div class="flex items-end space-x-2">
				<div class="flex items-center justify-center text-sm text-gray-500">
					Showing {books.length} of {allBooks.length} books
				</div>
				<Button variant="secondary" size="sm" on:click={clearFilters}>
					Clear
				</Button>
			</div>
		</div>
	</Card>

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
				<Card clickable on:cardClick={() => window.location.href = `/books/${book._id}`}>
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
					
					<div slot="actions" class="flex flex-wrap gap-2" onclick={(e) => e.stopPropagation()}>
						<Button variant="outline" size="sm">
							<a href="/books/{book._id}">View Details</a>
						</Button>
						{#if user?.role === 'USER'}
							<Button variant="primary" size="sm">
								<a href="/loans/create?bookId={book._id}">Borrow</a>
							</Button>
						{/if}
						{#if user?.role === 'ADMIN'}
							<Button variant="secondary" size="sm">
								<a href="/books/{book._id}/edit">Edit</a>
							</Button>
						{/if}
					</div>
				</Card>
			{/each}
		</div>
	{/if}
</div>