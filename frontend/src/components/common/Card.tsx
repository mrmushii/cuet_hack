import { type ReactNode } from "react";
import { clsx } from "clsx";

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function Card({ title, children, className, action }: CardProps) {
  return (
    <div
      className={clsx(
        "bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg",
        className,
      )}
    >
      <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
        {action && <div>{action}</div>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
