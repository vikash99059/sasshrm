import React, { useState, useEffect } from 'react';
import { financeService } from '../../services/financeService';
import { BankAccount, BankTransaction } from '../../types';
import {
  Card,
  Badge,
  Button,
  DataTable,
  Column,
  Modal,
  Input,
  Select,
  StatCard,
} from '../../components/ui';
import { PageHeaderCard } from '../../components/common/PageHeaderCard';
import {
  Building2,
  CheckCircle2,
  AlertCircle,
  Upload,
  RefreshCw,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils';

export const BankReconciliationPage: React.FC = () => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [selectedBankId, setSelectedBankId] = useState<string>('bank-hdfc');
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [isMatchingModalOpen, setIsMatchingModalOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<BankTransaction | null>(null);
  const [matchEntityInput, setMatchEntityInput] = useState('');

  const loadData = async () => {
    const [accounts, txns] = await Promise.all([
      financeService.getBankAccounts(),
      financeService.getBankTransactions(selectedBankId),
    ]);
    setBankAccounts(accounts);
    setTransactions(txns);
  };

  useEffect(() => {
    loadData();
  }, [selectedBankId]);

  const activeAccount = bankAccounts.find(a => a.id === selectedBankId) || bankAccounts[0];

  const handleMatchTxn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTxn) return;
    await financeService.matchTransaction(selectedTxn.id, matchEntityInput || 'Reconciled Direct Entry');
    setIsMatchingModalOpen(false);
    setSelectedTxn(null);
    setMatchEntityInput('');
    loadData();
  };

  const handleAutoMatch = async () => {
    const unmatched = transactions.filter(t => t.status === 'Unmatched');
    for (const t of unmatched) {
      await financeService.matchTransaction(t.id, 'Auto-Matched via Bank Reference');
    }
    loadData();
  };

  const difference = (activeAccount?.statementBalance || 0) - (activeAccount?.ledgerBalance || 0);

  const columns: Column<BankTransaction>[] = [
    {
      header: 'Transaction Date',
      accessorKey: 'date',
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-white text-xs">{formatDate(row.date)}</p>
          <span className="font-mono text-[10px] text-slate-400">{row.referenceNo}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Statement Description',
      accessorKey: 'description',
      cell: (row) => (
        <div>
          <p className="font-medium text-xs text-slate-800 dark:text-slate-200">{row.description}</p>
          {row.matchedEntityName && (
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
              Matched: {row.matchedEntityName}
            </p>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Type',
      accessorKey: 'type',
      cell: (row) => (
        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
          row.type === 'Credit'
            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
        }`}>
          {row.type === 'Credit' ? <ArrowDownLeft className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
          {row.type === 'Credit' ? 'Deposit (+)' : 'Withdrawal (-)'}
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Amount (INR)',
      accessorKey: 'amount',
      cell: (row) => (
        <span className={`text-xs font-bold ${row.type === 'Credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
          {formatCurrency(row.amount)}
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Matching Status',
      accessorKey: 'status',
      cell: (row) => (
        <Badge variant={row.status === 'Matched' ? 'success' : 'warning'} size="sm">
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Action',
      accessorKey: 'id',
      cell: (row) => (
        <div>
          {row.status === 'Unmatched' ? (
            <Button
              size="sm"
              variant="outline"
              className="p-1 h-7 text-[11px] font-bold text-blue-600 border-blue-200 hover:bg-blue-50"
              onClick={() => {
                setSelectedTxn(row);
                setIsMatchingModalOpen(true);
              }}
            >
              Match Entry
            </Button>
          ) : (
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Reconciled
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeaderCard
        title="Bank Reconciliation & Cash Book"
        subtitle="Automated matching engine between bank feeds and general ledger transactions with difference resolution."
        icon={Building2}
        badge={<Badge variant="primary">2 Bank Feeds Connected</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Upload className="h-4 w-4" />}
              onClick={() => alert('Statement OFX/CSV upload simulated successfully.')}
            >
              Import OFX/CSV Statement
            </Button>
            <Button
              size="sm"
              onClick={handleAutoMatch}
              leftIcon={<Zap className="h-4 w-4" />}
              className="font-bold shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Run Auto-Match Engine
            </Button>
          </div>
        }
      />

      {/* BANK SELECTOR TABS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bankAccounts.map((bank) => {
          const isSelected = bank.id === selectedBankId;
          return (
            <div
              key={bank.id}
              onClick={() => setSelectedBankId(bank.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 shadow-xs'
                  : 'border-slate-200/80 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-dark-card'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{bank.bankName}</h3>
                  <p className="text-xs text-slate-400 font-mono">A/C: {bank.accountNumber} • {bank.accountType}</p>
                </div>
                <Badge variant={bank.unreconciledCount === 0 ? 'success' : 'warning'}>
                  {bank.unreconciledCount === 0 ? 'Fully Balanced' : `${bank.unreconciledCount} Unmatched`}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
                <div>
                  <span className="text-slate-400">Statement Balance:</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(bank.statementBalance)}</p>
                </div>
                <div>
                  <span className="text-slate-400">General Ledger:</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(bank.ledgerBalance)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* RECONCILIATION SUMMARY METER */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Bank Statement Balance"
          value={formatCurrency(activeAccount?.statementBalance || 0)}
          icon={<Building2 className="h-5 w-5 text-blue-600" />}
          iconBgColor="bg-blue-50 dark:bg-blue-950/60"
          change="As per Bank Feed"
          isPositive={true}
        />
        <StatCard
          title="General Ledger Cash Book"
          value={formatCurrency(activeAccount?.ledgerBalance || 0)}
          icon={<ShieldCheck className="h-5 w-5 text-teal-600" />}
          iconBgColor="bg-teal-50 dark:bg-teal-950/60"
          change="ERP Internal Books"
          isPositive={true}
        />
        <StatCard
          title="Reconciliation Difference"
          value={formatCurrency(difference)}
          icon={difference === 0 ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <AlertCircle className="h-5 w-5 text-rose-600" />}
          iconBgColor={difference === 0 ? 'bg-emerald-50 dark:bg-emerald-950/60' : 'bg-rose-50 dark:bg-rose-950/60'}
          change={difference === 0 ? 'Exact Match (0 Variance)' : 'Pending Resolution'}
          isPositive={difference === 0}
        />
      </div>

      {/* TRANSACTIONS DATA TABLE */}
      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Bank Feed Line Items ({activeAccount?.bankName})</h3>
          <span className="text-xs text-slate-400">Showing all statement credits and debits</span>
        </div>
        <DataTable
          columns={columns}
          data={transactions}
          pageSize={10}
        />
      </div>

      {/* MATCH MODAL */}
      {selectedTxn && (
        <Modal
          isOpen={isMatchingModalOpen}
          onClose={() => setIsMatchingModalOpen(false)}
          title="Reconcile Bank Transaction"
          description={`Match transaction "${selectedTxn.description}" with customer invoice or vendor bill.`}
        >
          <form onSubmit={handleMatchTxn} className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl text-xs space-y-1">
              <p className="text-slate-400">Date: <span className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(selectedTxn.date)}</span></p>
              <p className="text-slate-400">Reference: <span className="font-mono text-slate-800 dark:text-slate-200">{selectedTxn.referenceNo}</span></p>
              <p className="text-slate-400">Amount: <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(selectedTxn.amount)} ({selectedTxn.type})</span></p>
            </div>

            <Input
              label="Match with Journal / Invoice / Bill Ref"
              placeholder="e.g. Consulting Revenue / Client Payment"
              value={matchEntityInput}
              onChange={(e) => setMatchEntityInput(e.target.value)}
              required
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" type="button" onClick={() => setIsMatchingModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                Confirm Reconciliation
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
