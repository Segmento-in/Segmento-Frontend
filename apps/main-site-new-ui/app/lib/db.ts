import { Client, Databases } from "node-appwrite"

export function getAppwriteClient() {
    const endpoint = process.env.APPWRITE_MAIN_SITE_DATABASE_ENDPOINT
    const projectId = process.env.APPWRITE_MAIN_SITE_DATABASE_PROJECT_ID
    const apiKey = process.env.APPWRITE__MAIN_SITE_DATABASE_API_KEY

    if (!endpoint || !projectId || !apiKey) {
        throw new Error("Appwrite configuration is incomplete. Check APPWRITE_MAIN_SITE_DATABASE_ENDPOINT, APPWRITE_MAIN_SITE_DATABASE_PROJECT_ID, and APPWRITE__MAIN_SITE_DATABASE_API_KEY.")
    }

    const client = new Client()
        .setEndpoint(endpoint)
        .setProject(projectId)
        .setKey(apiKey)

    return new Databases(client)
}
