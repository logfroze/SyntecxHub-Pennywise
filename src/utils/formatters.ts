import { Transaction } from '../types/pennywise';

export const DEFAULT_CURRENCY = 'PKR';
export const CURRENCY_SYMBOL = 'Rs.';

/**
 * Converts a numeric or decimal string amount into integer minor units (paisas).
 * 1 PKR = 100 paisas.
 * Handles inputs like "500", "500.5", "500.50".
 */
export function parseToMinorUnits(amountStr: string): number {
  const sanitized = amountStr.replace(/[^0-9.]/g, '').trim();
  if (!sanitized) return 0;
  
  const parts = sanitized.split('.');
  const wholePart = parseInt(parts[0] || '0', 10);
  let fractionPart = 0;
  
  if (parts.length > 1) {
    const fractionStr = (parts[1] + '00').slice(0, 2);
    fractionPart = parseInt(fractionStr, 10);
  }
  
  return wholePart * 100 + fractionPart;
}

/**
 * Formats minor units (paisas) into standardized PKR currency string.
 * Example: 154000 paisas -> "Rs. 1,540.00"
 */
export function formatPKR(minorUnits: number, showSign: boolean = false): string {
  const isNegative = minorUnits < 0;
  const absUnits = Math.abs(minorUnits);
  const rupees = Math.floor(absUnits / 100);
  const paisas = absUnits % 100;
  
  const formattedRupees = rupees.toLocaleString('en-PK');
  const paisaStr = paisas.toString().padStart(2, '0');
  
  const base = `${CURRENCY_SYMBOL} ${formattedRupees}.${paisaStr}`;
  if (showSign) {
    if (isNegative) return `-${base}`;
    if (minorUnits > 0) return `+${base}`;
  }
  return isNegative ? `-${base}` : base;
}

/**
 * Formats minor units for compact display (e.g. without trailing .00 if 0).
 */
export function formatCompactPKR(minorUnits: number): string {
  const absUnits = Math.abs(minorUnits);
  const rupees = Math.floor(absUnits / 100);
  const paisas = absUnits % 100;
  
  const formattedRupees = rupees.toLocaleString('en-PK');
  if (paisas === 0) {
    return `${CURRENCY_SYMBOL} ${formattedRupees}`;
  }
  return `${CURRENCY_SYMBOL} ${formattedRupees}.${paisas.toString().padStart(2, '0')}`;
}

/**
 * Format timestamp to friendly readable date.
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Format timestamp to relative or readable time.
 */
export function formatRelativeDate(timestamp: number): string {
  const date = new Date(timestamp);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const target = new Date(timestamp);
  target.setHours(0, 0, 0, 0);
  
  const diffTime = today.getTime() - target.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Format year and month string (e.g. "October 2026")
 */
export function formatMonthYear(year: number, month: number): string {
  const date = new Date(year, month, 1);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Generates an RFC 4180 compliant CSV string for transactions.
 * Properly escapes commas, double quotes, and line breaks.
 */
export function generateTransactionsCsv(transactions: Transaction[]): string {
  const headers = [
    'Transaction ID',
    'Type',
    'Amount',
    'Currency',
    'Category',
    'Title or Note',
    'Transaction Date'
  ];
  
  const escapeCsvField = (field: string | number): string => {
    const stringValue = String(field ?? '');
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };
  
  const rows = transactions.map(t => {
    const formattedAmount = (t.amountMinor / 100).toFixed(2);
    const dateFormatted = new Date(t.transactionDate).toISOString().split('T')[0];
    
    return [
      escapeCsvField(t.id),
      escapeCsvField(t.type),
      escapeCsvField(formattedAmount),
      escapeCsvField(DEFAULT_CURRENCY),
      escapeCsvField(t.category),
      escapeCsvField(t.note || 'None'),
      escapeCsvField(dateFormatted)
    ].join(',');
  });
  
  return [headers.join(','), ...rows].join('\r\n');
}

/**
 * Triggers a browser file download using a blob, simulating Android Storage Access Framework.
 */
export function downloadCsvFile(content: string, filename: string = 'pennywise_transactions.csv'): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
