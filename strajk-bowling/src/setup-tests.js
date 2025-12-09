import { afterEach, beforeAll, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { server } from "./mocks/server";

beforeAll(() => server.listen());

afterEach(() => {
	cleanup();
	server.resetHandlers();
});

afterAll(() => server.close());
