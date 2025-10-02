<script lang="ts">
	import type { Patron } from '$lib/api';

	let { data } = $props();
	const patron: Patron = data.patron;
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold">Patron Details</h1>
		<div class="flex gap-2">
			<a href="/patrons" class="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
				Back to Patrons
			</a>
			<a href="/patrons/{patron.id}/edit" class="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
				Edit Patron
			</a>
		</div>
	</div>

	<div class="rounded-lg border bg-white p-6 shadow-sm">
		<div class="grid gap-6 md:grid-cols-2">
			<div class="space-y-4">
				<div>
					<h3 class="font-semibold text-gray-700">Full Name</h3>
					<p class="text-lg">{patron.firstName} {patron.lastName}</p>
				</div>
				
				<div>
					<h3 class="font-semibold text-gray-700">Email</h3>
					<p class="text-lg">{patron.email}</p>
				</div>
			</div>

			<div class="space-y-4">
				<div>
					<h3 class="font-semibold text-gray-700">Phone</h3>
					<p class="text-lg">{patron.phone}</p>
				</div>
				
				<div>
					<h3 class="font-semibold text-gray-700">Address</h3>
					<p class="text-lg">{patron.address}</p>
				</div>
			</div>
		</div>
	</div>
</div>