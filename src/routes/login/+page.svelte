<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { Alert, Button, Input, Card } from '$lib/components';

	let { form } = $props();
	let loading = $state(false);
</script>

<div class="flex min-h-screen items-center justify-center">
	<div class="w-full max-w-md space-y-8">
		<div class="text-center">
			<h2 class="text-3xl font-bold">Mini Library</h2>
			<p class="mt-2 text-gray-600">Sign in to your account</p>
		</div>

		<Card>
			<form
				method="POST"
				class="space-y-6"
				use:enhance={() => {
					loading = true;
					return async ({ result, update }) => {
						loading = false;
						if (result.type === 'redirect') {
							await invalidateAll();
							goto(result.location);
						} else {
							await update();
						}
					};
				}}
			>
				{#if form?.error}
					<Alert variant="error">
						{form.error}
					</Alert>
				{/if}

				<div>
					<label for="username" class="block text-sm font-medium text-gray-700">Username</label>
					<Input
						id="username"
						name="username"
						type="text"
						required
						value={form?.username || ''}
						class="mt-1"
					/>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
					<Input id="password" name="password" type="password" required class="mt-1" />
				</div>

				<Button type="submit" variant="primary" disabled={loading} class="w-full">
					{loading ? 'Signing in...' : 'Sign in'}
				</Button>
			</form>
		</Card>

		<div class="text-center text-sm text-gray-600">
			<p>Guest access: Browse books without login</p>
			<a href="/books" class="text-blue-600 hover:underline">Browse Books</a>
		</div>
	</div>
</div>
