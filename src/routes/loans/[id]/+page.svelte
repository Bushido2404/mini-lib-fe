<script lang="ts">
	import type { Loan } from '$lib/interfaces';
	import { Alert, Button, Card, Badge, Notification } from '$lib/components';

	let { data } = $props();
	const loan: Loan | null = data.loan;
	const user = data.user;
</script>

<div class="space-y-6">
	<Notification />
	
	{#if data.error}
		<Alert variant="error" title="Error loading loan">
			{data.error}
		</Alert>
		<Button variant="secondary">
			<a href="/loans">Back to Loans</a>
		</Button>
	{:else if !loan}
		<Alert variant="error" title="Loan not found">
			The requested loan could not be found or has been deleted.
		</Alert>
		<Button variant="secondary">
			<a href="/loans">Back to Loans</a>
		</Button>
	{:else}
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold text-gray-900">Loan Details</h1>
		<div class="flex gap-2">
			<Button variant="secondary">
				<a href="/loans">Back to Loans</a>
			</Button>
			{#if user?.role === 'ADMIN' && !loan.returnDate}
				<Button variant="primary">
					<a href="/loans/{loan._id}/return">Mark as Returned</a>
				</Button>
			{/if}
			{#if user?.role === 'ADMIN'}
				<form method="POST" action="?/delete" class="inline" on:submit={(e) => { if (!confirm('Are you sure you want to delete this loan?')) e.preventDefault(); }}>
					<Button variant="danger" type="submit">Delete</Button>
				</form>
			{/if}
		</div>
	</div>

	<Card>
		<div class="mb-6">
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-bold text-gray-900">Loan Information</h2>
				<Badge variant={loan.returnDate ? 'success' : 'warning'}>
					{loan.returnDate ? 'Returned' : 'Borrowed'}
				</Badge>
			</div>
		</div>

		<div class="grid gap-6 md:grid-cols-2">
			<div class="space-y-4">
				<div>
					<h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Book Information</h3>
					<div class="mt-2 space-y-3">
						<div>
							<dt class="text-sm font-medium text-gray-700">Title</dt>
							<dd class="text-sm text-gray-900">{loan.bookId.title}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-700">Author</dt>
							<dd class="text-sm text-gray-900">{loan.bookId.author}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-700">ISBN</dt>
							<dd class="text-sm text-gray-900">{loan.bookId.isbn}</dd>
						</div>
					</div>
				</div>
				
				<div>
					<h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Patron Information</h3>
					<div class="mt-2 space-y-3">
						<div>
							<dt class="text-sm font-medium text-gray-700">Name</dt>
							<dd class="text-sm text-gray-900">{loan.patronId.firstName} {loan.patronId.lastName}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-700">Email</dt>
							<dd class="text-sm text-gray-900">{loan.patronId.email}</dd>
						</div>
					</div>
				</div>
			</div>

			<div class="space-y-4">
				<div>
					<h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Loan Timeline</h3>
					<div class="mt-2 space-y-3">
						<div>
							<dt class="text-sm font-medium text-gray-700">Borrowed Date</dt>
							<dd class="text-sm text-gray-900">{new Date(loan.borrowedDate).toLocaleDateString()}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-700">Return Date</dt>
							<dd class="text-sm text-gray-900">
								{loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : 'Not returned yet'}
							</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-700">Created At</dt>
							<dd class="text-sm text-gray-900">{new Date(loan.createdAt).toLocaleDateString()}</dd>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Card>
	{/if}
</div>