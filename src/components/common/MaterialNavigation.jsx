import React from 'react';
import { X } from '@phosphor-icons/react';

/**
 * Material Design 3 Chip Component
 * Types: 'assist' | 'filter' | 'input' | 'suggestion'
 */
export const MaterialChip = ({
  label,
  selected = false,
  onClick,
  icon: Icon,
  onDelete,
  style = {},
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0 0.875rem',
        height: '32px',
        borderRadius: 'var(--md-shape-sm)',
        backgroundColor: selected ? 'var(--color-selected-background)' : 'var(--color-background-surface)',
        border: selected ? '1px solid var(--color-primary)' : '1px solid var(--color-border-default)',
        color: selected ? 'var(--color-primary)' : 'var(--color-text-primary)',
        fontSize: '0.8125rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
        userSelect: 'none',
        ...style,
      }}
    >
      {Icon && <Icon size={16} color={selected ? 'var(--color-primary)' : 'var(--color-text-secondary)'} />}
      <span>{label}</span>
      {onDelete && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            marginLeft: '2px',
          }}
        >
          <X size={14} weight="bold" />
        </span>
      )}
    </div>
  );
};

/**
 * Material Design 3 Tabs
 */
export const MaterialTabs = ({ tabs = [], activeTab, onSelectTab, style = {} }) => {
  return (
    <div
      style={{
        display: 'flex',
        borderBottom: '1px solid var(--color-border-default)',
        backgroundColor: 'var(--color-background-surface)',
        position: 'relative',
        ...style,
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              fontWeight: isActive ? 600 : 500,
              fontSize: '0.875rem',
              padding: '0.875rem 1.25rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              transition: 'color var(--transition-fast)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            {tab.icon && <tab.icon size={18} />}
            {tab.label}
            {isActive && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  backgroundColor: 'var(--color-secondary)',
                  borderRadius: '3px 3px 0 0',
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
