import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

const hasValidKey = privateKey && privateKey.startsWith('-----BEGIN PRIVATE KEY-----');

const app = getApps().length === 0 
  ? initializeApp(
      hasValidKey && clientEmail && projectId
        ? {
            credential: cert({
              projectId,
              clientEmail,
              privateKey: privateKey.replace(/\\n/g, '\n'),
            }),
          }
        : {
            projectId: projectId || 'dummy-project-id',
          }
    )
  : getApp();

export const auth = getAuth(app);
export default app;