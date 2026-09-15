import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Briefcase,
  ArrowLeft,
  Save,
  Eye,
  Send,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { recruitmentService } from '../../services/recruitmentService';
import { Input, Select, Button, Modal, Badge } from '../../components/ui';

export const JobCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Form states
  const [title, setTitle] = useState(searchParams.get('title') || '');
  const [department, setDepartment] = useState(searchParams.get('dept') || 'Engineering');
  const [designation, setDesignation] = useState('');
  const [type, setType] = useState<'Full-time' | 'Part-time' | 'Contract' | 'Remote'>('Full-time');
  const [workMode, setWorkMode] = useState<'On-site' | 'Remote' | 'Hybrid'>('Hybrid');
  const [location, setLocation] = useState('San Francisco HQ');
  const [experience, setExperience] = useState('3-5 years');
  const [education, setEducation] = useState("Bachelor's Degree in CS or related field");
  const [salaryRange, setSalaryRange] = useState('$130,000 - $160,000');
  const [positions, setPositions] = useState(2);
  const [deadline, setDeadline] = useState('2025-07-31');
  const [hiringManager, setHiringManager] = useState('David Miller (Engineering Manager)');
  const [recruiter, setRecruiter] = useState('Elena Rostova (Lead Recruiter)');

  const [description, setDescription] = useState(
    'We are looking for an exceptional engineer to design and scale our next-generation enterprise SaaS cloud modules. You will collaborate closely with product, design, and architecture leads to deliver resilient software.'
  );

  const [responsibilities, setResponsibilities] = useState<string[]>([
    'Architect and implement scalable frontend/backend components using modern frameworks.',
    'Collaborate in agile sprint rituals, PR code reviews, and architectural RFC discussions.',
    'Optimize web performance, Core Web Vitals, and maintain comprehensive test coverage.',
  ]);
  const [newResp, setNewResp] = useState('');

  const [requirementsList, setRequirementsList] = useState<string[]>([
    '3+ years professional experience building enterprise web applications.',
    'Deep proficiency in modern TypeScript, modern APIs, and clean component patterns.',
    'Proven track record delivering reliable features in fast-paced product environments.',
  ]);
  const [newReq, setNewReq] = useState('');

  const [skillsList, setSkillsList] = useState<string[]>([
    'TypeScript',
    'React',
    'Tailwind CSS',
    'REST APIs',
    'State Management',
  ]);
  const [newSkill, setNewSkill] = useState('');

  const [benefitsList, setBenefitsList] = useState<string[]>([
    'Top-tier Comprehensive Health, Dental & Vision Insurance',
    '401(k) Retirement Plan with 4% Employer Match',
    '$2,500 Annual Home Office & Professional Development Stipend',
    'Flexible Hybrid Work Schedule & Unlimited Paid Time Off',
  ]);

  // Preview Modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddResp = () => {
    if (newResp.trim()) {
      setResponsibilities([...responsibilities, newResp.trim()]);
      setNewResp('');
    }
  };

  const handleRemoveResp = (index: number) => {
    setResponsibilities(responsibilities.filter((_, i) => i !== index));
  };

  const handleAddReq = () => {
    if (newReq.trim()) {
      setRequirementsList([...requirementsList, newReq.trim()]);
      setNewReq('');
    }
  };

  const handleRemoveReq = (index: number) => {
    setRequirementsList(requirementsList.filter((_, i) => i !== index));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skillsList.includes(newSkill.trim())) {
      setSkillsList([...skillsList, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkillsList(skillsList.filter((s) => s !== skill));
  };

  const handleSubmitJob = async (status: 'Active' | 'Draft') => {
    await recruitmentService.createJob({
      title: title || 'Untitled Job Opening',
      department,
      designation: designation || title,
      location,
      type,
      workMode,
      experienceRequired: experience,
      education,
      salaryRange,
      positions: Number(positions),
      deadline,
      description,
      responsibilities,
      requirements: requirementsList,
      skills: skillsList,
      benefits: benefitsList,
      hiringManager,
      recruiterName: recruiter,
      status,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      navigate('/recruiter/jobs');
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/recruiter/jobs')}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-0.5">
              <span>Recruitment</span>
              <span>&gt;</span>
              <span>Jobs</span>
              <span>&gt;</span>
              <span className="text-slate-600 dark:text-slate-300">Create</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Create & Publish Job Opening
            </h1>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSubmitJob('Draft')}
            className="flex items-center gap-1.5"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Draft</span>
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Preview</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={() => handleSubmitJob('Active')}
            className="flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Publish Job</span>
          </Button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>Job opening successfully saved! Redirecting to jobs list...</span>
        </div>
      )}

      {/* Form sections */}
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-6">
        {/* Section 1: Basic Role Details */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">
            1. Role & Organization Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Job Title"
              placeholder="e.g. Senior Fullstack Engineer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Input
              label="Designation / Level"
              placeholder="e.g. IC-4 Senior Software Engineer"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />

            <Select
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              options={[
                { value: 'Engineering', label: 'Engineering' },
                { value: 'Design', label: 'Design' },
                { value: 'Product & Design', label: 'Product & Design' },
                { value: 'Human Resources', label: 'Human Resources' },
                { value: 'Sales & Growth', label: 'Sales & Growth' },
                { value: 'Finance & Operations', label: 'Finance & Operations' },
              ]}
            />

            <Select
              label="Employment Type"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              options={[
                { value: 'Full-time', label: 'Full-time' },
                { value: 'Part-time', label: 'Part-time' },
                { value: 'Contract', label: 'Contract' },
                { value: 'Remote', label: 'Remote' },
              ]}
            />

            <Select
              label="Work Mode"
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value as any)}
              options={[
                { value: 'Hybrid', label: 'Hybrid' },
                { value: 'Remote', label: 'Full Remote' },
                { value: 'On-site', label: 'On-site' },
              ]}
            />

            <Input
              label="Workplace Location"
              placeholder="e.g. San Francisco HQ or Austin, TX"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Section 2: Compensation & Requirements */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">
            2. Experience, Compensation & Capacity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Experience Required"
              placeholder="e.g. 4-6 years"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
            <Input
              label="Education Level"
              placeholder="e.g. B.S. in Computer Science"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
            />
            <Input
              label="Salary Range ($)"
              placeholder="e.g. $130,000 - $160,000"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Input
              label="Number of Openings"
              type="number"
              value={positions}
              onChange={(e) => setPositions(Number(e.target.value))}
              min={1}
            />
            <Input
              label="Application Deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
            <Input
              label="Hiring Manager"
              value={hiringManager}
              onChange={(e) => setHiringManager(e.target.value)}
            />
          </div>
        </div>

        {/* Section 3: Skills Tags */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
            3. Required Skills & Competencies
          </h2>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            {skillsList.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 text-xs font-semibold"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-blue-400 hover:text-rose-600 cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 max-w-md">
            <Input
              label=""
              placeholder="Type a skill (e.g. GraphQL, Next.js, Docker)..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
            <Button type="button" variant="secondary" size="sm" onClick={handleAddSkill}>
              Add Skill
            </Button>
          </div>
        </div>

        {/* Section 4: Description, Responsibilities & Requirements */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">
            4. Job Description & Day-to-Day Responsibilities
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Overview & Mission
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-3 text-xs leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Responsibilities list builder */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Key Responsibilities
              </label>
              <div className="space-y-2 mb-2">
                {responsibilities.map((resp, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs bg-white dark:bg-slate-800"
                  >
                    <span className="flex-1 text-slate-700 dark:text-slate-300">• {resp}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveResp(i)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add another responsibility..."
                  value={newResp}
                  onChange={(e) => setNewResp(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddResp();
                    }
                  }}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 p-2 text-xs bg-slate-50/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button type="button" variant="secondary" size="sm" onClick={handleAddResp}>
                  Add
                </Button>
              </div>
            </div>

            {/* Requirements list builder */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Mandatory Requirements & Qualifications
              </label>
              <div className="space-y-2 mb-2">
                {requirementsList.map((req, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs bg-white dark:bg-slate-800"
                  >
                    <span className="flex-1 text-slate-700 dark:text-slate-300">• {req}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveReq(i)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add candidate qualification..."
                  value={newReq}
                  onChange={(e) => setNewReq(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddReq();
                    }
                  }}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 p-2 text-xs bg-slate-50/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button type="button" variant="secondary" size="sm" onClick={handleAddReq}>
                  Add
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} title="Job Post Live Preview" size="lg">
        <div className="space-y-4 text-xs">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-100 dark:border-blue-900/60">
            <Badge variant="success" size="sm" dot>
              {workMode} • {type}
            </Badge>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mt-2">{title || 'Untitled Role'}</h2>
            <p className="text-slate-600 dark:text-slate-300 mt-1">
              {department} • {location} • <span className="font-bold text-blue-600">{salaryRange}</span>
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">About the Role</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
              {description}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">Responsibilities</h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
              {responsibilities.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">Requirements</h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
              {requirementsList.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">Benefits & Perks</h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
              {benefitsList.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Back to Editing
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setIsPreviewOpen(false);
                handleSubmitJob('Active');
              }}
            >
              Publish Now
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
