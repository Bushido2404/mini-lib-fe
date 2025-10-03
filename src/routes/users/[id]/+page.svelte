<script lang="ts">
	import type { User } from '$lib/interfaces';
	import { Alert, Button, Card, Badge, Notification } from '$lib/components';

	let { data } = $props();
	const user: User | null = data.user;
</script>

<div class="space-y-6">
	<Notification />
	
	{#if data.error}
		<Alert variant="error" title="Error loading user">
			{data.error}
		</Alert>
	{/if}

	{#if data.error}
		<Alert variant="error" title="Error loading user">
			{data.error}
		</Alert>
		<Button variant="secondary">
			<a href="/users">Back to Users</a>
		</Button>
	{:else if !user}
		<Alert variant="error" title="User not found">
			The requested user could not be found or has been deleted.
		</Alert>
		<Button variant="secondary">
			<a href="/users">Back to Users</a>
		</Button>
	{:else}
		<div class="flex items-center justify-between">
			<h1 class="text-3xl font-bold text-gray-900">User Details</h1>
			<div class="flex gap-2">
				<Button variant="secondary">
					<a href="/users">Back to Users</a>
				</Button>
				<Button variant="primary">
					<a href="/users/{user._id}/edit">Edit User</a>
				</Button>
				<form method="POST" action="?/delete" class="inline" on:submit={(e) => { if (!confirm('Are you sure you want to delete this user?')) e.preventDefault(); }}>
					<Button variant="danger" type="submit">Delete</Button>
				</form>
			</div>
		</div>

	<Card>
		<div class="flex items-center mb-6">
			<div class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500">
				<span class="text-xl font-medium text-white">
					{user.firstName?.[0] || 'U'}{user.lastName?.[0] || ''}
				</span>
			</div>
			<div class="ml-4">
				<div class="flex items-center gap-2">
					<h2 class="text-2xl font-bold text-gray-900">
						{user.firstName} {user.lastName}
					</h2>
					<Badge variant={user.role === 'ADMIN' ? 'danger' : 'success'}>
						{user.role}
					</Badge>
				</div>
				<p class="text-gray-500">@{user.username}</p>
			</div>
		</div>

		<div class="grid gap-6 md:grid-cols-2">
			<div class="space-y-4">
				<div>
					<h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Personal Information</h3>
					<div class="mt-2 space-y-3">
						<div>
							<dt class="text-sm font-medium text-gray-700">First Name</dt>
							<dd class="text-sm text-gray-900">{user.firstName}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-700">Last Name</dt>
							<dd class="text-sm text-gray-900">{user.lastName}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-700">Username</dt>
							<dd class="text-sm text-gray-900">{user.username}</dd>
						</div>
					</div>
				</div>
			</div>

			<div class="space-y-4">
				<div>
					<h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">System Information</h3>
					<div class="mt-2 space-y-3">
						<div>
							<dt class="text-sm font-medium text-gray-700">Role</dt>
							<dd class="text-sm text-gray-900">{user.role}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-700">Created At</dt>
							<dd class="text-sm text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-700">Updated At</dt>
							<dd class="text-sm text-gray-900">{new Date(user.updatedAt).toLocaleDateString()}</dd>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Card>
	{/if}
</div>