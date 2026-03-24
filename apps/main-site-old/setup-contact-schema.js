// setup-contact-schema.js
// One-time script to create the Appwrite "Contact Submissions" collection.
// Run: node --env-file=.env setup-contact-schema.js

import { Client, Databases, Permission, Role, IndexType } from "node-appwrite";

// ── Load env vars (using the project's custom naming convention) ──────────────
const ENDPOINT = process.env.APPWRITE_MAIN_SITE_DATABASE_ENDPOINT;
const PROJECT_ID = process.env.APPWRITE_MAIN_SITE_DATABASE_PROJECT_ID;
const API_KEY = process.env.APPWRITE__MAIN_SITE_DATABASE_API_KEY;       // note: double underscore
const DATABASE_ID = process.env.APPWRITE__MAIN_SITE_DATABASE_ID;            // note: double underscore
const COLLECTION_ID = process.env.APPWRITE__MAIN_SITE_DATABASE_CONTACT_COLLECTION_ID; // note: double underscore

// Guard: fail fast if any var is missing
const missing = [
    ["APPWRITE_MAIN_SITE_DATABASE_ENDPOINT", ENDPOINT],
    ["APPWRITE_MAIN_SITE_DATABASE_PROJECT_ID", PROJECT_ID],
    ["APPWRITE__MAIN_SITE_DATABASE_API_KEY", API_KEY],
    ["APPWRITE__MAIN_SITE_DATABASE_ID", DATABASE_ID],
    ["APPWRITE__MAIN_SITE_DATABASE_CONTACT_COLLECTION_ID", COLLECTION_ID],
].filter(([, v]) => !v);

if (missing.length > 0) {
    console.error("❌ Missing environment variables:");
    missing.forEach(([name]) => console.error(`   - ${name}`));
    process.exit(1);
}

// ── Init Appwrite client ──────────────────────────────────────────────────────
const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

async function main() {
    console.log(`\n🚀 Setting up Appwrite schema...`);
    console.log(`   Endpoint   : ${ENDPOINT}`);
    console.log(`   Project    : ${PROJECT_ID}`);
    console.log(`   Database   : ${DATABASE_ID}`);
    console.log(`   Collection : ${COLLECTION_ID}\n`);

    // ── Step 1: Create the Collection ────────────────────────────────────────
    try {
        await databases.createCollection(
            DATABASE_ID,
            COLLECTION_ID,
            "Contact Submissions",
            [
                Permission.create(Role.any()),    // Anyone can submit the form
                Permission.read(Role.users()),    // Only authenticated users (admins) can read
            ]
        );
        console.log(`✅ Collection "${COLLECTION_ID}" created.`);
    } catch (err) {
        if (err.code === 409) {
            console.warn(`⚠️  Collection "${COLLECTION_ID}" already exists — skipping creation.`);
        } else {
            throw err;
        }
    }

    // ── Step 2: Create Attributes ─────────────────────────────────────────────
    // Appwrite requires a small delay between attribute creation calls
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    try {
        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, "name", 255, true);
        console.log("✅ Attribute: name (String, required, max 255)");
        await delay(300);

        await databases.createEmailAttribute(DATABASE_ID, COLLECTION_ID, "email", true);
        console.log("✅ Attribute: email (Email type, required)");
        await delay(300);

        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, "company", 255, false, "");
        console.log("✅ Attribute: company (String, optional, max 255)");
        await delay(300);

        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, "message", 5000, true);
        console.log("✅ Attribute: message (String, required, max 5000)");
        await delay(500); // Extra wait before creating the index
    } catch (err) {
        if (err.code === 409) {
            console.warn("⚠️  One or more attributes already exist — skipping.");
        } else {
            throw err;
        }
    }

    // ── Step 3: Create Index ──────────────────────────────────────────────────
    try {
        await databases.createIndex(
            DATABASE_ID,
            COLLECTION_ID,
            "idx_email",
            IndexType.Key,
            ["email"],
            ["ASC"]
        );
        console.log("✅ Index on 'email' (ASC) created.");
    } catch (err) {
        if (err.code === 409) {
            console.warn("⚠️  Index 'idx_email' already exists — skipping.");
        } else {
            throw err;
        }
    }

    console.log("\n🎉 Schema setup complete! Your collection is ready in Appwrite.\n");
}

main().catch((err) => {
    console.error("\n❌ Schema creation failed:", err.message || err);
    process.exit(1);
});
