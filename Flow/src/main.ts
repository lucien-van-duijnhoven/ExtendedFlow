import { Flow } from "./lib/flow";

// The events are the custom events that you define in the flow.on() method.
const events = ["grayscale", "block"] as const;
type Events = (typeof events)[number];

const flow = new Flow<Events>("assets/npm.png");

flow.on("grayscale", async () => {
	const res = await fetch("http://localhost:4000/grayscale");
	if (res.ok) {
		const json = await res.json();
	} else {
		flow.showResult({
			title: `Error`,
			subtitle: `Something went wrong`,
		});
	}
});

flow.on("block", async () => {
	const res = await fetch("http://localhost:4000/block");
	if (res.ok) {
		const json = await res.json();
	} else {
		flow.showResult({
			title: `Error`,
			subtitle: `Something went wrong`,
		});
	}
});

function showToggleOptions() {
	flow.showResult({
		title: `Toggle grayscale`,
		method: "grayscale",
		dontHideAfterAction: true,
	});

	flow.showResult({
		title: `Toggle block`,
		method: "block",
		dontHideAfterAction: true,
	});
}

flow.run();
