'use client';

/**
 * @deprecated This Logo component has been deprecated and replaced with styled text components.
 * Use LogoText styled components directly in your components instead of this Logo component.
 * See PublicHeader.tsx, AdminHeader.tsx, or AuthLayout.tsx for examples.
 */

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';

interface LogoProps {
  variant?: 'default' | 'white' | 'admin';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  showText?: boolean;
  className?: string;
}

const LogoContainer = styled(Link)<{ $variant: LogoProps['variant']; $size: LogoProps['size'] }>`
  display: flex;
  align-items: center;
  gap: ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return '0.5rem';
      case 'lg':
        return '1rem';
      default:
        return '0.75rem';
    }
  }};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    text-decoration: none;
    transform: scale(1.02);
  }
`;

const LogoImageContainer = styled.div<{ $size: LogoProps['size'] }>`
  height: ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return '32px';
      case 'lg':
        return '48px';
      default:
        return '40px';
    }
  }};
  width: auto;
  position: relative;

  img {
    object-fit: contain;
  }
`;

const LogoText = styled.span<{ $variant: LogoProps['variant']; $size: LogoProps['size'] }>`
  font-size: ${({ $size, theme }) => {
    switch ($size) {
      case 'sm':
        return theme.typography.fontSize.lg;
      case 'lg':
        return theme.typography.fontSize['2xl'];
      default:
        return theme.typography.fontSize.xl;
    }
  }};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ $variant, theme }) => {
    switch ($variant) {
      case 'white':
        return theme.colors.white;
      case 'admin':
        return theme.colors.primary[700];
      default:
        return theme.colors.primary[600];
    }
  }};

  ${LogoContainer}:hover & {
    color: ${({ $variant, theme }) => {
      switch ($variant) {
        case 'white':
          return theme.colors.secondary[100];
        case 'admin':
          return theme.colors.primary[800];
        default:
          return theme.colors.primary[700];
      }
    }};
  }
`;

const FallbackText = styled.span<{ $variant: LogoProps['variant']; $size: LogoProps['size'] }>`
  font-size: ${({ $size, theme }) => {
    switch ($size) {
      case 'sm':
        return theme.typography.fontSize.lg;
      case 'lg':
        return theme.typography.fontSize['2xl'];
      default:
        return theme.typography.fontSize.xl;
    }
  }};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ $variant, theme }) => {
    switch ($variant) {
      case 'white':
        return theme.colors.white;
      case 'admin':
        return theme.colors.primary[700];
      default:
        return theme.colors.primary[600];
    }
  }};
`;

/**
 * Logo component that displays the ReservApp logo with optional text
 * Supports both local image logo and fallback text
 *
 * @deprecated This Logo component has been deprecated. Use LogoText styled components instead.
 */
export const Logo: React.FC<LogoProps> = ({
  className,
  href = '/',
  showText = true,
  size = 'md',
  variant = 'default',
}) => {
  console.warn(
    '[DEPRECATED] Logo component is deprecated. Use LogoText styled components instead. See PublicHeader.tsx, AdminHeader.tsx, or AuthLayout.tsx for examples.'
  );
  const [pngError, setPngError] = React.useState(false);
  const [svgError, setSvgError] = React.useState(false);

  const handlePngError = () => {
    setPngError(true);
  };

  const handleSvgError = () => {
    setSvgError(true);
  };

  const getSizeInPixels = () => {
    switch (size) {
      case 'sm':
        return { height: 32, width: 96 };
      case 'lg':
        return { height: 48, width: 144 };
      default:
        return { height: 40, width: 120 };
    }
  };

  const { height, width } = getSizeInPixels();

  // If both PNG and SVG failed to load, show text-only logo
  if (pngError && svgError) {
    return (
      <LogoContainer $size={size} $variant={variant} as={Link} className={className} href={href}>
        <FallbackText $size={size} $variant={variant}>
          ReservApp
          {variant === 'admin' && ' Admin'}
        </FallbackText>
      </LogoContainer>
    );
  }

  // Try PNG first, then SVG fallback
  const logoSrc = pngError
    ? '/images/brand/reservapp-logo.svg'
    : '/images/brand/reservapp-logo.png';
  const onError = pngError ? handleSvgError : handlePngError;

  return (
    <LogoContainer $size={size} $variant={variant} className={className} href={href}>
      <LogoImageContainer $size={size}>
        <Image
          alt='ReservApp Logo'
          height={height}
          priority={size === 'lg'}
          src={logoSrc}
          style={{
            height: '100%',
            maxWidth: '100%',
            width: 'auto',
          }}
          width={width}
          onError={onError}
        />
      </LogoImageContainer>
      {showText && (
        <LogoText $size={size} $variant={variant}>
          ReservApp
          {variant === 'admin' && ' Admin'}
        </LogoText>
      )}
    </LogoContainer>
  );
};

export default Logo;
