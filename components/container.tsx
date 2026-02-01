import { cn } from '@/lib/utils';
import type { ElementType, ReactNode } from 'react';

type ContainerProps<T extends ElementType = 'div'> = {
  as?: T;
  children: ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'children'>;

export default function Container<T extends ElementType = 'div'>(
  props: ContainerProps<T>,
) {
  const { as, children, className, ...rest } = props;
  const Component = (as ?? 'div') as ElementType;
  // ! Max Width Screen size XL 1280px
  return (
    <div className="px-2 sm:px-4 md:px-6 xl:mx-12">
      <Component className={cn('w-full max-w-7xl mx-auto', className)} {...rest}>
        {children}
      </Component>
    </div>
  );
}
