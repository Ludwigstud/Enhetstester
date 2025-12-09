import { http, HttpResponse } from "msw";
//Mockad data för testning
export const handlers = [
	http.post(
		"https://731xy9c2ak.execute-api.eu-north-1.amazonaws.com/booking",
		async ({ request }) => {
			const body = await request.json();

			const price = parseInt(body.people) * 120 + parseInt(body.lanes) * 100;

			const bookingDetails = {
				when: body.when,
				lanes: body.lanes,
				people: body.people,
				shoes: body.shoes,
				price: price,
				bookingId: "STR1234XYZ",
				active: true,
			};

			return HttpResponse.json({ bookingDetails });
		},
	),
];
