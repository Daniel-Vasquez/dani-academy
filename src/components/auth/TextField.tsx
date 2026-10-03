import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, Props>(function TextField(
  { label, error, id, name, className, ...props },
  ref,
) {
  const inputId = id ?? name;
  const errorId = `${inputId}-error`;
  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium text-fg">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "mt-1.5 block w-full rounded-xl border border-surface-2 bg-bg px-4 py-2.5 text-fg",
          "placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none",
          "aria-[invalid=true]:border-danger",
          className,
        )}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-danger-strong">
          {error}
        </p>
      )}
    </div>
  );
});
