import { Storage } from '@google-cloud/storage';

const GOOGLE_CLOUD_PROJECT_ID = 'cosmic-talent-239216'; // Replace with your project ID
const GOOGLE_CLOUD_KEYFILE = 'evidencijaLaboratorijskeOpreme-00294fa01c04.json'; // Replace with the path to the downloaded private key

export const storage = new Storage({
    projectId: GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: GOOGLE_CLOUD_KEYFILE,
});