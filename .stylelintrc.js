export default {
  customSyntax: 'postcss-styled-syntax',
  extends: ['stylelint-config-standard'],
  overrides: [
    {
      customSyntax: 'postcss-styled-syntax',
      defaultSeverity: 'warning',
      files: ['**/*.styled.{ts,tsx}'],
    },
    {
      customSyntax: 'postcss-styled-syntax',
      defaultSeverity: 'warning',
      files: ['src/shared/ui/styles/**/*.{ts,tsx}'],
    },
  ],
  plugins: ['stylelint-order'],
  rules: {
    'alpha-value-notation': 'number',
    'color-function-alias-notation': null,
    'color-function-notation': 'modern',
    'declaration-block-no-duplicate-properties': true,
    'declaration-block-no-redundant-longhand-properties': true,
    'declaration-block-no-shorthand-property-overrides': true,
    'font-family-name-quotes': 'always-where-required',
    'font-family-no-missing-generic-family-keyword': true,
    'length-zero-no-unit': true,
    'no-descending-specificity': null,
    'no-empty-source': true,
    'number-max-precision': 3,
    'order/order': [
      'custom-properties',
      'declarations',
      {
        name: 'media',
        type: 'at-rule',
      },
      'rules',
    ],
    'order/properties-alphabetical-order': [true, { disableFix: false }],
    'property-no-vendor-prefix': true,
    'selector-class-pattern': null,
    'shorthand-property-no-redundant-values': true,
  },
};
