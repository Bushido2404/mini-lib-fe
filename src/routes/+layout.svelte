<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { goto, invalidateAll } from '$app/navigation';
	import { Button, Badge } from '$lib/components';

	let { data } = $props();
	let user = $derived(data?.user);

	function logout() {
		const form = document.createElement('form');
		form.method = 'POST';
		form.action = '/logout';
		document.body.appendChild(form);
		form.submit();
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
								<Badge variant={user.role === 'ADMIN' ? 'danger' : 'primary'} class="text-blue-100 bg-blue-700">
									{user.role}
								</Badge>
								<Button variant="secondary" size="sm" on:click={logout} class="bg-blue-700 text-white hover:bg-blue-600">
									Logout
								</Button>
							</div>
						</div>
					</div>

					<!-- Mobile menu button -->
					<div class="flex items-center sm:hidden">
						<button
							type="button"
							class="inline-flex items-center justify-center rounded-md p-2 text-blue-200 hover:bg-blue-700 hover:text-white"
							aria-label="Toggle mobile menu"
							onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
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
									<Badge variant={user.role === 'ADMIN' ? 'danger' : 'primary'} size="sm" class="text-blue-200">
										{user.role}
									</Badge>
								</div>
							</div>
							<div class="mt-3 space-y-1">
								<Button variant="secondary" on:click={logout} class="w-full text-left bg-transparent text-white hover:bg-blue-700">
									Logout
								</Button>
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
						<Button variant="secondary" size="sm" class="bg-blue-700 text-white hover:bg-blue-600">
							<a href="/login">Login</a>
						</Button>
					</div>
				</div>
			</div>
		</nav>
	{/if}

	<main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
		<slot />
	</main>
</div>