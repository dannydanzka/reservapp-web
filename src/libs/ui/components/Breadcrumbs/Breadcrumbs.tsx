'use client';

import React from 'react';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

import {
  StyledBreadcrumbCurrent,
  StyledBreadcrumbItem,
  StyledBreadcrumbLink,
  StyledBreadcrumbs,
  StyledSeparator,
} from './Breadcrumbs.styled';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHomeIcon?: boolean;
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ className, items, showHomeIcon = true }) => {
  if (!items || items.length === 0) return null;

  return (
    <StyledBreadcrumbs aria-label='Breadcrumb' className={className} role='navigation'>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isFirst = index === 0;

        return (
          <StyledBreadcrumbItem key={index}>
            {index > 0 && (
              <StyledSeparator>
                <ChevronRight size={16} />
              </StyledSeparator>
            )}

            {isLast ? (
              <StyledBreadcrumbCurrent aria-current='page'>
                {isFirst && showHomeIcon && <Home size={16} style={{ marginRight: '0.5rem' }} />}
                {item.icon && <span style={{ marginRight: '0.5rem' }}>{item.icon}</span>}
                {item.label}
              </StyledBreadcrumbCurrent>
            ) : (
              <StyledBreadcrumbLink>
                {item.href ? (
                  <Link href={item.href}>
                    {isFirst && showHomeIcon && (
                      <Home size={16} style={{ marginRight: '0.5rem' }} />
                    )}
                    {item.icon && <span style={{ marginRight: '0.5rem' }}>{item.icon}</span>}
                    {item.label}
                  </Link>
                ) : (
                  <span>
                    {isFirst && showHomeIcon && (
                      <Home size={16} style={{ marginRight: '0.5rem' }} />
                    )}
                    {item.icon && <span style={{ marginRight: '0.5rem' }}>{item.icon}</span>}
                    {item.label}
                  </span>
                )}
              </StyledBreadcrumbLink>
            )}
          </StyledBreadcrumbItem>
        );
      })}
    </StyledBreadcrumbs>
  );
};

export { Breadcrumbs };
