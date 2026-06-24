import { scoreResume } from '@resumepolish/ats-scorer';

const sampleResume = `Paste your resume text here...`;

const result = scoreResume(sampleResume);
document.getElementById('output')!.textContent = JSON.stringify(result, null, 2);
