import { google } from "googleapis";

export default async function handler(req, res) {
    try {
        if (req.method !== "GET") {
            return res.status(405).json({
                error: "Method not allowed"
            });
        }

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n")
            },
            scopes: [
                "https://www.googleapis.com/auth/drive.readonly"
            ]
        });

        const drive = google.drive({
            version: "v3",
            auth
        });

        const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

        const response = await drive.files.list({
            q: `'${folderId}' in parents and trashed = false`,
            fields: "files(id,name,mimeType,webViewLink,thumbnailLink,createdTime)",
            orderBy: "createdTime desc"
        });

        const certificates = response.data.files || [];

        return res.status(200).json({
            success: true,
            certificates
        });

    } catch (error) {
        console.error("Google Drive API Error:", error);

        return res.status(500).json({
            success: false,
            error: "Unable to load certificates"
        });
    }
}