<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	let { form } = $props();
	let loading = $state(false);
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold">Add New Book</h1>
		<a href="/books" class="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
			Back to Books
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
				<label for="title" class="block text-sm font-medium text-gray-700">Title</label>
				<input
					id="title"
					name="title"
					type="text"
					required
					class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					value={form?.title || ''}
				/>
			</div>

			<div>
				<label for="author" class="block text-sm font-medium text-gray-700">Author</label>
				<input
					id="author"
					name="author"
					type="text"
					required
					class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					value={form?.author || ''}
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
					class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					value={form?.publicationYear || ''}
				/>
			</div>

			<div>
				<label for="isbn" class="block text-sm font-medium text-gray-700">ISBN</label>
				<input
					id="isbn"
					name="isbn"
					type="text"
					required
					class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					value={form?.isbn || ''}
				/>
			</div>

			<div class="flex gap-2">
				<button
					type="submit"
					disabled={loading}
					class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
				>
					{loading ? 'Creating...' : 'Create Book'}
				</button>
				<a href="/books" class="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400">
					Cancel
				</a>
			</div>
		</form>
	</div>
</div>