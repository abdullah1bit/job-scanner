import { scoreResume, matchResumeToJD } from '@resumepolish/ats-scorer';

const resume = `
Jane Smith
Senior Product Manager
Experience
Senior PM at TechCo 2020 - 2024
• Led launch of 3 products reaching 1M+ users
• Increased retention by 35% through onboarding redesign
• Managed cross-functional team of 12 engineers

PM at StartupCo 2017 - 2020
• Built roadmap for B2B SaaS platform
• Drove 50% revenue growth
• Partnered with sales on enterprise deals

Education
MBA, State University, 2017
BS Economics, State University, 2015

Skills
Product strategy, roadmap planning, user research, A/B testing, SQL, Figma
`.trim();

const jd = `
We are hiring a Senior Product Manager with 5+ years of B2B SaaS experience.
You will own the roadmap, run user research, and drive growth initiatives.
Requirements: SQL, A/B testing, cross-functional leadership.
`.trim();

console.log('=== ATS Score ===');
const ats = scoreResume(resume);
console.log(`Overall: ${ats.overall}/100 (${ats.band})`);
console.log(`Word count: ${ats.wordCount}`);
console.log('\nDimensions:');
for (const [name, dim] of Object.entries(ats.dimensions)) {
  console.log(`  ${name}: ${dim.score}/100 (${dim.status}) - ${dim.label}`);
}

console.log('\n=== Match Score ===');
const match = matchResumeToJD(resume, jd);
console.log(`Match: ${match.score}/100 (${match.band})`);
console.log(`Matched keywords: ${match.matchedKeywords.length}`);
console.log(`Missing keywords: ${match.missingKeywords.map((k) => k.keyword).join(', ')}`);
console.log(`Summary: ${match.summary}`);
