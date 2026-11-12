import React from 'react';
import { clsx } from 'clsx';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  active = false,
  size = 'md',
  className,
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-2.5',
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={clsx(
        'inline-flex items-center justify-center rounded-full transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#2868E8] cursor-pointer',
        active
          ? 'bg-[#2868E8] text-white shadow-sm'
          : 'bg-white/80 hover:bg-white text-[#102A50] hover:text-[#2868E8] border border-[#2868E8]/15 shadow-sm hover:shadow hover:border-[#2868E8]/30',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {icon}
    </button>
  );
};

