import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../App";

describe("Navigation Component", () => {
	it("should be able to navigate between Booking and Confirmation views", async () => {
		render(<App />);

		// 1. Hitta meny-ikonen (hamburgaren)
		const navIcon = screen.getByRole("navigation").querySelector("img");

		// Klicka på ikonen för att öppna menyn
		fireEvent.click(navIcon);

		// 2. Klicka på "Confirmation"-länken i menyn
		const confirmationLink = screen.getByText("Confirmation");
		fireEvent.click(confirmationLink);

		// 3. Verifiera att vi bytte sida
		// Om man går direkt till Confirmation utan att boka ska denna text visas
		expect(screen.getByText("Inga bokning gjord!")).toBeInTheDocument();

		// 4. Navigera tillbaka till Booking
		fireEvent.click(navIcon); // Öppna menyn igen
		const bookingLink = screen.getByText("Booking");
		fireEvent.click(bookingLink);

		// 5. Verifiera att vi är tillbaka på startsidan
		expect(screen.getByText("When, WHAT & Who")).toBeInTheDocument();
	});
});
