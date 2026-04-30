import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ 
  id: "ghost-creator",
  isDev: process.env.NODE_ENV === "development" || process.env.INNGEST_DEV === "1"
});
