const projectId = 'YOUR_INFURA_PROJECT_ID';
const projectSecret = 'YOUR_INFURA_PROJECT_SECRET';

export const auth =
  'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
