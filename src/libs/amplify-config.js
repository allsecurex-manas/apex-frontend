import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports.js';  // ✅ correct path

Amplify.configure(awsExports);

export default Amplify;
