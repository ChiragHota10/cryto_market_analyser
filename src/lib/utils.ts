
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: string | number, options: Intl.NumberFormatOptions = {}): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return 'N/A';
  
  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options
  };
  
  // For very small values, show more decimal places
  if (Math.abs(numValue) < 0.01 && numValue !== 0) {
    defaultOptions.minimumFractionDigits = 6;
    defaultOptions.maximumFractionDigits = 6;
  }
  
  // For large values, show fewer decimal places
  if (Math.abs(numValue) > 1000) {
    defaultOptions.minimumFractionDigits = 0;
    defaultOptions.maximumFractionDigits = 2;
  }
  
  return new Intl.NumberFormat('en-US', defaultOptions).format(numValue);
}

export function formatLargeNumber(value: string | number): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return 'N/A';
  
  if (numValue >= 1e12) {
    return `${(numValue / 1e12).toFixed(2)}T`;
  }
  
  if (numValue >= 1e9) {
    return `${(numValue / 1e9).toFixed(2)}B`;
  }
  
  if (numValue >= 1e6) {
    return `${(numValue / 1e6).toFixed(2)}M`;
  }
  
  if (numValue >= 1e3) {
    return `${(numValue / 1e3).toFixed(2)}K`;
  }
  
  return numValue.toFixed(2);
}

export function formatPercentage(value: string | number): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return 'N/A';
  
  return `${numValue >= 0 ? '+' : ''}${numValue.toFixed(2)}%`;
}

export function getPercentageClass(value: string | number): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '';
  
  return numValue >= 0 ? 'percent-positive' : 'percent-negative';
}
