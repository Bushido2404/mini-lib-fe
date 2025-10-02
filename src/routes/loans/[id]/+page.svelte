<script lang="ts">
	import type { Loan } from '$lib/api';

	let { data } = $props();
	const loan: Loan = data.loan;
	const user = data.user;
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold">Loan Details</h1>
		<div class="flex gap-2">
			<a href="/loans" class="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
				Back to Loans
			</a>
			{#if user?.role === 'ADMIN' && !loan.returnDate}
				<a href="/loans/{loan.id}/return" class="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
					Mark as Returned
				</a>
			{/if}
		</div>
	</div>

	<div class="rounded-lg border bg-white p-6 shadow-sm">
		<div class="grid gap-6 md:grid-cols-2">
			<div class="space-y-4">
				<div>
					<h3 class="font-semibold text-gray-700">Book</h3>
					<p class="text-lg">{loan.book?.title || 'Unknown Book'}</p>
					<p class="text-gray-600">by {loan.book?.author || 'Unknown Author'}</p>
				</div>
				
				<div>
					<h3 class="font-semibold text-gray-700">Patron</h3>
					<p class="text-lg">{loan.patron?.firstName} {loan.patron?.lastName}</p>
					<p class="text-gray-600">{loan.patron?.email}</p>
				</div>
			</div>

			<div class="space-y-4">
				<div>
					<h3 class="font-semibold text-gray-700">Borrowed Date</h3>
					<p class="text-lg">{new Date(loan.borrowedDate).toLocaleDateString()}</p>
				</div>
				
				<div>
					<h3 class="font-semibold text-gray-700">Return Date</h3>
					<p class="text-lg">
						{loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : 'Not returned yet'}
					</p>
				</div>

				<div>
					<h3 class="font-semibold text-gray-700">Status</h3>
					<span class="inline-flex rounded-full px-3 py-1 text-sm font-semibold {loan.returnDate ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
						{loan.returnDate ? 'Returned' : 'Borrowed'}
					</span>
				</div>
			</div>
		</div>
	</div>
</div>