// const Airtable = require("airtable");
import Airtable from 'airtable'
// Authenticate
Airtable.configure({
  apiKey: "key7diInu3GgCLrlb",
});

// Initialize a base
const base = Airtable.base("appbwdFJoaRz394SJ");

// Reference a table
export const airtable = base("Asian Pulse");
// export const Businesses_airtable = base("Restaurants");
export const Businesses_airtable = base("Businesses");



