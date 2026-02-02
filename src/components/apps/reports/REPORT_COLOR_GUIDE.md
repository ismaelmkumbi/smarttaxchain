# Report Module Color Guide

## Overview

This guide provides a consistent color scheme for the Reports module that aligns with the TRA brand guidelines and maintains visual consistency across the entire application.

## Brand Colors

### Primary Colors

- **TRA Primary Blue**: `#002855`

  - Use for: Primary actions, headers, important information
  - Light variant: `#E6ECF5` (backgrounds, hover states)
  - Dark variant: `#001B3D` (hover states, emphasis)

- **TRA Signature Yellow**: `#FFD100`
  - Use for: Accents, highlights, call-to-action buttons
  - Light variant: `#FFF5CC` (backgrounds)
  - Dark variant: `#E6B800` (hover states)

### Semantic Colors

#### Success (Green) - `#13DEB9`

- **Use for**: Payment receipts, successful transactions, completed reports
- **Report Types**: Payment Receipt, Payment History
- **Light**: `#E6FFFA` (backgrounds)
- **Dark**: `#02B3A9` (hover, emphasis)

#### Info (Blue) - `#539BFF`

- **Use for**: Information, assessments, official documents
- **Report Types**: Tax Assessment Statement, Assessment Ledger, Registration Certificate
- **Light**: `#EBF3FE` (backgrounds)
- **Dark**: `#1682FB` (hover, emphasis)

#### Warning (Orange) - `#FFAE1F`

- **Use for**: Outstanding taxes, pending items, attention required
- **Report Types**: Outstanding Tax Report, Tax Clearance Certificate
- **Light**: `#FEF5E7` (backgrounds)
- **Dark**: `#AE8E59` (hover, emphasis)

#### Error (Red) - `#FA896B`

- **Use for**: Compliance issues, audit trails, security reports
- **Report Types**: Compliance Report, Audit Trail Report
- **Light**: `#FDEDE8` (backgrounds)
- **Dark**: `#F3704D` (hover, emphasis)

#### Gold (Accent) - `#D4A419`

- **Use for**: Certificates, achievements, prestige items
- **Report Types**: Tax Clearance Certificate, Registration Certificate
- **Light**: `#F8F2E6` (backgrounds)
- **Dark**: `#BA8F16` (hover, emphasis)

## Report Type Color Mapping

| Report Type               | Primary Color              | MUI Color | Usage                  |
| ------------------------- | -------------------------- | --------- | ---------------------- |
| Payment Receipt           | `#13DEB9` (Success Green)  | `success` | Financial transactions |
| Payment History           | `#13DEB9` (Success Green)  | `success` | Payment records        |
| Tax Assessment Statement  | `#539BFF` (Info Blue)      | `primary` | Official assessments   |
| Assessment Ledger         | `#539BFF` (Info Blue)      | `primary` | Blockchain records     |
| Tax Clearance Certificate | `#D4A419` (Gold)           | `warning` | Official certificates  |
| Registration Certificate  | `#539BFF` (Info Blue)      | `info`    | Registration docs      |
| Outstanding Tax           | `#F59E0B` (Amber)          | `warning` | Pending payments       |
| Compliance Report         | `#FA896B` (Error Red)      | `error`   | Compliance status      |
| Revenue Collection        | `#14B8A6` (Teal)           | `info`    | Revenue analytics      |
| Audit Trail               | `#FFAE1F` (Warning Orange) | `warning` | Audit records          |

## Usage Guidelines

### Cards & Containers

- **Background**: White (`#ffffff`) or light neutral (`#FAFBFB`)
- **Border**: Light grey (`#E5EDF5`)
- **Hover State**: Slightly darker background (`#F2F6FA`)

### Icons

- Use the report type's primary color for icons
- Maintain 24px size for consistency
- Use outlined style for better visibility

### Buttons

- **Primary Action**: TRA Primary Blue (`#002855`) with white text
- **Secondary Action**: Outlined with TRA Primary Blue border
- **Success Actions**: Success Green (`#13DEB9`)
- **Warning Actions**: Warning Orange (`#FFAE1F`)

### Status Indicators

- **Success**: Green (`#13DEB9`)
- **Error**: Red (`#FA896B`)
- **Warning**: Orange (`#FFAE1F`)
- **Info**: Blue (`#539BFF`)
- **Pending**: Amber (`#F59E0B`)

### Text Colors

- **Primary Text**: Dark grey (`#2A3547`)
- **Secondary Text**: Medium grey (`#5A6A85`)
- **Tertiary Text**: Light grey (`#7C8FAC`)
- **Links**: TRA Primary Blue (`#002855`)

### Borders & Dividers

- **Default**: Light grey (`#E5EDF5`)
- **Hover**: Medium grey (`#C8D9E8`)
- **Focus**: TRA Primary Blue (`#002855`)
- **Error**: Error Red (`#FA896B`)

## Implementation Example

```jsx
import { getReportMUIColor, getReportTypeColors } from './reportColors';

// In component
const reportColor = getReportMUIColor(reportType); // Returns 'success', 'primary', etc.
const colorScheme = getReportTypeColors(reportType); // Returns full color object

// Usage
<Chip
  label={report.name}
  color={reportColor}
  sx={{
    bgcolor: colorScheme.background,
    color: colorScheme.main,
  }}
/>;
```

## Accessibility

- Ensure minimum contrast ratio of 4.5:1 for text
- Use color + icon for status indicators (not color alone)
- Provide alternative text for color-coded information
- Test with color blindness simulators

## Dark Mode Considerations

When implementing dark mode:

- Use lighter variants of colors for backgrounds
- Increase contrast for text
- Adjust opacity for borders and dividers
- Test all color combinations in dark mode

## Best Practices

1. **Consistency**: Always use the predefined colors from `reportColors.js`
2. **Semantic Meaning**: Choose colors that match the report's purpose
3. **Accessibility**: Ensure sufficient contrast ratios
4. **Brand Alignment**: Maintain TRA brand identity
5. **User Experience**: Use colors to guide user attention appropriately
