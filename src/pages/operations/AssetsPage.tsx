import React, { useState, useEffect } from 'react';
import { operationsService } from '../../services/operationsService';
import { Asset } from '../../types';
import { DataTable, Column, Badge, Button, Modal, Input, Select } from '../../components/ui';
import { Package, Plus, Laptop, Monitor, Smartphone, CheckCircle2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils';

export const AssetsPage: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Laptop' | 'Monitor' | 'Mobile' | 'Furniture' | 'Accessory'>('Laptop');
  const [serialNumber, setSerialNumber] = useState('');
  const [purchaseCost, setPurchaseCost] = useState(1499);

  const loadAssets = async () => {
    const list = await operationsService.getAssets();
    setAssets(list);
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    await operationsService.createAsset({
      name,
      category,
      serialNumber,
      purchaseCost,
    });
    setIsModalOpen(false);
    setName('');
    setSerialNumber('');
    loadAssets();
  };

  const columns: Column<Asset>[] = [
    {
      header: 'Asset Tag',
      accessorKey: 'assetTag',
      cell: (row) => <span className="font-mono text-xs font-bold text-blue-600">{row.assetTag}</span>,
      sortable: true,
    },
    {
      header: 'Device Name',
      accessorKey: 'name',
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <Package className="h-4 w-4 text-slate-400" />
          <span className="font-semibold text-xs text-slate-900 dark:text-white">{row.name}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Category',
      accessorKey: 'category',
      cell: (row) => <Badge variant="neutral" size="sm">{row.category}</Badge>,
      sortable: true,
    },
    {
      header: 'Assigned To',
      cell: (row) => (
        row.assignedToEmployeeName ? (
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{row.assignedToEmployeeName}</span>
        ) : (
          <span className="text-xs text-slate-400 italic">Unassigned (In Inventory)</span>
        )
      ),
    },
    {
      header: 'Condition',
      accessorKey: 'condition',
      cell: (row) => <Badge variant="success" size="sm">{row.condition}</Badge>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => (
        <Badge variant={row.status === 'Assigned' ? 'primary' : 'success'} size="sm" dot>
          {row.status}
        </Badge>
      ),
      sortable: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Hardware & Company Assets Inventory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track laptops, peripherals, monitors, serial numbers, and employee assignments.
          </p>
        </div>

        <Button size="sm" onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
          Register New Asset
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={assets}
        searchKey="name"
        searchPlaceholder="Search hardware inventory..."
        pageSize={6}
      />

      {/* Add Asset Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Hardware Asset"
        description="Add a device to the organization asset registry."
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateAsset}>
              Save Device
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateAsset} className="space-y-4">
          <Input
            label="Device / Asset Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Apple MacBook Pro 16 M3 Max"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Asset Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              options={[
                { value: 'Laptop', label: 'Laptop' },
                { value: 'Monitor', label: 'Monitor' },
                { value: 'Mobile', label: 'Mobile Phone' },
                { value: 'Accessory', label: 'Accessory' },
                { value: 'Furniture', label: 'Furniture' },
              ]}
            />
            <Input
              label="Serial Number"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              placeholder="e.g. C02G8819..."
              required
            />
          </div>
          <Input
            label="Purchase Cost ($ USD)"
            type="number"
            value={purchaseCost}
            onChange={(e) => setPurchaseCost(Number(e.target.value))}
            required
          />
        </form>
      </Modal>
    </div>
  );
};
