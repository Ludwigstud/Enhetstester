import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../App";

describe("Booking View", () => {
	// ----------------------------------------------------------------------------
	// TESTER FÖR VÄL GODKÄNT (VG) - FELHANTERING
	// Dessa tester verifierar att specifika felmeddelanden visas vid felaktig inmatning.
	// ----------------------------------------------------------------------------

	it("should show error message if fields are missing or invalid", async () => {
		// SYFTE: Testa validering av obligatoriska fält.
		// NIVÅ: VG
		// UPPFYLLER ACCEPTANSKRITERIUM (User Story 1):
		// "VG - Ifall användaren inte fyller i något av ovanstående så ska ett felmeddelande visas"

		render(<App />);

		// Action: Jag försöker klicka på "Boka" utan att ha fyllt i datum, tid eller antal spelare.
		fireEvent.click(screen.getByText("strIIIIIike!"));

		// Assert: Jag verifierar att felmeddelandet visas korrekt.
		expect(screen.getByText("Alla fälten måste vara ifyllda")).toBeInTheDocument();
	});

	it("should show error message if number of shoes does not match number of players", async () => {
		// SYFTE: Testa att antal skor matchar antal spelare.
		// NIVÅ: VG
		// UPPFYLLER ACCEPTANSKRITERIUM (User Story 2):
		// "VG - Om antalet personer och skor inte matchas ska ett felmeddelande visas"

		render(<App />);

		// Arrange: Jag fyller i giltig information för 2 spelare.
		fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: "2023-12-24" } });
		fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: "18:00" } });
		fireEvent.change(screen.getByLabelText(/Number of awesome bowlers/i), {
			target: { value: "2" },
		});
		fireEvent.change(screen.getByLabelText(/Number of lanes/i), { target: { value: "1" } });

		// Action: Jag lägger till skostorlek för endast 1 person (trots att det är 2 spelare).
		fireEvent.click(screen.getByText("+"));
		fireEvent.change(screen.getByLabelText(/Shoe size \/ person 1/i), { target: { value: "42" } });

		fireEvent.click(screen.getByText("strIIIIIike!"));

		// Assert: Systemet ska varna om att antalet skor inte stämmer.
		expect(
			screen.getByText("Antalet skor måste stämma överens med antal spelare"),
		).toBeInTheDocument();
	});

	it("should show error message if too many players per lane", async () => {
		// SYFTE: Testa regeln för max antal spelare per bana.
		// NIVÅ: VG
		// UPPFYLLER ACCEPTANSKRITERIUM (User Story 1):
		// "VG - Om det inte finns tillräckligt med lediga banor för det angivna antalet spelare, ska användaren få ett felmeddelande."
		// (Max 4 spelare per bana enligt kravspecifikationen).

		render(<App />);

		// Arrange: Jag försöker boka in 5 spelare på endast 1 bana.
		fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: "2023-12-24" } });
		fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: "18:00" } });
		fireEvent.change(screen.getByLabelText(/Number of awesome bowlers/i), {
			target: { value: "5" },
		});
		fireEvent.change(screen.getByLabelText(/Number of lanes/i), { target: { value: "1" } });

		// Notera: Jag måste fylla i skor för alla 5 för att komma förbi föregående validering.
		for (let i = 0; i < 5; i++) {
			fireEvent.click(screen.getByText("+"));
			const shoeInput = screen.getByLabelText(`Shoe size / person ${i + 1}`);
			fireEvent.change(shoeInput, { target: { value: "40" } });
		}

		// Action: Klickar på boka.
		fireEvent.click(screen.getByText("strIIIIIike!"));

		// Assert: Jag verifierar att systemet stoppar bokningen pga för många spelare per bana.
		expect(screen.getByText("Det får max vara 4 spelare per bana")).toBeInTheDocument();
	});

	// ----------------------------------------------------------------------------
	// TESTER FÖR GODKÄNT (G) - FUNKTIONALITET
	// Dessa tester verifierar "Happy Path" och grundläggande interaktion.
	// ----------------------------------------------------------------------------

	it("should allow adding and removing shoes", async () => {
		// SYFTE: Testa interaktionen med skokomponenten.
		// NIVÅ: G
		// UPPFYLLER ACCEPTANSKRITERIER (User Story 2 & 4):
		// Story 2: "Användaren ska kunna ange skostorlek för varje spelare."
		// Story 4: "Användaren ska kunna ta bort ett tidigare valt fält för skostorlek..."

		render(<App />);

		// Action 1: Lägga till en sko.
		const addShoeButton = screen.getByText("+");
		fireEvent.click(addShoeButton);

		const shoeInput = screen.getByLabelText(/Shoe size \/ person 1/i);
		expect(shoeInput).toBeInTheDocument();

		// Action 2: Ändra storlek.
		fireEvent.change(shoeInput, { target: { value: "42" } });
		expect(shoeInput.value).toBe("42");

		// Action 3: Ta bort skon.
		const removeButton = screen.getByText("-");
		fireEvent.click(removeButton);

		// Assert: Fältet ska vara borta.
		expect(screen.queryByLabelText(/Shoe size \/ person 1/i)).not.toBeInTheDocument();
	});

	it("should be able to complete a booking and navigate to confirmation", async () => {
		// SYFTE: Fullständigt integrationstest av bokningsflödet.
		// NIVÅ: G
		// UPPFYLLER ACCEPTANSKRITERIER (User Story 1, 3 & 5):
		// Story 1: "Användaren ska kunna välja datum/tid/antal spelare/banor."
		// Story 3: "Systemet ska visa en översikt... innan bokningen slutförs." (Vi kollar inputsen).
		// Story 5: "Användaren ska kunna skicka iväg min reservation... få bokningsnummer och totalsumma."
		// Story 5 (Navigering): "Användaren ska kunna navigera från bokningsvyn till bekräftelsevyn."

		render(<App />);

		// Arrange: Jag fyller i alla nödvändiga fält korrekt.
		fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: "2023-12-24" } });
		fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: "18:00" } });
		fireEvent.change(screen.getByLabelText(/Number of awesome bowlers/i), {
			target: { value: "1" },
		});
		fireEvent.change(screen.getByLabelText(/Number of lanes/i), { target: { value: "1" } });

		// Action: Lägger till skor och klickar på Boka.
		fireEvent.click(screen.getByText("+"));
		fireEvent.change(screen.getByLabelText(/Shoe size \/ person 1/i), { target: { value: "42" } });

		const bookButton = screen.getByText("strIIIIIike!");
		fireEvent.click(bookButton);

		// Assert 1: Inväntar navigering till bekräftelsesidan.
		await waitFor(() => {
			expect(screen.getByText("See you soon!")).toBeInTheDocument();
		});

		// Assert 2: Verifierar att bokningsnummer genererats (mockat svar).
		// Uppfyller: "Systemet ska generera ett bokningsnummer och visa detta."
		expect(screen.getByLabelText(/Booking number/i).value).toBe("STR1234XYZ");

		// Assert 3: Verifierar totalpris (1 person * 120 + 1 bana * 100 = 220 kr).
		// Uppfyller: "Systemet ska beräkna och visa den totala summan."
		expect(screen.getByText("220 sek")).toBeInTheDocument();
	});
});
