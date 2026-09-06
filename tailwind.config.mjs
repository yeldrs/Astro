// tailwind.config.mjs
import {
  tokens
} from './src/styles/tokens.js';
// 🚨 FIX: Import defaultTheme so it can be used
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}',
    './pages/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
      
        sans: ['Manrope', ...defaultTheme.fontFamily.sans],
        serif: ['Lora', 'ui-serif', 'Georgia', 'serif'],
      },
      // Colors: consumes the semantic layer directly (single source = tokens.js).
      // No duplicated mapping here → no possible divergence. `gray` is also exposed
      // so raw `bg-gray-*` / `border-gray-*` classes resolve to the token ramp
      // rather than Tailwind's built-in one.
      colors: {
        ...tokens.semantic.colors,
        gray: tokens.primitives.color.gray,
      },



      // Font sizes (Composed styles: [font-size, {lineHeight: ratio}])
      fontSize: {
        // Body text
        'xs': [tokens.primitives.fontSize.xs, {
          lineHeight: '1.333'
        }], // 12px / 16px
        'sm': [tokens.primitives.fontSize.sm, {
          lineHeight: '1.143'
        }], // 14px / 16px
        'base': [tokens.primitives.fontSize.base, {
          lineHeight: '1.25'
        }], // 16px / 20px

        // 🚨 H3 (text-lg): 18px / 24px
        'lg': [tokens.primitives.fontSize.lg, {
          lineHeight: '1.333'
        }], 

        // Remaining sizes for completeness
        '2xl': [tokens.primitives.fontSize['2xl'], {
          lineHeight: '1.167'
        }], // 24px / 28px

        // 🚨 H2 (text-3xl): 30px / 36px
        '3xl': [tokens.primitives.fontSize['3xl'], {
          lineHeight: '1.2'
        }], 

        // 🚨 H1 (text-4xl): 36px / 40px
        '4xl': [tokens.primitives.fontSize['4xl'], {
          lineHeight: '1.111'
        }],

        // Remaining headings
        '5xl': [tokens.primitives.fontSize['5xl'], {
          lineHeight: '1'
        }], 
        '6xl': [tokens.primitives.fontSize['6xl'], {
          lineHeight: '1'
        }],
      },

      // Font weights (Unchanged)
      fontWeight: {
        extrabold: tokens.primitives.fontWeight.extrabold,
        bold: tokens.primitives.fontWeight.bold,
        semibold: tokens.primitives.fontWeight.semibold,
        thick: tokens.primitives.fontWeight.thick,
        normal: tokens.primitives.fontWeight.normal,
        thin: tokens.primitives.fontWeight.thin,
      },

      // Spacing scale (Unchanged)
      spacing: {
        'xxs': tokens.primitives.spacing.xxs,
        'xs': tokens.primitives.spacing.xs,
        'sm': tokens.primitives.spacing.sm,
        'sm-d': tokens.primitives.spacing['sm-d'],
        'md': tokens.primitives.spacing.md,
        'lg': tokens.primitives.spacing.lg,
        'xl': tokens.primitives.spacing.xl,
        '2xl': tokens.primitives.spacing['2xl'],
        '3xl': tokens.primitives.spacing['3xl'],
        '4xl': tokens.primitives.spacing['4xl'],
        '5xl': tokens.primitives.spacing['5xl'],
        '6xl': tokens.primitives.spacing['6xl'],
      },

      // Border radius (Unchanged)
      borderRadius: {
        md: tokens.primitives.borderRadius.md,
        xl: tokens.primitives.borderRadius.xl,
        '2xl': tokens.primitives.borderRadius['2xl'],
        card: tokens.semantic.border.radius.card,
      },

      // Max width (container) (Unchanged)
      maxWidth: {
        content: tokens.semantic.layout.container.maxWidth,
      },

      // Aspect ratio token (Unchanged)
      aspectRatio: {
        card: tokens.semantic.layout.image.aspectRatio,
      },

      // Gap tokens for grids (Unchanged)
      gap: {
        grid: tokens.semantic.layout.grid.gap.base,
        'grid-lg': tokens.semantic.layout.grid.gap.large,
      },

      // Scale (Unchanged)
      scale: {
        '120': '1.20',
        '130': '1.30',
      },
    },
  },
  plugins: [],
};