import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../App";

describe("Confirmation View", () => {
	it('should show "Inga bokning gjord" if navigating directly to confirmation', () => {
		render(<App />);

		// Vi måste navigera dit manuellt eftersom App startar på "/" (Booking)
		const navIcon = screen.getByRole("navigation").querySelector("img");

		// Öppna menyn och klicka
		fireEvent.click(navIcon);
		const confirmationLink = screen.getByText("Confirmation");
		fireEvent.click(confirmationLink);

		// Assert
		expect(screen.getByText("Inga bokning gjord!")).toBeInTheDocument();
	});
});
