/**
 * Card component based on Jafra's design system.
 * Provides flexible card layout with header, content, actions, and media support.
 */

import React, { forwardRef } from 'react';

import {
  CardActions,
  CardBadge,
  CardContent,
  CardHeader,
  CardMedia,
  CardStyledProps,
  CardSubtitle,
  CardTitle,
  StyledCard,
} from './Card.styled';

export interface CardProps extends CardStyledProps, React.HTMLAttributes<HTMLDivElement> {
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
   * Whether to apply padding to header
   */
  headerPadding?: 'none' | 'small' | 'medium' | 'large';

  /**
   * Whether to apply padding to content
   */
  contentPadding?: 'none' | 'small' | 'medium' | 'large';

  /**
   * Whether to apply padding to actions
   */
  actionsPadding?: 'none' | 'small' | 'medium' | 'large';

  /**
   * Component to render as (for links, etc.)
   */
  as?: React.ElementType;

  /**
   * Optional href for link cards
   */
  href?: string;

  /**
   * Optional target for link cards
   */
  target?: string;
}

/**
 * Card component with support for headers, media, content, actions, and badges.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      actions,
      actionsAlignment = 'right',
      actionsPadding = 'medium',
      as,
      badge,
      badgePosition = 'top-right',
      badgeVariant = 'primary',
      children,
      contentPadding = 'medium',
      disabled = false,
      header,
      headerActions,
      headerPadding = 'medium',
      href,
      interactive = false,
      media,
      mediaAspectRatio,
      mediaHeight,
      onClick,
      padding = 'none',
      subtitle,
      target,
      title,
      variant = 'outlined',
      ...rest
    },
    ref
  ) => {
    // If href is provided and no 'as' prop, default to 'a'
    const component = as || (href ? 'a' : 'div');

    // Props specific to the rendered element
    const elementProps = {
      ...rest,
      ...(component === 'a' && { href, target }),
      ...(onClick && { onClick }),
    };

    // Make interactive if it has click handlers or href
    const isInteractive = interactive || Boolean(onClick || href);

    const hasHeader = Boolean(header || title || subtitle || headerActions);
    const hasActions = Boolean(actions);

    return (
      <StyledCard
        as={component}
        disabled={disabled}
        interactive={isInteractive}
        padding={padding}
        ref={ref}
        variant={variant}
        {...elementProps}
      >
        {media && (
          <CardMedia aspectRatio={mediaAspectRatio} height={mediaHeight}>
            {media}
            {badge && (
              <CardBadge position={badgePosition} variant={badgeVariant}>
                {badge}
              </CardBadge>
            )}
          </CardMedia>
        )}

        {hasHeader && (
          <CardHeader padding={headerPadding}>
            <div>
              {header || (
                <>
                  {title && <CardTitle>{title}</CardTitle>}
                  {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
                </>
              )}
            </div>
            {headerActions && <div>{headerActions}</div>}
          </CardHeader>
        )}

        {children && <CardContent padding={contentPadding}>{children}</CardContent>}

        {hasActions && (
          <CardActions alignment={actionsAlignment} padding={actionsPadding}>
            {actions}
          </CardActions>
        )}

        {!media && badge && (
          <CardBadge position={badgePosition} variant={badgeVariant}>
            {badge}
          </CardBadge>
        )}
      </StyledCard>
    );
  }
);

Card.displayName = 'Card';
