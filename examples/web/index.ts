import { scoreResume } from '@abdullah1bit/job-scanner';

const sampleResume = `Paste your resume text here...`;

const result = scoreResume(sampleResume);
document.getElementById('output')!.textContent = JSON.stringify(result, null, 2);
