import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { initDatabase, writeDbCombined } from './db-service.js';
import { expandedJobsDatabase } from './expanded-jobs-db-250.js';
import { mockTestQuestionBank } from './mock-questions.js';
import { codeBasedResumeTemplates } from './resume-templates.js';
import { expandedRoleCatalog } from './expanded-roles.js';
import { roundBasedQuestionBank } from './round-questions.js';
import { comprehensiveJobDatabase } from './job-database.js';
import { realJobsDatabase } from './real-jobs-db.js';
import { interviewQuestions } from './interview-questions-100plus.js';
import { jobPlatforms, aiSkillRecommendations, careerRoadmaps, salaryInsights, companyInsights } from './ai-platforms-insights.js';

async function seedDatabase() {
  console.log('🌱 Starting Database Seeding...');

  // Connect to the database
  const dbStatus = await initDatabase();
  console.log(`🔌 Connected to database mode: ${dbStatus.mode}`);

  // Fetch static data
  const jobs = expandedJobsDatabase.getAllJobs();
  const questions = mockTestQuestionBank;
  const templates = codeBasedResumeTemplates;

  const staticDataPayload = [
    { key: 'expandedRoleCatalog', data: expandedRoleCatalog },
    { key: 'roundBasedQuestionBank', data: roundBasedQuestionBank },
    { key: 'comprehensiveJobDatabase', data: {
        fullTimeJobs: comprehensiveJobDatabase.fullTimeJobs,
        internships: comprehensiveJobDatabase.internships,
        partTimeJobs: comprehensiveJobDatabase.partTimeJobs,
        startups: comprehensiveJobDatabase.startups,
        remoteJobs: comprehensiveJobDatabase.remoteJobs,
        consultingRoles: comprehensiveJobDatabase.consultingRoles
      } 
    },
    { key: 'realJobsDatabase', data: { jobs: realJobsDatabase.getAllJobs() } },
    { key: 'interviewQuestions', data: interviewQuestions },
    { key: 'jobPlatforms', data: jobPlatforms },
    { key: 'aiSkillRecommendations', data: aiSkillRecommendations },
    { key: 'careerRoadmaps', data: careerRoadmaps },
    { key: 'salaryInsights', data: salaryInsights },
    { key: 'companyInsights', data: companyInsights }
  ];

  console.log(`📦 Found ${jobs.length} jobs, ${questions.length} questions, and ${templates.length} templates.`);
  console.log(`📦 Found ${staticDataPayload.length} static data bundles to migrate.`);

  // Write to DB
  try {
    await writeDbCombined({
      jobs: jobs,
      questions: questions,
      resumeTemplates: templates,
      staticData: staticDataPayload
    });
    console.log('✅ Seeding complete! All static data is now in the dynamic database.');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  }

  process.exit(0);
}

seedDatabase();
