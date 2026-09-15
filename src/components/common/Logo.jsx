import React from 'react';
import logoIconSrc from '../../assets/logo-icon.png';
import logoFullSrc from '../../assets/logo-full.png';
import logoWhiteSrc from '../../assets/logo-white.png';
import logoBrandSrc from '../../assets/logo-brand.png';
import logoHeaderSrc from '../../assets/logo-header.png';

/**
 * PROAPPS Logo Component
 * Variants:
 * - 'icon': Only the hexagon icon
 * - 'full': Full color logo with "PROAPPS" text
 * - 'white': Pure white logo with "PROAPPS" text
 * - 'brand': High-contrast brand logo (Black "PR" + Hexagon + Cyan "APPS")
 * - 'header': Horizontal official header logo (Deep Blue "PR" + Hexagon + Cyan "APPS")
 */
export const LogoIcon = ({ size = 36, className = '', style = {}, ...props }) => (
  <img
    src={logoIconSrc}
    alt="PROAPPS Icon Logo"
    width={size}
    height={size}
    className={`proapps-logo-icon ${className}`}
    style={{
      objectFit: 'contain',
      display: 'inline-block',
      verticalAlign: 'middle',
      ...style,
    }}
    {...props}
  />
);

export const LogoHeader = ({ width = 110, height = 'auto', className = '', style = {}, ...props }) => (
  <img
    src={logoHeaderSrc}
    alt="PROAPPS Header Logo"
    width={width}
    height={height}
    className={`proapps-logo-header ${className}`}
    style={{
      objectFit: 'contain',
      display: 'inline-block',
      verticalAlign: 'middle',
      ...style,
    }}
    {...props}
  />
);

export const LogoFull = ({
  width = 150,
  height = 'auto',
  className = '',
  style = {},
  variant = 'default', // 'default' | 'white' | 'brand' | 'header'
  ...props
}) => {
  let src = logoFullSrc;
  if (variant === 'white') src = logoWhiteSrc;
  if (variant === 'brand') src = logoBrandSrc;
  if (variant === 'header') src = logoHeaderSrc;

  return (
    <img
      src={src}
      alt="PROAPPS Logo"
      width={width}
      height={height}
      className={`proapps-logo-full ${className}`}
      style={{
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle',
        borderRadius: 'var(--md-shape-sm)',
        ...style,
      }}
      {...props}
    />
  );
};

export const LogoFullWhite = ({ width = 250, ...props }) => (
  <LogoFull width={width} variant="white" {...props} />
);

export const LogoBrand = ({ width = 130, ...props }) => (
  <LogoFull width={width} variant="brand" {...props} />
);

export const Logo = ({ variant = 'icon', size, width, height, ...props }) => {
  if (variant === 'full') {
    return <LogoFull width={width || 150} height={height} {...props} />;
  }
  if (variant === 'white' || variant === 'full-white') {
    return <LogoFullWhite width={width || 250} height={height} {...props} />;
  }
  if (variant === 'brand') {
    return <LogoBrand width={width || 130} height={height} {...props} />;
  }
  if (variant === 'header') {
    return <LogoHeader width={width || 110} height={height} {...props} />;
  }
  return <LogoIcon size={size || 36} {...props} />;
};

export default Logo;
