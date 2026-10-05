# Form Input Styling Convention (PROAPPS)

This rule MUST be followed for every form input, textarea, select, and interactive button (e.g. date pickers, category selectors) across the entire project.

## Color Tokens (from `src/styles/theme.css`)

| Token                  | Value     | Usage                      |
|------------------------|-----------|----------------------------|
| `--color-text-primary` | `#334155` | Slate 700 — all dark text  |
| `--color-secondary`    | `#09B2FF` | Focus border color         |
| `--color-border-focus` | `#09B2FF` | Same as secondary          |
| `--color-border-default`| `#E5E7EB`| Default border (or `#CBD5E1`) |
| `--color-text-placeholder` | `#CBD5E1` | Placeholder text (or `#94A3B8`) |

## Input / Textarea Styling

### Default State
```js
{
  border: '1px solid #CBD5E1',
  borderRadius: '10px',
  fontSize: '14px',
  fontWeight: 500,          // Medium when value is present
  color: '#334155',         // Slate 700
  outline: 'none',
  backgroundColor: '#FFFFFF',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
}
```

### Placeholder
```css
font-size: 14px;
color: #94A3B8;       /* Slate 400 */
font-weight: 400;     /* Regular */
```

### Focus State (MANDATORY — secondary color)
```css
border-color: #09B2FF !important;              /* Secondary */
box-shadow: 0 0 0 3px rgba(9, 178, 255, 0.16) !important;  /* Soft glow */
```

Apply via CSS rule on the parent scope:
```css
.parent-scope input[type="text"]:focus,
.parent-scope textarea:focus {
  border-color: #09B2FF !important;
  box-shadow: 0 0 0 3px rgba(9, 178, 255, 0.16) !important;
}
```

## Button-Based Selectors (Date Picker, Category Dropdown, etc.)

For buttons that toggle open/close state (e.g. `isCategorySheetOpen`, `activeDatePicker`):

### Default State
```js
border: '1.5px solid #CBD5E1'
boxShadow: 'none'
```

### Active/Open State
```js
border: '1.5px solid #09B2FF'     // Secondary — NOT #053079 (primary)
boxShadow: '0 0 0 3px rgba(9, 178, 255, 0.16)'  // Soft glow
```

## IMPORTANT — Do NOT use these for focus/active borders:
- ❌ `#053079` (primary blue) — reserved for brand elements, NOT form focus
- ❌ `#1E293B`, `#0F172A`, `#1F2937` — all dark text MUST be `#334155` (Slate 700)
- ❌ `#000000`, `black` — never use pure black for text

## Reference Implementation
- **LoginView.jsx**: Uses `onFocus`/`onBlur` state + `var(--color-border-focus)` border + `rgba(9, 178, 255, 0.16)` glow
- **RequestPermissionView.jsx**: Uses CSS `:focus` rule + inline conditional for button-type selectors
- **PermitPermissionView.jsx**: Uses CSS `:focus` rule in `<style>` block
