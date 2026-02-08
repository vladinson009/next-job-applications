'use client';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';
import { Fragment, PropsWithChildren } from 'react';

export default function DashboardLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean).slice(0, -1);
  const breadcrumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    return {
      label: decodeURIComponent(segment),
      href,
      isLast: index === segments.length - 1,
    };
  });
  console.log(breadcrumbs);
  return (
    <>
      <Breadcrumb className="flex justify-center pt-5">
        <BreadcrumbList>
          {breadcrumbs.map((crumb) => (
            <Fragment key={crumb.href}>
              <BreadcrumbItem>
                {
                  <BreadcrumbLink className="capitalize" href={crumb.href}>
                    <Badge className="text-base">{crumb.label}</Badge>
                  </BreadcrumbLink>
                }
              </BreadcrumbItem>
              {!crumb.isLast && <BreadcrumbSeparator />}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      {children}
    </>
  );
}
