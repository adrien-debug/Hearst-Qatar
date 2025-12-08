import React from 'react';
import styles from './Table.module.css';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  header?: boolean;
  style?: React.CSSProperties;
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={`${styles.table} ${className}`}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className = '' }: TableHeaderProps) {
  return (
    <thead className={className}>
      {children}
    </thead>
  );
}

export function TableRow({ children, className = '' }: TableRowProps) {
  return (
    <tr className={`${styles.tableRow} ${className}`}>
      {children}
    </tr>
  );
}

export function TableCell({ children, className = '', header = false }: TableCellProps) {
  const Component = header ? 'th' : 'td';
  const cellClass = header ? styles.tableCellHeader : styles.tableCell;
  
  return (
    <Component className={`${cellClass} ${className}`}>
      {children}
    </Component>
  );
}

