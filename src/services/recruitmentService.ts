import { JobOpening, Candidate, CandidateStage, Interview } from '../types';
import { INITIAL_JOB_OPENINGS, INITIAL_CANDIDATES } from './mockDb';
import { getFromStorage, saveToStorage } from './storage';

export const recruitmentService = {
  getJobs: async (): Promise<JobOpening[]> => {
    return getFromStorage<JobOpening[]>('jobs', INITIAL_JOB_OPENINGS);
  },

  createJob: async (data: Partial<JobOpening>): Promise<JobOpening> => {
    const jobs = getFromStorage<JobOpening[]>('jobs', INITIAL_JOB_OPENINGS);
    const newJob: JobOpening = {
      id: `job-${Date.now()}`,
      organizationId: data.organizationId || 'org-1',
      title: data.title || 'Untitled Role',
      department: data.department || 'Engineering',
      location: data.location || 'San Francisco HQ',
      type: data.type || 'Full-time',
      experienceRequired: data.experienceRequired || '2-5 years',
      positions: data.positions || 1,
      applicationsCount: 0,
      status: 'Active',
      salaryRange: data.salaryRange || '$100,000 - $130,000',
      postedDate: new Date().toISOString().split('T')[0],
      deadline: data.deadline || '2024-07-01',
      description: data.description || '',
      requirements: data.requirements || [],
    };
    const updated = [newJob, ...jobs];
    saveToStorage('jobs', updated);
    return newJob;
  },

  getCandidates: async (): Promise<Candidate[]> => {
    return getFromStorage<Candidate[]>('candidates', INITIAL_CANDIDATES);
  },

  updateCandidateStage: async (candidateId: string, stage: CandidateStage): Promise<Candidate> => {
    const list = getFromStorage<Candidate[]>('candidates', INITIAL_CANDIDATES);
    const index = list.findIndex(c => c.id === candidateId);
    if (index === -1) throw new Error('Candidate not found');
    list[index].stage = stage;
    saveToStorage('candidates', list);
    return list[index];
  },

  scheduleInterview: async (candidateId: string, interviewData: Partial<Interview>): Promise<Interview> => {
    const candidates = getFromStorage<Candidate[]>('candidates', INITIAL_CANDIDATES);
    const index = candidates.findIndex(c => c.id === candidateId);
    if (index === -1) throw new Error('Candidate not found');
    
    const newInterview: Interview = {
      id: `int-${Date.now()}`,
      candidateId,
      candidateName: candidates[index].name,
      jobTitle: candidates[index].jobTitle,
      interviewerId: interviewData.interviewerId || 'user-manager',
      interviewerName: interviewData.interviewerName || 'Amit Verma',
      stage: interviewData.stage || 'Technical Interview',
      date: interviewData.date || '2024-05-25',
      time: interviewData.time || '10:00 AM',
      durationMinutes: interviewData.durationMinutes || 45,
      meetingLink: interviewData.meetingLink || 'https://meet.google.com/xyz-hrm',
      status: 'Scheduled',
    };
    
    candidates[index].interviews = [...(candidates[index].interviews || []), newInterview];
    candidates[index].stage = 'Interview';
    saveToStorage('candidates', candidates);
    return newInterview;
  }
};
