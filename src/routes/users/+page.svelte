<script lang="ts">
	import { page } from '$app/stores';
	import type { User } from '$lib/api';
	import { filterUsers } from '$lib/api';

	let { data } = $props();
	const allUsers: User[] = data.users;

	// Search state
	let searchName = $state($page.url.searchParams.get('name') || '');
	let searchRole = $state($page.url.searchParams.get('role') || '');

	// Filtered users based on search criteria
	let users = $derived(filterUsers(allUsers, {
		name: searchName,
		role: searchRole
	}));

	function clearFilters() {
		searchName = '';
		searchRole = '';
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold text-gray-900">Users</h1>
		<a 
			href="/users/create" 
			class="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
		>
			<svg class="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
				<path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
			</svg>
			Add User
		</a>
	</div>

	<!-- Search Section -->
	<div class="rounded-lg bg-white p-6 shadow">
		<h3 class="text-lg font-medium text-gray-900 mb-4">Search Users</h3>
		<div class="grid gap-4 md:grid-cols-3">
			<div>
				<label for="name" class="block text-sm font-medium text-gray-700">Name</label>
				<input
					id="name"
					type="text"
					bind:value={searchName}
					placeholder="Search by name..."
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
				/>
			</div>
			<div>
				<label for="role" class="block text-sm font-medium text-gray-700">Role</label>
				<select
					id="role"
					bind:value={searchRole}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
				>
					<option value="">All Roles</option>
					<option value="ADMIN">Admin</option>
					<option value="USER">User</option>
				</select>
			</div>
			<div class="flex items-end space-x-2">
				<div class="text-sm text-gray-500 flex items-center justify-center">
					Showing {users.length} of {allUsers.length} users
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

	{#if users.length === 0}
		<div class="text-center py-12">
			<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
			</svg>
			<h3 class="mt-2 text-sm font-medium text-gray-900">No users found</h3>
			<p class="mt-1 text-sm text-gray-500">
				{searchName || searchRole ? 'Try adjusting your search criteria.' : 'Get started by adding a new user.'}
			</p>
		</div>
	{:else}
		<div class="overflow-hidden bg-white shadow sm:rounded-md">
			<ul class="divide-y divide-gray-200">
				{#each users as user}
					<li>
						<a href="/users/{user._id}" class="block hover:bg-gray-50">
							<div class="px-4 py-4 sm:px-6">
								<div class="flex items-center justify-between">
									<div class="flex items-center">
										<div class="flex-shrink-0">
											<div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
												<span class="text-sm font-medium text-white">{user.firstName?.[0] || 'U'}{user.lastName?.[0] || ''}</span>
											</div>
										</div>
										<div class="ml-4">
											<div class="flex items-center">
												<p class="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
												<span class="ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}">
													{user.role}
												</span>
											</div>
											<p class="text-sm text-gray-500">@{user.username}</p>
										</div>
									</div>
									<div class="flex items-center space-x-2">
										<a 
											href="/users/{user._id}/edit" 
											class="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
										>
											Edit
										</a>
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