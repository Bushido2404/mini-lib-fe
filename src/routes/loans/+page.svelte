<script lang="ts">
	import { page } from '$app/stores';
	import type { Loan } from '$lib/api';
	import { filterLoans } from '$lib/api';

	let { data } = $props();
	const allLoans: Loan[] = data.loans;
	const user = data.user;

	// Search state
	let searchBook = $state($page.url.searchParams.get('book') || '');
	let searchPatron = $state($page.url.searchParams.get('patron') || '');
	let filterStatus = $state($page.url.searchParams.get('status') || '');

	// Filtered loans based on search criteria
	let loans = $derived(filterLoans(allLoans, {
		book: searchBook,
		patron: searchPatron,
		status: filterStatus
	}));

	function clearFilters() {
		searchBook = '';
		searchPatron = '';
		filterStatus = '';
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString();
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold text-gray-900">
			{user?.role === 'ADMIN' ? 'All Loans' : 'My Loans'}
		</h1>
		<a 
			href="/loans/create" 
			class="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
		>
			<svg class="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
				<path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
			</svg>
			Borrow Book
		</a>
	</div>

	<!-- Search Section -->
	<div class="rounded-lg bg-white p-6 shadow">
		<h3 class="text-lg font-medium text-gray-900 mb-4">Search & Filter Loans</h3>
		<div class="grid gap-4 md:grid-cols-4">
			<div>
				<label for="book" class="block text-sm font-medium text-gray-700">Book Title</label>
				<input
					id="book"
					type="text"
					bind:value={searchBook}
					placeholder="Search by book title..."
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
				/>
			</div>
			<div>
				<label for="patron" class="block text-sm font-medium text-gray-700">Patron Name</label>
				<input
					id="patron"
					type="text"
					bind:value={searchPatron}
					placeholder="Search by patron name..."
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
				/>
			</div>
			<div>
				<label for="status" class="block text-sm font-medium text-gray-700">Status</label>
				<select
					id="status"
					bind:value={filterStatus}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
				>
					<option value="">All Status</option>
					<option value="borrowed">Borrowed</option>
					<option value="returned">Returned</option>
				</select>
			</div>
			<div class="flex items-end space-x-2">
				<div class="text-sm text-gray-500 flex items-center justify-center">
					Showing {loans.length} of {allLoans.length} loans
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

	{#if loans.length === 0}
		<div class="text-center py-12">
			<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
			</svg>
			<h3 class="mt-2 text-sm font-medium text-gray-900">No loans found</h3>
			<p class="mt-1 text-sm text-gray-500">
				{searchBook || searchPatron || filterStatus ? 'Try adjusting your search criteria.' : 'Get started by borrowing a book.'}
			</p>
		</div>
	{:else}
		<div class="overflow-hidden bg-white shadow sm:rounded-md">
			<ul class="divide-y divide-gray-200">
				{#each loans as loan}
					<li>
						<a href="/loans/{loan._id}" class="block hover:bg-gray-50">
							<div class="px-4 py-4 sm:px-6">
								<div class="flex items-center justify-between">
									<div class="flex-1">
										<div class="flex items-center justify-between">
											<p class="text-sm font-medium text-blue-600 truncate">
												{loan.bookId.title}
											</p>
											<div class="ml-2 flex-shrink-0 flex">
												<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {loan.returnDate ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
													{loan.returnDate ? 'Returned' : 'Borrowed'}
												</span>
											</div>
										</div>
										<div class="mt-2 sm:flex sm:justify-between">
											<div class="sm:flex">
												<p class="flex items-center text-sm text-gray-500">
													<svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
														<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
													</svg>
													{loan.patronId.firstName} {loan.patronId.lastName}
												</p>
												<p class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
													<svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
														<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
													</svg>
													Borrowed: {formatDate(loan.borrowedDate)}
												</p>
											</div>
											<div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
												{#if loan.returnDate}
													<svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
														<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
													</svg>
													Returned: {formatDate(loan.returnDate)}
												{:else}
													<svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
														<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
													</svg>
													Not returned yet
												{/if}
											</div>
										</div>
									</div>
									<div class="flex items-center space-x-2">
										{#if user?.role === 'ADMIN' && !loan.returnDate}
											<a 
												href="/loans/{loan._id}/return" 
												class="inline-flex items-center rounded-md bg-green-50 px-2.5 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100"
											>
												Return
											</a>
										{/if}
										<svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
											<path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
										</svg>
									</div>
								</div>
							</div>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>