/**
 * Card Component Interfaces
 *
 * TypeScript interfaces for the Card component.
 */

import React from 'react';

import type { CardStyledProps } from './Card.styled';

export interface CardProps
  extends Omit<CardStyledProps, '$padding'>,
    React.HTMLAttributes<HTMLDivElement> {
  /**
   * Global padding for the card
   */
  padding?: 'none' | 'small' | 'medium' | 'large';
  /**
   * Card content
   */
  children?: React.ReactNode;

  /**
   * Card title
   */
  title?: string;

  /**
   * Card subtitle
   */
  subtitle?: string;

  /**
   * Header content (overrides title/subtitle)
   */
  header?: React.ReactNode;

  /**
   * Header action buttons or icons
   */
  headerActions?: React.ReactNode;

  /**
   * Card actions (buttons, links, etc.)
   */
  actions?: React.ReactNode;

  /**
   * Actions alignment
   */
  actionsAlignment?: 'left' | 'center' | 'right' | 'space-between';

  /**
   * Actions padding
   */
  actionsPadding?: 'none' | 'small' | 'medium' | 'large';

  /**
   * Header padding
   */
  headerPadding?: 'none' | 'small' | 'medium' | 'large';

  /**
   * Content padding
   */
  contentPadding?: 'none' | 'small' | 'medium' | 'large';

  /**
   * Media content (images, videos, etc.)
   */
  media?: React.ReactNode;

  /**
   * Media height
   */
  mediaHeight?: string;

  /**
   * Media aspect ratio
   */
  mediaAspectRatio?: string;

  /**
   * Badge content
   */
  badge?: React.ReactNode;

  /**
   * Badge variant
   */
  badgeVariant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';

  /**
   * Badge position
   */
  badgePosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

  /**
   * Optional component to render as
   */
  as?: React.ElementType;

  /**
   * Optional href for clickable cards
   */
  href?: string;

  /**
   * Optional target for link cards
   */
  target?: string;

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * Disabled state
   */
  disabled?: boolean;
}
