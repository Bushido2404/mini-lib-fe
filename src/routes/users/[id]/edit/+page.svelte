<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { User } from '$lib/interfaces';
	import { Alert, Button, Card, Input } from '$lib/components';

	let { data, form } = $props();
	const user: User = data.user;
	let loading = $state(false);
</script>

<div class="space-y-6">
	{#if data.error}
		<Alert variant="error" title="Error loading user">
			{data.error}
		</Alert>
	{/if}

	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold text-gray-900">Edit User</h1>
		<Button variant="secondary">
			<a href="/users/{user._id}">Back to User</a>
		</Button>
	</div>

	<Card>
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
				<Alert variant="error" title="Error updating user">
					{form.error}
				</Alert>
			{/if}

			<div class="grid gap-6 md:grid-cols-2">
				<div>
					<label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
					<Input
						id="firstName"
						name="firstName"
						type="text"
						required
						class="mt-1"
						value={form?.firstName || user.firstName}
					/>
				</div>

				<div>
					<label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
					<Input
						id="lastName"
						name="lastName"
						type="text"
						required
						class="mt-1"
						value={form?.lastName || user.lastName}
					/>
				</div>
			</div>

			<div>
				<label for="username" class="block text-sm font-medium text-gray-700">Username</label>
				<Input
					id="username"
					name="username"
					type="text"
					required
					class="mt-1"
					value={form?.username || user.username}
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-gray-700">Password (leave blank to keep current)</label>
				<Input
					id="password"
					name="password"
					type="password"
					class="mt-1"
				/>
			</div>

			<div>
				<label for="role" class="block text-sm font-medium text-gray-700">Role</label>
				<select
					id="role"
					name="role"
					required
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
				>
					<option value="USER" selected={user.role === 'USER'}>User</option>
					<option value="ADMIN" selected={user.role === 'ADMIN'}>Admin</option>
				</select>
			</div>

			<div class="flex justify-end space-x-3">
				<Button variant="secondary">
					<a href="/users/{user._id}">Cancel</a>
				</Button>
				<Button
					type="submit"
					disabled={loading}
					variant="primary"
				>
					{loading ? 'Updating...' : 'Update User'}
				</Button>
			</div>
		</form>
	</Card>
</div>