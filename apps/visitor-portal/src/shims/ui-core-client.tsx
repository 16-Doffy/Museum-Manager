import * as React from 'react';

export function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(' ');
}

type AsChildProps = { asChild?: boolean } & React.HTMLAttributes<HTMLElement>;

// Button
type ButtonProps = AsChildProps & {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', asChild, children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-medium transition-all disabled:opacity-50 disabled:pointer-events-none';
    const variants: Record<string, string> = {
      default: 'bg-gray-900 text-white hover:bg-gray-800',
      outline: 'border border-gray-300 text-gray-900 bg-white hover:bg-gray-50',
      ghost: 'text-gray-700 hover:bg-gray-100',
    };
    const sizes: Record<string, string> = {
      sm: 'h-8 px-3 rounded-md text-sm',
      md: 'h-10 px-4 rounded-lg text-sm',
      lg: 'h-12 px-6 rounded-xl text-base',
      icon: 'h-10 w-10 rounded-lg',
    };

    const classes = cn(base, variants[variant], sizes[size], className);

    if (asChild) {
      return (
        <span className={classes} {...props}>
          {children}
        </span>
      );
    }
    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

// Card
type CardProps = React.HTMLAttributes<HTMLDivElement>;
export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('rounded-2xl border border-gray-200 bg-white shadow', className)} {...props} />
));
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

export const CardContent = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h3 className={cn('text-lg font-semibold', className)} {...props} />
);

// Badge
type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'secondary' | 'outline';
};
export const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', ...props }) => {
  const variants: Record<string, string> = {
    default: 'bg-gray-900 text-white',
    secondary: 'bg-gray-200 text-gray-900',
    outline: 'border border-gray-300 text-gray-900',
  };
  return <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold', variants[variant], className)} {...props} />;
};

// Input
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn('h-10 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500', className)} {...props} />
));
Input.displayName = 'Input';


