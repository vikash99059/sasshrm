import React, { useState, useEffect } from 'react';
import { operationsService } from '../../services/operationsService';
import { DocumentItem } from '../../types';
import { DataTable, Column, Badge, Button, Modal, Input, Select } from '../../components/ui';
import { FileText, Plus, Download, Upload, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../../utils';

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Offer Letter' | 'Appointment Letter' | 'ID Proof' | 'Certificate' | 'Policy'>('Policy');

  const loadDocs = async () => {
    const list = await operationsService.getDocuments();
    setDocuments(list);
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const handleUploadDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    await operationsService.createDocument({
      title,
      category,
    });
    setIsModalOpen(false);
    setTitle('');
    loadDocs();
  };

  const columns: Column<DocumentItem>[] = [
    {
      header: 'Document Title',
      accessorKey: 'title',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-xs text-slate-900 dark:text-white">{row.title}</p>
            <p className="text-[10px] text-slate-400">{row.employeeName || 'Company Wide Policy'}</p>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Category',
      accessorKey: 'category',
      cell: (row) => <Badge variant="primary" size="sm">{row.category}</Badge>,
      sortable: true,
    },
    {
      header: 'File Format',
      cell: (row) => <span className="font-mono text-xs">{row.fileType} • {row.fileSize}</span>,
    },
    {
      header: 'Uploaded On',
      accessorKey: 'uploadedDate',
      cell: (row) => <span className="text-xs text-slate-500">{formatDate(row.uploadedDate)}</span>,
    },
    {
      header: 'Verification Status',
      accessorKey: 'status',
      cell: (row) => <Badge variant="success" size="sm" dot>Verified</Badge>,
    },
    {
      header: 'Action',
      cell: () => (
        <Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>
          Download
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Documents Locker & Compliance Vault
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Store company handbook policies, NDA agreements, contracts, and identity verifications.
          </p>
        </div>

        <Button size="sm" onClick={() => setIsModalOpen(true)} leftIcon={<Upload className="h-4 w-4" />}>
          Upload Document
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={documents}
        searchKey="title"
        searchPlaceholder="Search document repository..."
        pageSize={6}
      />

      {/* Upload Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload Document"
        description="Add a compliant document or policy file to the company locker."
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleUploadDoc}>
              Upload File
            </Button>
          </>
        }
      >
        <form onSubmit={handleUploadDoc} className="space-y-4">
          <Input
            label="Document Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Employee Code of Conduct 2024"
            required
          />
          <Select
            label="Document Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            options={[
              { value: 'Policy', label: 'Company Policy / Handbook' },
              { value: 'Offer Letter', label: 'Offer Letter' },
              { value: 'ID Proof', label: 'Identity / Passport' },
              { value: 'Certificate', label: 'Educational Certificate' },
            ]}
          />
          <div className="border-2 border-dashed border-slate-200 dark:border-dark-border rounded-xl p-6 text-center text-xs text-slate-400">
            <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">Drag & drop your PDF file here, or click to browse</p>
            <p className="text-[10px] text-slate-400 mt-1">Maximum file size: 25MB (PDF, DOCX, PNG)</p>
          </div>
        </form>
      </Modal>
    </div>
  );
};
