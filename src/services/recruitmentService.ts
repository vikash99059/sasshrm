import {
  JobOpening,
  Candidate,
  CandidateStage,
  Interview,
  ManpowerRequirement,
  JobRequisition,
  JobApplication,
  ResumeDocument,
  InterviewEvaluation,
  JobOffer,
  OnboardingHandover
} from '../types';
import {
  INITIAL_JOB_OPENINGS,
  INITIAL_CANDIDATES,
  INITIAL_MANPOWER_REQUIREMENTS,
  INITIAL_JOB_REQUISITIONS,
  INITIAL_APPLICATIONS,
  INITIAL_RESUMES,
  INITIAL_EVALUATIONS,
  INITIAL_OFFERS,
  INITIAL_HANDOVERS,
} from './mockDb';
import { getFromStorage, saveToStorage } from './storage';

export const recruitmentService = {
  // =========================================================================
  // 1. JOBS
  // =========================================================================
  getJobs: async (): Promise<JobOpening[]> => {
    return getFromStorage<JobOpening[]>('jobs', INITIAL_JOB_OPENINGS);
  },

  getJobById: async (id: string): Promise<JobOpening | undefined> => {
    const jobs = await recruitmentService.getJobs();
    return jobs.find((j) => j.id === id);
  },

  createJob: async (data: Partial<JobOpening>): Promise<JobOpening> => {
    const jobs = await recruitmentService.getJobs();
    const newJob: JobOpening = {
      id: `job-${Date.now()}`,
      organizationId: data.organizationId || 'org-1',
      title: data.title || 'Untitled Role',
      department: data.department || 'Engineering',
      designation: data.designation || data.title,
      location: data.location || 'San Francisco HQ',
      type: data.type || 'Full-time',
      workMode: data.workMode || 'Hybrid',
      experienceRequired: data.experienceRequired || '2-5 years',
      education: data.education || "Bachelor's Degree",
      skills: data.skills || ['Communication', 'Teamwork'],
      positions: data.positions || 1,
      applicationsCount: 0,
      status: data.status || 'Active',
      salaryRange: data.salaryRange || '$100,000 - $130,000',
      postedDate: new Date().toISOString().split('T')[0],
      deadline: data.deadline || '2025-08-31',
      description: data.description || '',
      responsibilities: data.responsibilities || [],
      requirements: data.requirements || [],
      benefits: data.benefits || ['Comprehensive Health', '401k Match', 'Flexible PTO'],
      hiringManager: data.hiringManager || 'David Miller',
      recruiterName: data.recruiterName || 'Elena Rostova',
      viewsCount: 0,
      shortlistedCount: 0,
      interviewsCount: 0,
      selectedCount: 0,
      hiredCount: 0,
    };
    const updated = [newJob, ...jobs];
    saveToStorage('jobs', updated);
    return newJob;
  },

  updateJob: async (id: string, updates: Partial<JobOpening>): Promise<JobOpening> => {
    const jobs = await recruitmentService.getJobs();
    const index = jobs.findIndex((j) => j.id === id);
    if (index === -1) throw new Error('Job not found');
    jobs[index] = { ...jobs[index], ...updates };
    saveToStorage('jobs', jobs);
    return jobs[index];
  },

  deleteJob: async (id: string): Promise<void> => {
    const jobs = await recruitmentService.getJobs();
    const filtered = jobs.filter((j) => j.id !== id);
    saveToStorage('jobs', filtered);
  },

  // =========================================================================
  // 2. CANDIDATES
  // =========================================================================
  getCandidates: async (): Promise<Candidate[]> => {
    return getFromStorage<Candidate[]>('candidates', INITIAL_CANDIDATES);
  },

  getCandidateById: async (id: string): Promise<Candidate | undefined> => {
    const candidates = await recruitmentService.getCandidates();
    return candidates.find((c) => c.id === id);
  },

  createCandidate: async (data: Partial<Candidate>): Promise<Candidate> => {
    const candidates = await recruitmentService.getCandidates();
    const newCand: Candidate = {
      id: `cand-${Date.now()}`,
      organizationId: data.organizationId || 'org-1',
      jobId: data.jobId || 'job-1',
      jobTitle: data.jobTitle || 'General Applicant',
      name: data.name || 'New Candidate',
      email: data.email || 'candidate@example.com',
      phone: data.phone || '+1 (555) 000-0000',
      avatar:
        data.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      currentCompany: data.currentCompany || 'Self Employed',
      currentRole: data.currentRole || 'Software Professional',
      experienceYears: data.experienceYears || 3,
      stage: data.stage || 'Applied',
      rating: data.rating || 4.0,
      appliedDate: new Date().toISOString().split('T')[0],
      expectedSalary: data.expectedSalary || '$120,000',
      noticePeriod: data.noticePeriod || '30 Days',
      resumeUrl: data.resumeUrl || '#',
      notes: data.notes || '',
      interviews: [],
      location: data.location || 'Remote',
      source: data.source || 'Career Page',
      skills: data.skills || ['JavaScript', 'Problem Solving'],
      education: data.education || 'B.S. in Computer Science',
      recruiterName: data.recruiterName || 'Elena Rostova',
      priority: data.priority || 'Medium',
      talentPool: !!data.talentPool,
      status: data.status || 'Active',
      screeningScore: data.screeningScore || 80,
      screeningStatus: data.screeningStatus || 'Pending',
    };
    const updated = [newCand, ...candidates];
    saveToStorage('candidates', updated);
    return newCand;
  },

  updateCandidate: async (id: string, updates: Partial<Candidate>): Promise<Candidate> => {
    const candidates = await recruitmentService.getCandidates();
    const index = candidates.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Candidate not found');
    candidates[index] = { ...candidates[index], ...updates };
    saveToStorage('candidates', candidates);
    return candidates[index];
  },

  updateCandidateStage: async (candidateId: string, stage: CandidateStage): Promise<Candidate> => {
    const list = await recruitmentService.getCandidates();
    const index = list.findIndex((c) => c.id === candidateId);
    if (index === -1) throw new Error('Candidate not found');
    list[index].stage = stage;
    saveToStorage('candidates', list);
    return list[index];
  },

  deleteCandidate: async (id: string): Promise<void> => {
    const candidates = await recruitmentService.getCandidates();
    const filtered = candidates.filter((c) => c.id !== id);
    saveToStorage('candidates', filtered);
  },

  // =========================================================================
  // 3. MANPOWER REQUIREMENTS
  // =========================================================================
  getManpowerRequirements: async (): Promise<ManpowerRequirement[]> => {
    return getFromStorage<ManpowerRequirement[]>('manpower_reqs', INITIAL_MANPOWER_REQUIREMENTS);
  },

  createManpowerRequirement: async (
    data: Partial<ManpowerRequirement>
  ): Promise<ManpowerRequirement> => {
    const list = await recruitmentService.getManpowerRequirements();
    const newReq: ManpowerRequirement = {
      id: `MPR-2025-${String(list.length + 1).padStart(3, '0')}`,
      organizationId: data.organizationId || 'org-1',
      department: data.department || 'Engineering',
      position: data.position || 'Software Engineer',
      requiredHeadcount: data.requiredHeadcount || 1,
      existingHeadcount: data.existingHeadcount || 5,
      requiredDate: data.requiredDate || '2025-07-31',
      priority: data.priority || 'Medium',
      requestedBy: data.requestedBy || 'David Miller',
      requestedByRole: data.requestedByRole || 'Department Lead',
      approvalStatus: 'Pending Approval',
      reason: data.reason || 'Team capacity expansion',
      budgetAllocated: data.budgetAllocated || '$120,000 - $140,000',
      notes: data.notes,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newReq, ...list];
    saveToStorage('manpower_reqs', updated);
    return newReq;
  },

  updateManpowerStatus: async (
    id: string,
    status: ManpowerRequirement['approvalStatus'],
    approverName?: string
  ): Promise<ManpowerRequirement> => {
    const list = await recruitmentService.getManpowerRequirements();
    const index = list.findIndex((m) => m.id === id);
    if (index === -1) throw new Error('Requirement not found');
    list[index].approvalStatus = status;
    if (approverName) list[index].approvedBy = approverName;
    saveToStorage('manpower_reqs', list);
    return list[index];
  },

  // =========================================================================
  // 4. JOB REQUISITIONS
  // =========================================================================
  getJobRequisitions: async (): Promise<JobRequisition[]> => {
    return getFromStorage<JobRequisition[]>('job_requisitions', INITIAL_JOB_REQUISITIONS);
  },

  createJobRequisition: async (data: Partial<JobRequisition>): Promise<JobRequisition> => {
    const list = await recruitmentService.getJobRequisitions();
    const newReq: JobRequisition = {
      id: `REQ-2025-${String(list.length + 101).padStart(3, '0')}`,
      organizationId: data.organizationId || 'org-1',
      manpowerRequirementId: data.manpowerRequirementId,
      jobTitle: data.jobTitle || 'New Role Requisition',
      department: data.department || 'Engineering',
      location: data.location || 'San Francisco / Remote',
      employmentType: data.employmentType || 'Full-time',
      positions: data.positions || 1,
      priority: data.priority || 'Medium',
      requestedBy: data.requestedBy || 'David Miller',
      hiringManager: data.hiringManager || 'David Miller',
      recruiterName: data.recruiterName || 'Elena Rostova',
      approvalStatus: 'Pending Approval',
      businessJustification: data.businessJustification || 'Strategic project delivery',
      requiredSkills: data.requiredSkills || ['Communication'],
      experienceRequired: data.experienceRequired || '3-5 years',
      salaryRange: data.salaryRange || '$110,000 - $140,000',
      targetJoiningDate: data.targetJoiningDate || '2025-07-15',
      createdDate: new Date().toISOString().split('T')[0],
      deadline: data.deadline || '2025-06-30',
      approvalHistory: [
        {
          approver: data.requestedBy || 'David Miller',
          role: 'Requester',
          status: 'Pending',
          date: new Date().toISOString().split('T')[0],
          comment: 'Submitted requisition for review',
        },
      ],
      recruitmentProgress: { applications: 0, screened: 0, interviewing: 0, offered: 0, hired: 0 },
    };
    const updated = [newReq, ...list];
    saveToStorage('job_requisitions', updated);
    return newReq;
  },

  updateRequisitionStatus: async (
    id: string,
    status: JobRequisition['approvalStatus'],
    comment?: string,
    approver = 'Alex Johnson (VP Operations)'
  ): Promise<JobRequisition> => {
    const list = await recruitmentService.getJobRequisitions();
    const index = list.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Requisition not found');
    list[index].approvalStatus = status;
    list[index].approvalHistory.push({
      approver,
      role: 'Operations Reviewer',
      status: status === 'Approved' ? 'Approved' : 'Rejected',
      date: new Date().toISOString().split('T')[0],
      comment: comment || `Status updated to ${status}`,
    });
    saveToStorage('job_requisitions', list);
    return list[index];
  },

  // =========================================================================
  // 5. APPLICATIONS
  // =========================================================================
  getApplications: async (): Promise<JobApplication[]> => {
    return getFromStorage<JobApplication[]>('job_applications', INITIAL_APPLICATIONS);
  },

  updateApplicationStage: async (
    id: string,
    newStage: CandidateStage,
    comment?: string
  ): Promise<JobApplication> => {
    const list = await recruitmentService.getApplications();
    const index = list.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Application not found');
    list[index].currentStage = newStage;
    list[index].timeline.push({
      stage: newStage,
      date: new Date().toISOString().split('T')[0],
      updatedBy: 'Elena Rostova',
      comment: comment || `Moved to ${newStage}`,
    });
    saveToStorage('job_applications', list);
    return list[index];
  },

  // =========================================================================
  // 6. RESUMES
  // =========================================================================
  getResumes: async (): Promise<ResumeDocument[]> => {
    return getFromStorage<ResumeDocument[]>('resume_documents', INITIAL_RESUMES);
  },

  uploadResume: async (data: Partial<ResumeDocument>): Promise<ResumeDocument> => {
    const list = await recruitmentService.getResumes();
    const newDoc: ResumeDocument = {
      id: `RES-${String(list.length + 1).padStart(3, '0')}`,
      organizationId: data.organizationId || 'org-1',
      candidateId: data.candidateId || `cand-${Date.now()}`,
      candidateName: data.candidateName || 'New Candidate',
      candidateEmail: data.candidateEmail || 'candidate@email.com',
      candidateAvatar:
        data.candidateAvatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      jobApplied: data.jobApplied || 'Frontend Developer',
      fileName: data.fileName || 'resume_document.pdf',
      fileSize: data.fileSize || '1.2 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      resumeStatus: 'Verified',
      screeningStatus: 'Pending',
      extractedSkills: data.extractedSkills || ['React', 'TypeScript', 'CSS', 'APIs'],
      extractedExperience: data.extractedExperience || '3+ years experience',
      extractedEducation: data.extractedEducation || 'B.S. in Computer Science',
      matchScore: data.matchScore || 85,
      downloadUrl: '#',
    };
    const updated = [newDoc, ...list];
    saveToStorage('resume_documents', updated);
    return newDoc;
  },

  // =========================================================================
  // 7. INTERVIEWS
  // =========================================================================
  getInterviews: async (): Promise<Interview[]> => {
    const candidates = await recruitmentService.getCandidates();
    const all = candidates.flatMap((c) => c.interviews || []);
    return all;
  },

  scheduleInterview: async (
    candidateId: string,
    interviewData: Partial<Interview>
  ): Promise<Interview> => {
    const candidates = await recruitmentService.getCandidates();
    const index = candidates.findIndex((c) => c.id === candidateId);
    if (index === -1) throw new Error('Candidate not found');

    const newInterview: Interview = {
      id: `int-${Date.now()}`,
      candidateId,
      candidateName: candidates[index].name,
      jobTitle: candidates[index].jobTitle,
      interviewerId: interviewData.interviewerId || 'user-manager',
      interviewerName: interviewData.interviewerName || 'David Miller',
      stage: interviewData.stage || 'Technical Round',
      date: interviewData.date || new Date().toISOString().split('T')[0],
      time: interviewData.time || '02:00 PM',
      durationMinutes: interviewData.durationMinutes || 45,
      meetingLink: interviewData.meetingLink || 'https://meet.google.com/xyz-hrm-meet',
      status: 'Scheduled',
    };

    candidates[index].interviews = [...(candidates[index].interviews || []), newInterview];
    candidates[index].stage = 'Interview';
    saveToStorage('candidates', candidates);
    return newInterview;
  },

  updateInterviewStatus: async (
    interviewId: string,
    status: Interview['status'],
    feedback?: string,
    score?: number
  ): Promise<void> => {
    const candidates = await recruitmentService.getCandidates();
    let updated = false;
    candidates.forEach((cand) => {
      cand.interviews?.forEach((iv) => {
        if (iv.id === interviewId) {
          iv.status = status;
          if (feedback) iv.feedback = feedback;
          if (score !== undefined) iv.score = score;
          updated = true;
        }
      });
    });
    if (updated) {
      saveToStorage('candidates', candidates);
    }
  },

  // =========================================================================
  // 8. EVALUATIONS
  // =========================================================================
  getEvaluations: async (): Promise<InterviewEvaluation[]> => {
    return getFromStorage<InterviewEvaluation[]>('interview_evals', INITIAL_EVALUATIONS);
  },

  submitEvaluation: async (
    data: Partial<InterviewEvaluation>
  ): Promise<InterviewEvaluation> => {
    const list = await recruitmentService.getEvaluations();
    const existingIdx = list.findIndex((e) => e.id === data.id);

    const evaluation: InterviewEvaluation = {
      id: data.id || `EVAL-${String(list.length + 1).padStart(3, '0')}`,
      organizationId: data.organizationId || 'org-1',
      candidateId: data.candidateId || 'cand-1',
      candidateName: data.candidateName || 'Candidate',
      candidateAvatar:
        data.candidateAvatar ||
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      jobTitle: data.jobTitle || 'Role',
      interviewId: data.interviewId || 'int-1',
      interviewRound: data.interviewRound || 'Technical Interview',
      interviewerId: data.interviewerId || 'user-manager',
      interviewerName: data.interviewerName || 'David Miller',
      interviewerRole: data.interviewerRole || 'Interviewer',
      evaluationDate: new Date().toISOString().split('T')[0],
      status: 'Completed',
      scores: data.scores || {
        technicalSkills: 4,
        communication: 4,
        problemSolving: 4,
        experience: 4,
        cultureFit: 4,
      },
      overallRating: data.overallRating || 4.2,
      strengths: data.strengths || ['Good communication', 'Sound technical approach'],
      weaknesses: data.weaknesses || ['Could improve test coverage depth'],
      comments: data.comments || 'Recommended to proceed to the next stage.',
      recommendation: data.recommendation || 'Hire',
    };

    if (existingIdx !== -1) {
      list[existingIdx] = evaluation;
    } else {
      list.unshift(evaluation);
    }
    saveToStorage('interview_evals', list);
    return evaluation;
  },

  // =========================================================================
  // 9. OFFERS
  // =========================================================================
  getOffers: async (): Promise<JobOffer[]> => {
    return getFromStorage<JobOffer[]>('job_offers', INITIAL_OFFERS);
  },

  createOffer: async (data: Partial<JobOffer>): Promise<JobOffer> => {
    const list = await recruitmentService.getOffers();
    const newOffer: JobOffer = {
      id: `OFF-2025-${String(list.length + 1).padStart(2, '0')}`,
      organizationId: data.organizationId || 'org-1',
      candidateId: data.candidateId || 'cand-1',
      candidateName: data.candidateName || 'Candidate',
      candidateEmail: data.candidateEmail || 'candidate@email.com',
      candidateAvatar:
        data.candidateAvatar ||
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      jobId: data.jobId || 'job-1',
      jobTitle: data.jobTitle || 'Engineer',
      department: data.department || 'Engineering',
      salaryAnnual: data.salaryAnnual || 135000,
      salaryFormatted: data.salaryFormatted || `$${(data.salaryAnnual || 135000).toLocaleString()} / year`,
      joiningDate: data.joiningDate || '2025-07-01',
      employmentType: data.employmentType || 'Full-time',
      offerStatus: data.offerStatus || 'Draft',
      approvalStatus: data.approvalStatus || 'Pending',
      approvedBy: data.approvedBy,
      sentDate: data.sentDate,
      responseDeadline: data.responseDeadline || '2025-06-15',
      benefitsSummary: data.benefitsSummary || ['Health Insurance', '401k Match', 'Unlimited PTO'],
      notes: data.notes,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newOffer, ...list];
    saveToStorage('job_offers', updated);
    return newOffer;
  },

  updateOfferStatus: async (
    id: string,
    offerStatus: JobOffer['offerStatus'],
    approvalStatus?: JobOffer['approvalStatus']
  ): Promise<JobOffer> => {
    const list = await recruitmentService.getOffers();
    const index = list.findIndex((o) => o.id === id);
    if (index === -1) throw new Error('Offer not found');
    list[index].offerStatus = offerStatus;
    if (approvalStatus) list[index].approvalStatus = approvalStatus;
    if (offerStatus === 'Sent' && !list[index].sentDate) {
      list[index].sentDate = new Date().toISOString().split('T')[0];
    }
    saveToStorage('job_offers', list);
    return list[index];
  },

  // =========================================================================
  // 10. ONBOARDING HANDOVER
  // =========================================================================
  getHandovers: async (): Promise<OnboardingHandover[]> => {
    return getFromStorage<OnboardingHandover[]>('onboarding_handovers', INITIAL_HANDOVERS);
  },

  updateHandoverChecklist: async (
    id: string,
    checklistKey: keyof OnboardingHandover['checklist'],
    value: boolean
  ): Promise<OnboardingHandover> => {
    const list = await recruitmentService.getHandovers();
    const index = list.findIndex((h) => h.id === id);
    if (index === -1) throw new Error('Handover record not found');
    list[index].checklist[checklistKey] = value;

    // Check if all checklist items are true
    const allChecked = Object.values(list[index].checklist).every(Boolean);
    if (allChecked && list[index].handoverStatus === 'Ready for Handover') {
      list[index].handoverStatus = 'Ready for Handover';
    }
    saveToStorage('onboarding_handovers', list);
    return list[index];
  },

  completeHandoverToHR: async (id: string, assignedHrName = 'Sneha Gupta'): Promise<OnboardingHandover> => {
    const list = await recruitmentService.getHandovers();
    const index = list.findIndex((h) => h.id === id);
    if (index === -1) throw new Error('Handover record not found');
    list[index].handoverStatus = 'Handover to HR';
    list[index].assignedHrName = assignedHrName;
    list[index].handoverDate = new Date().toISOString().split('T')[0];
    saveToStorage('onboarding_handovers', list);
    return list[index];
  },
};
