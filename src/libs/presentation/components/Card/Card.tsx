/**
 * Card component based on Jafra's design system.
 * Provides flexible card layout with header, content, actions, and media support.
 */

import React, { forwardRef } from 'react';

import type { CardProps } from './Card.interfaces';

import {
  CardActions,
  CardBadge,
  CardContent,
  CardHeader,
  CardMedia,
  CardSubtitle,
  CardTitle,
  StyledCard,
} from './Card.styled';

/**
 * Card component with support for headers, media, content, actions, and badges.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      actions = undefined,
      actionsAlignment = 'right',
      actionsPadding = 'medium',
      as = undefined,
      badge = undefined,
      badgePosition = 'top-right',
      badgeVariant = 'primary',
      children,
      contentPadding = 'medium',
      disabled = false,
      header = undefined,
      headerActions = undefined,
      headerPadding = 'medium',
      href = undefined,
      interactive = false,
      media = undefined,
      mediaAspectRatio = undefined,
      mediaHeight = undefined,
      onClick,
      padding = 'none',
      subtitle = undefined,
      target = undefined,
      title = undefined,
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
        $padding={padding}
        as={component}
        disabled={disabled}
        interactive={isInteractive}
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
          <CardHeader $padding={headerPadding}>
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

        {children && <CardContent $padding={contentPadding}>{children}</CardContent>}

        {hasActions && (
          <CardActions $alignment={actionsAlignment} $padding={actionsPadding}>
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
