import { setupServer } from "msw/node";
import { handlers } from "./handlers";
// Startar servern
export const server = setupServer(...handlers);
