<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Book } from '$lib/interfaces';
	import { Notification } from '$lib/components';

	let { data } = $props();
	const book: Book | null = data.book;
	const user = data.user;
	let deleting = $state(false);

	let showCoverUpload = $state(false);
	let uploadFile: File | null = $state(null);
	let uploading = $state(false);

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			uploadFile = target.files[0];
		}
	}

	async function uploadCover() {
		if (!uploadFile) return;

		uploading = true;
		try {
			const formData = new FormData();
			formData.append('cover', uploadFile);

			const response = await fetch(`/books/${book._id}/upload-cover`, {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				location.reload();
			}
		} catch (error) {
			console.error('Upload failed:', error);
		} finally {
			uploading = false;
			showCoverUpload = false;
		}
	}
</script>

<div class="space-y-6">
	<Notification />
	
	{#if !book}
		<div class="text-center py-12">
			<h1 class="text-2xl font-bold text-gray-900">Book not found</h1>
			<p class="mt-2 text-gray-600">The book you're looking for doesn't exist or has been deleted.</p>
			<a href="/books" class="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Back to Books</a>
		</div>
	{:else}
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold text-gray-900">{book.title}</h1>
		<div class="flex space-x-3">
			<a
				href="/books"
				class="inline-flex items-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500"
			>
				Back to Books
			</a>
			{#if user?.role === 'ADMIN'}
				<a
					href="/books/{book._id}/edit"
					class="inline-flex items-center rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500"
				>
					Edit Book
				</a>
				<form 
					method="POST" 
					action="?/delete" 
					class="inline" 
					use:enhance={() => {
						if (!confirm('Are you sure you want to delete this book?')) {
							return ({ cancel }) => cancel();
						}
						deleting = true;
						return async ({ result }) => {
							deleting = false;
							if (result.type === 'failure') {
								console.error('Delete failed:', result.data);
							}
						};
					}}
				>
					<button 
						type="submit" 
						disabled={deleting}
						class="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-50"
					>
						{deleting ? 'Deleting...' : 'Delete Book'}
					</button>
				</form>
			{/if}
		</div>
	</div>

	<div class="grid gap-6 lg:grid-cols-3">
		<!-- Book Cover -->
		<div class="lg:col-span-1">
			<div class="aspect-h-4 aspect-w-3 overflow-hidden rounded-lg bg-gray-100">
				{#if book.coverUrl}
					<img
						src={book.coverUrl}
						alt="{book.title} cover"
						class="h-full w-full object-cover object-center"
					/>
				{:else}
					<div class="flex h-full items-center justify-center">
						<svg
							class="h-20 w-20 text-gray-400"
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
			</div>

			{#if user}
				<div class="mt-4 space-y-2">
					{#if user.role === 'ADMIN' || user.role === 'USER'}
						<button
							type="button"
							on:click={() => (showCoverUpload = !showCoverUpload)}
							class="w-full rounded-md bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
						>
							{book.coverUrl ? 'Change Cover' : 'Upload Cover'}
						</button>
					{/if}

					{#if showCoverUpload}
						<div class="space-y-2">
							<input
								type="file"
								accept="image/*"
								on:change={handleFileSelect}
								class="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
							/>
							{#if uploadFile}
								<button
									type="button"
									on:click={uploadCover}
									disabled={uploading}
									class="w-full rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-500 disabled:opacity-50"
								>
									{uploading ? 'Uploading...' : 'Upload'}
								</button>
							{/if}
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Book Details -->
		<div class="lg:col-span-2">
			<div class="rounded-lg bg-white p-6 shadow">
				<div class="space-y-6">
					<div>
						<h3 class="text-lg font-medium text-gray-900">Book Information</h3>
						<div class="mt-4 grid gap-4 sm:grid-cols-2">
							<div>
								<dt class="text-sm font-medium text-gray-500">Author</dt>
								<dd class="mt-1 text-sm text-gray-900">{book.author}</dd>
							</div>
							<div>
								<dt class="text-sm font-medium text-gray-500">Publication Year</dt>
								<dd class="mt-1 text-sm text-gray-900">{book.publicationYear}</dd>
							</div>
							<div>
								<dt class="text-sm font-medium text-gray-500">ISBN</dt>
								<dd class="mt-1 text-sm text-gray-900">{book.isbn}</dd>
							</div>
						</div>
					</div>

					{#if user}
						<div class="border-t border-gray-200 pt-6">
							<h3 class="text-lg font-medium text-gray-900">Actions</h3>
							<div class="mt-4 flex space-x-3">
								<a
									href="/loans/create?bookId={book._id}"
									class="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
								>
									<svg class="mr-1.5 -ml-0.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
										<path
											fill-rule="evenodd"
											d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
											clip-rule="evenodd"
										/>
									</svg>
									Borrow This Book
								</a>

								{#if book.coverUrl}
									<a
										href={book.coverUrl}
										download
										class="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
									>
										<svg class="mr-1.5 -ml-0.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
											<path
												fill-rule="evenodd"
												d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
												clip-rule="evenodd"
											/>
										</svg>
										Download Cover
									</a>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
	{/if}
</div>
