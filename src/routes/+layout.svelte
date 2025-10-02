<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let { data } = $props();
	const user = data?.user;

	async function logout() {
		await fetch('/logout', { method: 'POST' });
		goto('/login');
	}

	let mobileMenuOpen = $state(false);
</script>

<div class="min-h-screen bg-gray-50">
	{#if user}
		<nav class="bg-blue-800 shadow-lg">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="flex h-16 justify-between">
					<div class="flex">
						<div class="flex flex-shrink-0 items-center">
							<a href="/" class="text-xl font-bold text-white">Mini Library</a>
						</div>

						<!-- Desktop Navigation -->
						<div class="hidden sm:ml-6 sm:flex sm:space-x-8">
							<a
								href="/books"
								class="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:text-blue-200 {$page.url.pathname.startsWith(
									'/books'
								)
									? 'border-b-2 border-blue-200'
									: ''}"
							>
								Books
							</a>

							{#if user.role === 'ADMIN'}
								<a
									href="/users"
									class="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:text-blue-200 {$page.url.pathname.startsWith(
										'/users'
									)
										? 'border-b-2 border-blue-200'
										: ''}"
								>
									Users
								</a>
								<a
									href="/patrons"
									class="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:text-blue-200 {$page.url.pathname.startsWith(
										'/patrons'
									)
										? 'border-b-2 border-blue-200'
										: ''}"
								>
									Patrons
								</a>
								<a
									href="/loans"
									class="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:text-blue-200 {$page.url.pathname.startsWith(
										'/loans'
									)
										? 'border-b-2 border-blue-200'
										: ''}"
								>
									All Loans
								</a>
							{:else if user.role === 'USER'}
								<a
									href="/loans"
									class="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:text-blue-200 {$page.url.pathname.startsWith(
										'/loans'
									)
										? 'border-b-2 border-blue-200'
										: ''}"
								>
									My Loans
								</a>
							{/if}
						</div>
					</div>

					<!-- User Menu -->
					<div class="hidden sm:ml-6 sm:flex sm:items-center">
						<div class="relative ml-3">
							<div class="flex items-center space-x-4">
								<span class="text-sm text-blue-100">
									{user.firstName}
									{user.lastName}
								</span>
								<span
									class="inline-flex items-center rounded-full bg-blue-700 px-2.5 py-0.5 text-xs font-medium text-blue-100"
								>
									{user.role}
								</span>
								<button
									on:click={logout}
									class="rounded-md bg-blue-700 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600"
								>
									Logout
								</button>
							</div>
						</div>
					</div>

					<!-- Mobile menu button -->
					<div class="flex items-center sm:hidden">
						<button
							type="button"
							class="inline-flex items-center justify-center rounded-md p-2 text-blue-200 hover:bg-blue-700 hover:text-white"
							on:click={() => (mobileMenuOpen = !mobileMenuOpen)}
						>
							<svg
								class="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>

			<!-- Mobile menu -->
			{#if mobileMenuOpen}
				<div class="sm:hidden">
					<div class="space-y-1 pt-2 pb-3">
						<a
							href="/books"
							class="block border-l-4 border-transparent py-2 pr-4 pl-3 text-base font-medium text-white hover:border-blue-200 hover:bg-blue-700"
							>Books</a
						>

						{#if user.role === 'ADMIN'}
							<a
								href="/users"
								class="block border-l-4 border-transparent py-2 pr-4 pl-3 text-base font-medium text-white hover:border-blue-200 hover:bg-blue-700"
								>Users</a
							>
							<a
								href="/patrons"
								class="block border-l-4 border-transparent py-2 pr-4 pl-3 text-base font-medium text-white hover:border-blue-200 hover:bg-blue-700"
								>Patrons</a
							>
							<a
								href="/loans"
								class="block border-l-4 border-transparent py-2 pr-4 pl-3 text-base font-medium text-white hover:border-blue-200 hover:bg-blue-700"
								>All Loans</a
							>
						{:else if user.role === 'USER'}
							<a
								href="/loans"
								class="block border-l-4 border-transparent py-2 pr-4 pl-3 text-base font-medium text-white hover:border-blue-200 hover:bg-blue-700"
								>My Loans</a
							>
						{/if}

						<div class="border-t border-blue-700 pt-4">
							<div class="flex items-center px-4">
								<div class="flex-shrink-0">
									<div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
										<span class="text-sm font-medium text-white">{user.firstName?.[0] || 'U'}</span>
									</div>
								</div>
								<div class="ml-3">
									<div class="text-base font-medium text-white">
										{user.firstName}
										{user.lastName}
									</div>
									<div class="text-sm font-medium text-blue-200">{user.role}</div>
								</div>
							</div>
							<div class="mt-3 space-y-1">
								<button
									on:click={logout}
									class="block w-full px-4 py-2 text-left text-base font-medium text-white hover:bg-blue-700"
								>
									Logout
								</button>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</nav>
	{:else if $page.url.pathname !== '/login'}
		<!-- Guest Navigation -->
		<nav class="bg-blue-800 shadow-lg">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="flex h-16 justify-between">
					<div class="flex">
						<div class="flex flex-shrink-0 items-center">
							<a href="/books" class="text-xl font-bold text-white">Mini Library</a>
						</div>
						<div class="hidden sm:ml-6 sm:flex sm:space-x-8">
							<a
								href="/books"
								class="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:text-blue-200"
							>
								Browse Books
							</a>
						</div>
					</div>
					<div class="flex items-center">
						<a
							href="/login"
							class="rounded-md bg-blue-700 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600"
						>
							Login
						</a>
					</div>
				</div>
			</div>
		</nav>
	{/if}

	<main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
		<slot />
	</main>
</div>
