/**
 * Custom import order rule - "Member-First Import Sorting"
 *
 * Orders imports by the imported member name (not the module path)
 * following the style used by VSCode's Alphabetical Sorter extension.
 *
 * Within each group:
 * 1. Named imports (destructured) come first
 * 2. Default imports come second
 * 3. Both are sorted alphabetically by member name
 */

/**
 * Node.js built-in modules
 */
const BUILTIN_MODULES = [
  'assert',
  'buffer',
  'child_process',
  'cluster',
  'crypto',
  'dgram',
  'dns',
  'domain',
  'events',
  'fs',
  'http',
  'https',
  'net',
  'os',
  'path',
  'punycode',
  'querystring',
  'readline',
  'repl',
  'stream',
  'string_decoder',
  'tls',
  'tty',
  'url',
  'util',
  'v8',
  'vm',
  'zlib',
];

/**
 * Check if a module is a Node.js built-in module
 * @param {string} name - Module name
 * @returns {boolean}
 */
function isBuiltinModule(name) {
  return BUILTIN_MODULES.includes(name);
}

/**
 * Simple pattern matching implementation
 * @param {string} string - String to compare
 * @param {string} pattern - Pattern with wildcards
 * @returns {boolean}
 */
function minimatch(string, pattern) {
  const regex = new RegExp('^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
  return regex.test(string);
}

/**
 * Determine the group of an import based on its source
 * @param {string} source - Import source
 * @param {Array} pathGroups - PathGroups configuration
 * @param {Array} excludedImportTypes - Excluded import types
 * @returns {string}
 */
function getImportGroup(source, pathGroups = [], excludedImportTypes = []) {
  // First check if it's a .styled file (highest priority)
  if (source.includes('.styled')) {
    return 'styled';
  }

  // Check if it's excluded from pathGroups
  if (excludedImportTypes.some((excluded) => source.includes(excluded))) {
    // Apply special pathGroups for excluded types
    for (const pathGroup of pathGroups) {
      if (minimatch(source, pathGroup.pattern)) {
        return pathGroup.group;
      }
    }
  }

  // Check normal pathGroups
  for (const pathGroup of pathGroups) {
    if (minimatch(source, pathGroup.pattern)) {
      return pathGroup.group;
    }
  }

  // Determine standard group
  if (source.startsWith('.')) {
    if (source.startsWith('./')) return 'sibling';
    if (source.startsWith('../')) return 'parent';
    return 'index';
  }
  if (source.startsWith('@')) return 'internal';
  if (isBuiltinModule(source)) return 'builtin';
  return 'external';
}

/**
 * Check if import has named imports (destructuring)
 * @param {Object} node - Import AST node
 * @returns {boolean}
 */
function hasNamedImports(node) {
  return node.specifiers.some((spec) => spec.type === 'ImportSpecifier');
}

/**
 * Check if import is a namespace import (import * as)
 * @param {Object} node - Import AST node
 * @returns {boolean}
 */
function hasNamespaceImport(node) {
  return node.specifiers.some((spec) => spec.type === 'ImportNamespaceSpecifier');
}

/**
 * Get the first import name for sorting
 * For namespace imports, returns the name after 'as'
 * For other imports, returns the imported name
 * @param {Object} node - Import AST node
 * @returns {string}
 */
function getFirstImportName(node) {
  if (!node.specifiers || node.specifiers.length === 0) return '';

  // Sort specifiers by type and name
  const sortedSpecs = [...node.specifiers].sort((a, b) => {
    // Priority: Default > Namespace > Named
    const typeOrder = {
      ImportDefaultSpecifier: 0,
      ImportNamespaceSpecifier: 1,
      ImportSpecifier: 2,
    };

    const aOrder = typeOrder[a.type];
    const bOrder = typeOrder[b.type];

    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }

    // Within the same type, sort alphabetically
    const aName = a.type === 'ImportSpecifier' ? a.imported.name : a.local.name;
    const bName = b.type === 'ImportSpecifier' ? b.imported.name : b.local.name;

    return aName.localeCompare(bName, 'en', { sensitivity: 'case' });
  });

  // Return the first name
  const [firstSpec] = sortedSpecs;
  return firstSpec.type === 'ImportSpecifier' ? firstSpec.imported.name : firstSpec.local.name;
}

/**
 * Compare two imports for sorting
 * @param {Object} a - First import
 * @param {Object} b - Second import
 * @param {Array} groups - Groups configuration
 * @param {Array} pathGroups - PathGroups configuration
 * @param {Array} excludedImportTypes - Excluded import types
 * @returns {number}
 */
function compareImports(a, b, groups, pathGroups, excludedImportTypes) {
  const [aGroup, bGroup] = [
    getImportGroup(a.source.value, pathGroups, excludedImportTypes),
    getImportGroup(b.source.value, pathGroups, excludedImportTypes),
  ];

  // First sort by group
  const [aGroupIndex, bGroupIndex] = [
    groups.findIndex((g) => (Array.isArray(g) ? g.includes(aGroup) : g === aGroup)),
    groups.findIndex((g) => (Array.isArray(g) ? g.includes(bGroup) : g === bGroup)),
  ];

  if (aGroupIndex !== bGroupIndex) {
    return aGroupIndex - bGroupIndex;
  }

  // Within the same group, sort by import type priority
  const aIsNamespace = hasNamespaceImport(a);
  const bIsNamespace = hasNamespaceImport(b);
  const aHasNamed = hasNamedImports(a);
  const bHasNamed = hasNamedImports(b);

  // Priority order: named imports ({}) > namespace imports (*) > default imports
  if (aHasNamed && !bHasNamed) return -1;
  if (!aHasNamed && bHasNamed) return 1;
  if (aIsNamespace && !bIsNamespace) return -1;
  if (!aIsNamespace && bIsNamespace) return 1;

  // If both have the same type, sort by first import name (ASCII)
  const [aFirstName, bFirstName] = [getFirstImportName(a), getFirstImportName(b)];

  // If names are equal, sort by source path
  if (aFirstName === bFirstName) {
    return a.source.value.localeCompare(b.source.value);
  }

  return aFirstName.localeCompare(bFirstName, 'en', { sensitivity: 'case' });
}

/**
 * Check and fix newlines between import groups
 * @param {Array} imports - Array of import nodes
 * @param {Object} context - ESLint context
 * @param {Array} groups - Groups configuration
 * @param {Array} pathGroups - PathGroups configuration
 * @param {Array} excludedImportTypes - Excluded import types
 */
function checkNewlinesBetweenGroups(imports, context, groups, pathGroups, excludedImportTypes) {
  const sourceCode = context.getSourceCode();

  for (let i = 0; i < imports.length - 1; i += 1) {
    const currentImport = imports[i];
    const nextImport = imports[i + 1];

    const currentGroup = getImportGroup(
      currentImport.source.value,
      pathGroups,
      excludedImportTypes
    );
    const nextGroup = getImportGroup(nextImport.source.value, pathGroups, excludedImportTypes);

    // Get group indices
    const currentGroupIndex = groups.findIndex((g) =>
      Array.isArray(g) ? g.includes(currentGroup) : g === currentGroup
    );
    const nextGroupIndex = groups.findIndex((g) =>
      Array.isArray(g) ? g.includes(nextGroup) : g === nextGroup
    );

    // If different groups, check for newline
    if (currentGroupIndex !== nextGroupIndex) {
      const linesBetween = nextImport.loc.start.line - currentImport.loc.end.line;

      if (linesBetween !== 2) {
        // Should be exactly 1 empty line (2 line difference)
        context.report({
          fix(fixer) {
            const textBetween = sourceCode.text.substring(
              currentImport.range[1],
              nextImport.range[0]
            );

            // Only fix if the text between is just whitespace/newlines
            if (/^\s*$/.test(textBetween)) {
              return fixer.replaceTextRange([currentImport.range[1], nextImport.range[0]], '\n\n');
            }
            return null;
          },
          message: 'Expected 1 empty line between import groups',
          node: nextImport,
        });
      }
    } else {
      // Same group, should not have empty lines
      const linesBetween = nextImport.loc.start.line - currentImport.loc.end.line;

      if (linesBetween > 1) {
        context.report({
          fix(fixer) {
            const textBetween = sourceCode.text.substring(
              currentImport.range[1],
              nextImport.range[0]
            );

            // Only fix if the text between is just whitespace/newlines
            if (/^\s*$/.test(textBetween)) {
              return fixer.replaceTextRange([currentImport.range[1], nextImport.range[0]], '\n');
            }
            return null;
          },
          message: 'Unexpected empty line within import group',
          node: nextImport,
        });
      }
    }
  }

  // Check for newline after last import
  const lastImport = imports[imports.length - 1];
  const tokenAfterLastImport = sourceCode.getTokenAfter(lastImport, { includeComments: true });

  if (tokenAfterLastImport) {
    const linesBetween = tokenAfterLastImport.loc.start.line - lastImport.loc.end.line;

    // MUST have exactly 1 empty line (2 line difference) after the last import
    if (linesBetween !== 2) {
      context.report({
        fix(fixer) {
          const textBetween = sourceCode.text.substring(
            lastImport.range[1],
            tokenAfterLastImport.range[0]
          );

          // Only fix if the text between is just whitespace/newlines
          if (/^\s*$/.test(textBetween)) {
            return fixer.replaceTextRange(
              [lastImport.range[1], tokenAfterLastImport.range[0]],
              '\n\n' // Always fix to exactly 1 empty line
            );
          }
          return null;
        },
        message: 'Expected exactly 1 empty line after the last import',
        node: lastImport,
      });
    }
  }
}

/**
 * Fix import order and add proper newlines between groups
 * @param {Object} fixer - ESLint fixer
 * @param {Array} originalImports - Original imports array
 * @param {Array} sortedImports - Sorted imports array
 * @param {Object} context - ESLint context
 * @param {Array} groups - Groups configuration
 * @param {Array} pathGroups - PathGroups configuration
 * @param {Array} excludedImportTypes - Excluded import types
 * @returns {Array} Array of fixes
 */
function fixImportOrderWithNewlines(
  fixer,
  originalImports,
  sortedImports,
  context,
  groups,
  pathGroups,
  excludedImportTypes
) {
  const sourceCode = context.getSourceCode();
  const fixes = [];

  // Build the new imports text with proper newlines
  let newImportsText = '';
  let lastGroup = null;

  for (let i = 0; i < sortedImports.length; i += 1) {
    const importNode = sortedImports[i];
    const currentGroup = getImportGroup(importNode.source.value, pathGroups, excludedImportTypes);

    // Get group index
    const currentGroupIndex = groups.findIndex((g) =>
      Array.isArray(g) ? g.includes(currentGroup) : g === currentGroup
    );
    const lastGroupIndex = lastGroup
      ? groups.findIndex((g) => (Array.isArray(g) ? g.includes(lastGroup) : g === lastGroup))
      : -1;

    // Add newline between different groups
    if (lastGroup && currentGroupIndex !== lastGroupIndex) {
      newImportsText += '\n';
    }

    newImportsText += sourceCode.getText(importNode);

    // Add newline after each import except the last
    if (i < sortedImports.length - 1) {
      newImportsText += '\n';
    }

    lastGroup = currentGroup;
  }

  // Replace the entire imports section
  const [firstImport, lastImport] = [
    originalImports[0],
    originalImports[originalImports.length - 1],
  ];

  fixes.push(fixer.replaceTextRange([firstImport.range[0], lastImport.range[1]], newImportsText));

  return fixes;
}

/**
 * Check and report incorrect destructuring order
 * @param {Object} node - Import AST node
 * @param {Object} context - ESLint context
 */
function checkDestructuringOrder(node, context) {
  const namedImports = node.specifiers.filter((s) => s.type === 'ImportSpecifier');
  if (namedImports.length <= 1) return;

  const names = namedImports.map((s) => s.imported.name);
  const sortedNames = [...names].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'case' }));

  const isOrdered = names.every((name, i) => name === sortedNames[i]);

  if (!isOrdered) {
    context.report({
      fix(fixer) {
        const sourceCode = context.getSourceCode();
        const sortedSpecs = [...namedImports].sort((a, b) =>
          a.imported.name.localeCompare(b.imported.name, 'en', { sensitivity: 'case' })
        );

        return namedImports.map((spec, i) =>
          fixer.replaceText(spec, sourceCode.getText(sortedSpecs[i]))
        );
      },
      message: 'Named imports should be sorted alphabetically',
      node,
    });
  }
}

/**
 * Custom import order rule - "Member-First Import Sorting"
 *
 * Sorts imports by the imported member name (not the module path):
 * - Destructured/named imports come first: import { colors } from './theme'
 * - Default imports come second: import Button from './Button'
 * - Within each type, sorts alphabetically by member name
 * - Also ensures destructured members are alphabetically sorted
 *
 * Based on VSCode's Alphabetical Sorter extension style
 */
const customImportOrderRule = {
  create(context) {
    const options = context.options[0] || {};
    const groups = options.groups || [
      'builtin',
      'external',
      'internal',
      ['parent', 'sibling', 'index'],
    ];
    const pathGroups = options.pathGroups || [];
    const excludedImportTypes = options.pathGroupsExcludedImportTypes || [];

    let importsChecked = false;

    return {
      ImportDeclaration(node) {
        // Check destructuring order for each import individually
        checkDestructuringOrder(node, context);
      },

      'Program:exit'(node) {
        // Check import order and newlines only once at the end
        if (importsChecked) return;
        importsChecked = true;

        const imports = node.body.filter((n) => n.type === 'ImportDeclaration');
        if (imports.length <= 1) return;

        const sortedImports = [...imports].sort((a, b) =>
          compareImports(a, b, groups, pathGroups, excludedImportTypes)
        );

        // Check if they are sorted correctly
        let needsReordering = false;
        for (let i = 0; i < imports.length; i += 1) {
          if (
            imports[i].source.value !== sortedImports[i].source.value ||
            getFirstImportName(imports[i]) !== getFirstImportName(sortedImports[i])
          ) {
            needsReordering = true;
            break;
          }
        }

        if (needsReordering) {
          context.report({
            fix(fixer) {
              return fixImportOrderWithNewlines(
                fixer,
                imports,
                sortedImports,
                context,
                groups,
                pathGroups,
                excludedImportTypes
              );
            },
            message:
              'Imports should be sorted by member name (destructured imports first, then namespace, then default) in alphabetical order within their groups',
            node: imports[0],
          });
        } else {
          // Only check newlines if imports are already sorted
          checkNewlinesBetweenGroups(imports, context, groups, pathGroups, excludedImportTypes);
        }
      },
    };
  },

  meta: {
    docs: {
      category: 'Stylistic Issues',
      description:
        'Enforce member-first import sorting: orders by imported member name with destructured imports before namespace imports before default imports',
      recommended: false,
    },
    fixable: 'code',
    schema: [
      {
        additionalProperties: false,
        properties: {
          groups: {
            description: 'Order of import groups',
            type: 'array',
          },
          'newlines-between': {
            description: 'Enforce newlines between import groups',
            enum: ['ignore', 'always', 'always-and-inside-groups', 'never'],
          },
          pathGroups: {
            description: 'Custom path group configurations',
            type: 'array',
          },
          pathGroupsExcludedImportTypes: {
            description: 'Import types excluded from pathGroups processing',
            type: 'array',
          },
        },
        type: 'object',
      },
    ],
    type: 'layout',
  },
};

export { customImportOrderRule };
