import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-sm font-bold text-sm tracking-widest uppercase transition-colors',
  {
    variants: {
      variant: {
        default:
          'h-12 px-8 bg-ink text-white hover:bg-primary dark:bg-slate-100 dark:text-background-dark hover:opacity-90',
        secondary:
          'h-12 px-6 border border-ink/20 text-ink hover:bg-stone-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800',
        primary: 'h-10 px-5 bg-primary text-white hover:opacity-90',
        ghost: 'text-muted hover:text-primary dark:hover:text-primary',
      },
      size: {
        default: '',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-12 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
