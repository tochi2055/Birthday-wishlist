import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    let serviceAccount: any;

    if (serviceAccountJson) {
      try {
        serviceAccount = JSON.parse(serviceAccountJson);
      } catch (error) {
        console.error("Failed to parse service account JSON:", error);
        throw new Error("Invalid FIREBASE_SERVICE_ACCOUNT_KEY format");
      }
    } else if (projectId && clientEmail && privateKey) {

      let processedPrivateKey: string;
      try {
        processedPrivateKey = privateKey.replace(/\\n/g, "\n");

        // Validate that it looks like a proper private key
        if (
          !processedPrivateKey.includes("-----BEGIN PRIVATE KEY-----") ||
          !processedPrivateKey.includes("-----END PRIVATE KEY-----")
        ) {
          throw new Error(
            "Private key format appears invalid - missing BEGIN/END markers"
          );
        }

      } catch (error) {
        console.error("Error processing private key:", error);
        throw new Error("Failed to process private key");
      }

      serviceAccount = {
        projectId,
        clientEmail,
        privateKey: processedPrivateKey,
      };
    } else {
      throw new Error(
        "Missing Firebase Admin credentials. Please set either FIREBASE_SERVICE_ACCOUNT_KEY (complete JSON) or all of: NEXT_PUBLIC_FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY"
      );
    }

    try {
      initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.projectId || projectId,
      });
    } catch (error) {
      console.error("Failed to initialize Firebase Admin SDK:", error);
      console.error("Service account details:", {
        projectId: serviceAccount.projectId,
        clientEmail: serviceAccount.client_email || serviceAccount.clientEmail,
        hasPrivateKey: !!(
          serviceAccount.private_key || serviceAccount.privateKey
        ),
      });
      throw error;
    }
  }

  return getFirestore();
}

export { initializeFirebaseAdmin };
