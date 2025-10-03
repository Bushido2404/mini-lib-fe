<script lang="ts">
	import { page } from '$app/stores';
	import type { Loan } from '$lib/interfaces';
	import { filterLoans } from '$lib/api/loan';
	import { Alert, Button, Input, Card, Badge, Notification } from '$lib/components';

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
	<Notification />
	
	{#if data.error}
		<Alert variant="error" title="Error loading loans">
			{data.error}
		</Alert>
	{/if}
	
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold text-gray-900">
			{user?.role === 'ADMIN' ? 'All Loans' : 'My Loans'}
		</h1>
		<Button variant="primary" class="inline-flex items-center">
			<svg class="mr-1.5 -ml-0.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
				<path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
			</svg>
			<a href="/loans/create">Borrow Book</a>
		</Button>
	</div>

	<!-- Search Section -->
	<Card title="Search & Filter Loans">
		<div class="grid gap-4 md:grid-cols-4">
			<div>
				<label for="book" class="block text-sm font-medium text-gray-700">Book Title</label>
				<Input
					id="book"
					bind:value={searchBook}
					placeholder="Search by book title..."
					class="mt-1"
				/>
			</div>
			<div>
				<label for="patron" class="block text-sm font-medium text-gray-700">Patron Name</label>
				<Input
					id="patron"
					bind:value={searchPatron}
					placeholder="Search by patron name..."
					class="mt-1"
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
				<Button variant="secondary" size="sm" on:click={clearFilters}>
					Clear
				</Button>
			</div>
		</div>
	</Card>

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
		<div class="space-y-4">
			{#each loans as loan}
				<Card clickable on:cardClick={() => window.location.href = `/loans/${loan._id}`}>
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<div class="flex items-center justify-between">
								<p class="text-sm font-medium text-blue-600 truncate">
									{loan.bookId.title}
								</p>
								<Badge variant={loan.returnDate ? 'success' : 'warning'}>
									{loan.returnDate ? 'Returned' : 'Borrowed'}
								</Badge>
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
					</div>
					
					<div slot="actions" class="flex items-center space-x-2" onclick={(e) => e.stopPropagation()}>
						{#if user?.role === 'ADMIN' && !loan.returnDate}
							<Button variant="primary" size="sm">
								<a href="/loans/{loan._id}/return">Return</a>
							</Button>
						{/if}
						<svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
						</svg>
					</div>
				</Card>
			{/each}
		</div>
	{/if}
</div>