<script>
	import Spinner from "./LoadingSpinner.svelte";
	import SvelteTable from "svelte-table";

	let airlines = [],
		arrival_airports = [],
		departure_airports = [];
	let airline_select = "None",
		arrival_select = "None",
		departure_select = "None";

	let _data_lock = false,
		_stats_lock = false;
	let stats = {};
	let rows = [];
	let columns = [
		{
			class: "cell",
			key: "Flight Number",
			title: "Flight Number",
			value: (v) => v["Flight Number"],
			sortable: true,
		},
		{
			key: "Airline",
			title: "Airline",
			value: (v) => v["Airline"],
			sortable: true,
		},
		{
			key: "Departure Airport",
			title: "Departure Airport",
			value: (v) => v["Departure Airport"],
			sortable: true,
		},
		{
			key: "Arrival Airport",
			title: "Arrival Airport",
			value: (v) => v["Arrival Airport"],
			sortable: true,
		},
		{
			key: "Delayed",
			title: "Delayed",
			value: (v) => v["Delayed"],
			sortable: true,
		},
		{
			key: "Delay Time",
			title: "Delay Time",
			value: (v) => (v["Delayed"] ? v["Delay Time"] : "N/A"),
			sortable: true,
		},
		{
			key: "Distance",
			title: "Distance (Mi)",
			value: (v) => v["Distance"],
			sortable: true,
		},
		{
			key: "ItinFare",
			title: "Ticket Price ($)",
			value: (v) => v["ItinFare"],
			sortable: true,
		},
		{
			key: "Departure Time",
			title: "Departure Time",
			value: (v) => v["Departure Time"],
			sortable: true,
		},
		{
			key: "Scheduled Arrival Time",
			title: "Scheduled Arrival Time",
			value: (v) => v["Scheduled Arrival Time"],
			sortable: true,
		},
		{
			key: "Actual Arrival Time",
			title: "Actual Arrival Time",
			value: (v) => v["Actual Arrival Time"],
			sortable: true,
		},
	];

	fetch("http://localhost:5000/get-filter-values")
		.then((data) => data.json())
		.then((jsonData) => {
			console.log(jsonData);
			airlines = ["None", ...jsonData["data"]["airlines"]];
			arrival_airports = [
				"None",
				...jsonData["data"]["arrival_airports"],
			];
			departure_airports = [
				"None",
				...jsonData["data"]["departure_airports"],
			];
		});
	$: airline_select, update_rows();
	$: arrival_select, update_rows();
	$: departure_select, update_rows();

	function update_rows() {
		const airline_filter = airline_select === "None" ? "" : airline_select;
		const arrival_filter = arrival_select === "None" ? "" : arrival_select;
		const departure_filter =
			departure_select === "None" ? "" : departure_select;
		if (!_data_lock) {
			_data_lock = true;
			fetch(
				`http://localhost:5000/get-rows?airline_filter=${airline_filter}&arrival_filter=${arrival_filter}&departure_filter=${departure_filter}`
			)
				.then((data) => data.json())
				.then((jsonData) => {
					rows = jsonData["data"];
					_data_lock = false;
				});
		}

		if (!_stats_lock) {
			_stats_lock = true;
			fetch(
				`http://localhost:5000/get-stats?airline_filter=${airline_filter}&arrival_filter=${arrival_filter}&departure_filter=${departure_filter}`
			)
				.then((data) => data.json())
				.then((jsonData) => {
					stats = jsonData["data"];
					_stats_lock = false;
				});
		}
	}
	update_rows();
</script>

<main>
	{#if airlines.length === 0}
		<Spinner />
		<h1>Loading Flight Data...</h1>
	{:else}
		<h2>Flight Data Filters:</h2>
		<div style="display: inline; margin: 0 1em;">
			{#if airlines.length}
				<span>Airline:</span>
				<select bind:value={airline_select}>
					{#each airlines as airline}
						<option
							value={airline}
							selected={airline_select === airline
								? "selected"
								: ""}
						>
							{airline}
						</option>
					{/each}
				</select>
			{/if}
		</div>
		<div style="display: inline; margin: 0 1em;">
			{#if departure_airports.length}
				<span>Departure Airport:</span>
				<select bind:value={departure_select}>
					{#each departure_airports as airport}
						<option
							value={airport}
							selected={departure_select === airport
								? "selected"
								: ""}
						>
							{airport}
						</option>
					{/each}
				</select>
			{/if}
		</div>
		<div style="display: inline; margin: 0 1em;">
			{#if arrival_airports.length}
				<span>Arrival Airport:</span>
				<select bind:value={arrival_select}>
					{#each arrival_airports as airport}
						<option
							value={airport}
							selected={arrival_select === airport
								? "selected"
								: ""}
						>
							{airport}
						</option>
					{/each}
				</select>
			{/if}
		</div>
		<hr style="border-top: 2px solid #bbb; width: 80%" />
		<!-- {#each rows as row}
		<div>{row}</div>
	{/each} -->
		<h2>Filtered flight data statistics</h2>
		{#if _stats_lock}
			<Spinner hw={60} />
		{:else}
			<div>Total Flights: {stats.total_count}</div>
			<div>Filtered Flights: {stats.filter_count}</div>
			<!-- <div>Delayed Percentage: {stats.delay_pct}%</div> -->
			<div>Average Delay: {stats.average_delay} minutes</div>
			<div>Average Ticket Price: ${stats.average_ticket}</div>
		{/if}
		<hr style="border-top: 2px solid #bbb; width: 80%" />
		<h2>Filtered flights (showing {rows.length})</h2>
		{#if _data_lock}
			<Spinner hw={60} />
		{:else}
			<SvelteTable
				{columns}
				{rows}
				classNameTable="table table1"
				classNameThead="table-primary"
			/>
		{/if}
	{/if}
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 2em;
		font-weight: 100;
	}

	h2 {
		color: #ff3e00;
		margin: 0.3em;
		font-size: 1.5em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	:global(.table1 td.cell) {
		background: rgba(65, 255, 65, 0.178);
	}
</style>
