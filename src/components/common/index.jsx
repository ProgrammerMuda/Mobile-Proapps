// Export all Material Design 3 Components
export * from './MaterialButton';
export * from './MaterialTextField';
export * from './MaterialCard';
export * from './MaterialSelection';
export * from './MaterialNavigation';
export * from './MaterialDialog';
export * from './Logo';

// Re-export common aliases
export { MaterialButton as Button } from './MaterialButton';
export { MaterialTextField as Input } from './MaterialTextField';
export { MaterialCard as Card } from './MaterialCard';
export { MaterialSwitch as Switch, MaterialCheckbox as Checkbox } from './MaterialSelection';
export { MaterialChip as Chip, MaterialTabs as Tabs } from './MaterialNavigation';
export { MaterialDialog as Dialog } from './MaterialDialog';

/**
 * Status Badge Component (Preline UI colors + Material shape)
 */
export const Badge = ({ children, color = 'blue' }) => {
  const colorMap = {
    blue: { bg: 'var(--color-blue-50)', text: 'var(--color-blue-700)', border: 'var(--color-blue-200)' },
    green: { bg: 'var(--color-green-50)', text: 'var(--color-green-700)', border: 'var(--color-green-200)' },
    red: { bg: 'var(--color-red-50)', text: 'var(--color-red-700)', border: 'var(--color-red-200)' },
    orange: { bg: 'var(--color-orange-50)', text: 'var(--color-orange-700)', border: 'var(--color-orange-200)' },
    amber: { bg: 'var(--color-amber-50)', text: 'var(--color-amber-700)', border: 'var(--color-amber-200)' },
    purple: { bg: 'var(--color-purple-50)', text: 'var(--color-purple-700)', border: 'var(--color-purple-200)' },
  };

  const current = colorMap[color] || colorMap.blue;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.25rem 0.625rem',
        borderRadius: 'var(--md-shape-full)',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: current.bg,
        color: current.text,
        border: `1px solid ${current.border}`,
      }}
    >
      {children}
    </span>
  );
};
