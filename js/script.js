// import * as heroes from "./heroes";
document.addEventListener("DOMContentLoaded", () => {
	const search_input = document.getElementById("search");
	const filter_label = document.getElementById("filter-label");
	const highlight_label = document.getElementById("highligh-label");
	const highlight_checkbox = document.getElementById("highligh-only");
	const heroes_div = document.getElementById("heroes");
	let all_heroes;
	let filter_option = localStorage.getItem("filter-option")
		? localStorage.getItem("filter-option")
		: localStorage.setItem("filter-option", "highlight");

	// Initialize Toggle with localStorage
	if (localStorage.getItem("filter-option") == "highlight") {
		filter_option = "highlight"; // Highlight heroes
		highlight_label.classList.add("selected");
		filter_label.classList.remove("selected");
		highlight_checkbox.checked = true;
	} else {
		filter_option = "filter"; // Filter heroes
		filter_label.classList.add("selected");
		highlight_label.classList.remove("selected");
		highlight_checkbox.checked = false;
	}

	// Check if "Highlight" is checked
	highlight_checkbox.addEventListener("click", () => {
		if (highlight_checkbox.checked) {
			filter_option = "highlight"; // Highlight heroes
			highlight_label.classList.add("selected");
			filter_label.classList.remove("selected");
			localStorage.setItem("filter-option", "highlight");
		} else {
			filter_option = "filter"; // Filter heroes
			filter_label.classList.add("selected");
			highlight_label.classList.remove("selected");
			localStorage.setItem("filter-option", "filter");
		}
	});

	// Loop through filtered objects every button press
	search_input.addEventListener("keyup", () => {
		let filtered_heroes = all_heroes.filter((hero) =>
			hero["localized_name"]
				.toLowerCase()
				.includes(search_input.value.toLowerCase().trim())
		);
		let highlighted_heroes = all_heroes.filter((hero) => {
			// Add a new field on each hero, which indicated if an item should be highlighted
			hero.highlighted = false; // Set it to false by default...
			if (
				hero["localized_name"]
					.toLowerCase()
					.includes(search_input.value.toLowerCase().trim())
			) {
				hero.highlighted = true; // ...and if the name has some of the input letters, highlight it
			}
			return hero;
		});
		heroes_div.innerHTML = ""; // Reset content on every keypress
		if (filter_option == "highlight") {
			if (
				search_input.value.length > 0 &&
				!search_input.value.startsWith(" ")
			) {
				highlightHeroes(highlighted_heroes); // If the input is valid highlight the heroes...
			} else {
				showHeroes(all_heroes); // ...otherwise show all heroes
			}
		} else if (filter_option == "filter") {
			showHeroes(filtered_heroes); // Filter heroes
		}
	});
	// Fetch dota2_heroes.json with the fetch API
	fetch("./data/dota2_heroes.json")
		.then((response) => response.json())
		.then((responseJSON) => {
			all_heroes = responseJSON["heroes"];
			showHeroes(all_heroes);
		});

	function showHeroes(obj) {
		for (var hero of obj) {
			const image_container = document.createElement("div");
			const image = document.createElement("img");
			const name = document.createElement("p");
			const link = document.createElement("a");
			link.href =
				"https://dota2.fandom.com/wiki/" +
				hero["localized_name"].replaceAll(" ", "_");
			image.src = hero["url_vertical_portrait"];
			image_container.setAttribute("class", "image-container");
			name.innerText = hero["localized_name"];
			image.setAttribute("class", "hero-image");
			name.setAttribute("class", "hero-name");
			link.appendChild(image);
			image_container.appendChild(link);
			image_container.appendChild(name);
			heroes_div.appendChild(image_container);
		}
		if (obj.length == 0) {
			const text_node = document.createTextNode("Could not find any heroes.");
			const not_found_text = document.createElement("span");
			not_found_text.setAttribute("id", "not-found-text");
			not_found_text.appendChild(text_node);
			heroes_div.appendChild(not_found_text);
		}
	}
	function highlightHeroes(obj) {
		for (var hero of obj) {
			const image_container = document.createElement("div");
			const image = document.createElement("img");
			const name = document.createElement("p");
			const link = document.createElement("a");
			link.href =
				"https://dota2.fandom.com/wiki/" +
				hero["localized_name"].replaceAll(" ", "_");
			image.src = hero["url_vertical_portrait"];
			image.setAttribute("class", "hero-image");
			image_container.setAttribute("class", "image-container");
			name.innerText = hero["localized_name"];
			name.setAttribute("class", "hero-name");
			link.appendChild(image);
			image_container.appendChild(link);
			image_container.appendChild(name);
			heroes_div.appendChild(image_container);
			if (hero.highlighted == true) {
				image.classList.add("highlighted-image");
			} else {
				image_container.classList.add("dark-image");
			}
		}
	}
});
