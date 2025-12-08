'use client';

import React, { useState } from 'react';
import { Execution } from '@/lib/mock-executions';
import { mockExecutions } from '@/lib/mock-executions';
import { formatCurrency } from '@/lib/format';
import Modal from '@/components/ui/Modal';
import ExecutionDetail from './ExecutionDetail';
import styles from './ExecutionsTable.module.css';

const typeLabels = {
  buy: 'Buy',
  sell: 'Sell',
  rebalance: 'Rebalance',
  allocation: 'Allocation'
};

export default function ExecutionsTable() {
  const [filterStatus, setFilterStatus] = useState<'all' | Execution['status']>('all');
  const [selectedExecution, setSelectedExecution] = useState<Execution | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredExecutions = mockExecutions.filter(execution => {
    const statusMatch = filterStatus === 'all' || execution.status === filterStatus;
    return statusMatch;
  });

  return (
    <>
      {/* Filters */}
      <div className={styles.filters}>
        <button
          onClick={() => setFilterStatus('all')}
          className={`${styles.filterButton} ${filterStatus === 'all' ? styles.filterButtonActive : styles.filterButtonInactive}`}
        >
          All
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`${styles.filterButton} ${filterStatus === 'pending' ? styles.filterButtonActive : styles.filterButtonInactive}`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilterStatus('executing')}
          className={`${styles.filterButton} ${filterStatus === 'executing' ? styles.filterButtonActive : styles.filterButtonInactive}`}
        >
          Executing
        </button>
        <button
          onClick={() => setFilterStatus('completed')}
          className={`${styles.filterButton} ${filterStatus === 'completed' ? styles.filterButtonActive : styles.filterButtonInactive}`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilterStatus('failed')}
          className={`${styles.filterButton} ${filterStatus === 'failed' ? styles.filterButtonActive : styles.filterButtonInactive}`}
        >
          Failed
        </button>
      </div>

      {/* Executions Table - Simplified */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr className={styles.tableHeaderRow}>
              <th className={styles.tableHeaderCell}>Order ID</th>
              <th className={styles.tableHeaderCell}>Product</th>
              <th className={styles.tableHeaderCell}>Type</th>
              <th className={styles.tableHeaderCell}>Status</th>
              <th className={styles.tableHeaderCell}>Value</th>
              <th className={styles.tableHeaderCell}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredExecutions.map((execution) => (
              <tr 
                key={execution.id} 
                className={styles.tableBodyRow}
                onClick={() => {
                  setSelectedExecution(execution);
                  setIsModalOpen(true);
                }}
              >
                <td className={styles.tableCell}>
                  <div className={styles.orderId}>{execution.orderId}</div>
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.productName}>{execution.productName}</div>
                  {execution.mandateName && (
                    <div className={styles.mandateName}>{execution.mandateName}</div>
                  )}
                </td>
                <td className={styles.tableCell}>
                  <span className={styles.typeBadge} data-type={execution.type}>
                    {typeLabels[execution.type]}
                  </span>
                </td>
                <td className={styles.tableCell}>
                  <span className={styles.statusBadge}>
                    {execution.status.charAt(0).toUpperCase() + execution.status.slice(1)}
                  </span>
                </td>
                <td className={`${styles.tableCell} ${styles.tableCellMetric}`}>
                  {formatCurrency(execution.value)}
                </td>
                <td className={styles.tableCell}>
                  <button 
                    className={styles.actionButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedExecution(execution);
                      setIsModalOpen(true);
                    }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedExecution(null);
        }}
        title={selectedExecution?.orderId}
      >
        {selectedExecution && <ExecutionDetail execution={selectedExecution} />}
      </Modal>

      {filteredExecutions.length === 0 && (
        <div className={styles.emptyState}>
          No executions found for the selected filters.
        </div>
      )}
    </>
  );
}

