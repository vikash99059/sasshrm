import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recruitmentService } from '../../services/recruitmentService';
import { JobOpening } from '../../types';
import { DataTable, Column, Badge, Button, Modal, Input, Select } from '../../components/ui';
import { Briefcase, Plus, Users, MapPin, DollarSign, ArrowRight } from 'lucide-react';
import { formatDate } from '../../utils';

export const JobOpeningsPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [location, setLocation] = useState('San Francisco / Remote');
  const [salaryRange, setSalaryRange] = useState('$120,000 - $150,000');
  const [positions, setPositions] = useState(2);
  const [description, setDescription] = useState('');

  const navigate = useNavigate();

  const loadJobs = async () => {
    const list = await recruitmentService.getJobs();
    setJobs(list);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    await recruitmentService.createJob({
      title,
      department,
      location,
      salaryRange,
      positions,
      description,
    });
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
    loadJobs();
  };

  const columns: Column<JobOpening>[] = [
    {
      header: 'Job Title',
      accessorKey: 'title',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <Briefcase className="h-4 w-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-xs">{row.title}</p>
            <p className="text-[10px] text-slate-400">{row.type} • {row.experienceRequired}</p>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Department',
      accessorKey: 'department',
      cell: (row) => <span className="text-xs font-semibold">{row.department}</span>,
      sortable: true,
    },
    {
      header: 'Location',
      accessorKey: 'location',
      cell: (row) => <span className="text-xs text-slate-500">{row.location}</span>,
    },
    {
      header: 'Applications',
      accessorKey: 'applicationsCount',
      cell: (row) => (
        <span className="font-bold text-xs text-blue-600 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-full">
          {row.applicationsCount} Candidates
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Salary Range',
      accessorKey: 'salaryRange',
      cell: (row) => <span className="text-xs font-medium font-mono">{row.salaryRange}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <Badge variant={row.status === 'Active' ? 'success' : 'neutral'} size="sm" dot>
          {row.status}
        </Badge>
      ),
      sortable: true,
    },
    {
      header: 'Pipeline',
      cell: (row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate('/recruitment/candidates')}
          rightIcon={<ArrowRight className="h-3 w-3" />}
        >
          View ATS
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Job Openings & Requisitions
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Create requisitions, manage open positions, and track talent applications.
          </p>
        </div>

        <Button size="sm" onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
          Post New Job Opening
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={jobs}
        searchKey="title"
        searchPlaceholder="Search active job openings..."
        pageSize={6}
      />

      {/* Post Job Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Post New Job Opening"
        description="Configure job details, department, headcount requisition, and salary band."
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateJob}>
              Publish Opening
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateJob} className="space-y-4">
          <Input
            label="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Lead Full-Stack Engineer"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              options={[
                { value: 'Engineering', label: 'Engineering' },
                { value: 'Product Design', label: 'Product Design' },
                { value: 'Marketing', label: 'Marketing' },
                { value: 'Sales', label: 'Sales' },
                { value: 'Human Resources', label: 'Human Resources' },
              ]}
            />
            <Input
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="San Francisco HQ / Remote"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Salary Range"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
              placeholder="$120,000 - $150,000"
              required
            />
            <Input
              label="Open Positions"
              type="number"
              value={positions}
              onChange={(e) => setPositions(Number(e.target.value))}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Job Description & Responsibilities
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline the core responsibilities and tech stack requirements..."
              className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-dark-border dark:bg-dark-card dark:text-white"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
