<script lang="ts">
	import type { User } from '$lib/api';

	let { data } = $props();
	const user: User = data.user;
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold">User Details</h1>
		<div class="flex gap-2">
			<a href="/users" class="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
				Back to Users
			</a>
			<a href="/users/{user.id}/edit" class="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
				Edit User
			</a>
		</div>
	</div>

	<div class="rounded-lg border bg-white p-6 shadow-sm">
		<div class="grid gap-6 md:grid-cols-2">
			<div class="space-y-4">
				<div>
					<h3 class="font-semibold text-gray-700">Full Name</h3>
					<p class="text-lg">{user.firstName} {user.lastName}</p>
				</div>
				
				<div>
					<h3 class="font-semibold text-gray-700">Username</h3>
					<p class="text-lg">{user.username}</p>
				</div>
			</div>

			<div class="space-y-4">
				<div>
					<h3 class="font-semibold text-gray-700">Role</h3>
					<span class="inline-flex rounded-full px-3 py-1 text-sm font-semibold {user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}">
						{user.role}
					</span>
				</div>
			</div>
		</div>
	</div>
</div>