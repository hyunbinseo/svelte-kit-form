<script lang="ts">
	import { enhance } from '$app/forms';
	import { createFormState, createSubmitFunction } from '$lib/index.svelte';

	let { form } = $props();
	const reservationForm = createFormState();

	const getDate = (date = new Date()) =>
		[
			date.getFullYear(),
			(date.getMonth() + 1).toString().padStart(2, '0'),
			date.getDate().toString().padStart(2, '0')
		].join('-');
</script>

<form
	method="post"
	use:enhance={createSubmitFunction({
		formState: reservationForm,
		updateOptions: {
			// By default, `use:enhance` resets the form after submission.
			// The form prop is updated asynchronously after this process.
			// If the form will be hidden after submission, disable reset.
			// This will prevent a blank form from being temporarily shown.
			reset: false
		}
	})}
>
	<!-- By default, `use:enhance` resets the form after submission. -->
	<!-- In this process, fields' default values are not respected. -->
	<!-- This can be worked around by recreating the HTML elements. -->
	<!-- Reference https://github.com/sveltejs/svelte/issues/8220 -->
	{#if !reservationForm.isSubmitted}
		{@const today = getDate()}
		<label>
			<span>Date</span>
			<input type="date" name="date" value={today} min={today} required />
		</label>
		<label>
			<span>Type</span>
			<select name="item" required>
				<option>Breakfast</option>
				<option>Lunch</option>
				<option>Dinner</option>
			</select>
		</label>
		<button disabled={reservationForm.isSubmitting}>
			{!reservationForm.isSubmitting ? 'Reserve' : 'Submitting'}
		</button>
	{:else if form}
		<span>Reservation {form.success ? 'Succeeded' : 'Failed'}</span>
		<button type="button" onclick={() => (reservationForm.is = 'standby')}>
			Make Another Reservation
		</button>
	{/if}
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		row-gap: 0.5rem;
		width: fit-content;
	}
</style>
