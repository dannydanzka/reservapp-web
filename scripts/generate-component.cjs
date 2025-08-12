#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const COMPONENT_TEMPLATES = {
  component: (name) => `import React from 'react';
import { Styled${name}, ${name}Content } from './${name}.styled';

export interface ${name}Props {
  children?: React.ReactNode;
  className?: string;
  // Add more specific props here
}

export function ${name}({ children, className, ...props }: ${name}Props) {
  return (
    <Styled${name} className={className} {...props}>
      <${name}Content>
        {children}
      </${name}Content>
    </Styled${name}>
  );
}
`,

  styled: (name) => `import styled from 'styled-components';

export const Styled${name} = styled.div\`
  /* Add your component styles here */
  display: flex;
  flex-direction: column;
  gap: \${({ theme }) => theme.spacing.md};
  padding: \${({ theme }) => theme.spacing.lg};
  background: \${({ theme }) => theme.colors.background.paper};
  border-radius: \${({ theme }) => theme.borderRadius.md};
  border: 1px solid \${({ theme }) => theme.colors.border.light};
\`;

export const ${name}Content = styled.div\`
  flex: 1;
  display: flex;
  flex-direction: column;
\`;
`,

  types: (name) => `export interface ${name}Props {
  children?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled';
  disabled?: boolean;
  loading?: boolean;
}

export interface ${name}State {
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

export type ${name}Size = 'sm' | 'md' | 'lg';
export type ${name}Variant = 'default' | 'outlined' | 'filled';
`,

  test: (name) => `import React from 'react';
import { render, screen } from '@testing-library/react';
import { ${name} } from './${name}';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/libs/ui/styles/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('${name}', () => {
  it('renders without crashing', () => {
    renderWithTheme(<${name}>Test content</${name}>);
  });

  it('displays children content', () => {
    const testContent = 'Test ${name} Content';
    renderWithTheme(<${name}>{testContent}</${name}>);
    
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-${name.toLowerCase()}-class';
    renderWithTheme(<${name} className={customClass}>Content</${name}>);
    
    expect(document.querySelector(\`.\${customClass}\`)).toBeInTheDocument();
  });

  // Add more specific tests here
});
`,

  stories: (name) => `import type { Meta, StoryObj } from '@storybook/react';
import { ${name} } from './${name}';

const meta: Meta<typeof ${name}> = {
  title: 'Components/${name}',
  component: ${name},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // Add argTypes configuration here
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Default ${name}',
  },
};

export const WithCustomContent: Story = {
  args: {
    children: (
      <div>
        <h3>${name} Title</h3>
        <p>This is a custom content example for the ${name} component.</p>
      </div>
    ),
  },
};

// Add more stories here
`,

  index: (name) => `export { ${name} } from './${name}';
export type { ${name}Props } from './${name}.types';
export * from './${name}.styled';
`
};

function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFile(filePath, content) {
  createDirectory(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
  console.log(\`  ✅ Created: \${path.relative(process.cwd(), filePath)}\`);
}

function generateComponent(componentName, options = {}) {
  const name = componentName.charAt(0).toUpperCase() + componentName.slice(1);
  const { 
    withTypes = true, 
    withTest = true, 
    withStories = false,
    directory = 'src/libs/ui/components'
  } = options;
  
  const basePath = path.join(process.cwd(), directory, name);
  
  console.log(\`🎨 Generating component: \${name}\`);
  console.log(\`📁 Location: \${basePath}\`);
  console.log('');

  // Core files
  writeFile(path.join(basePath, \`\${name}.tsx\`), COMPONENT_TEMPLATES.component(name));
  writeFile(path.join(basePath, \`\${name}.styled.ts\`), COMPONENT_TEMPLATES.styled(name));
  writeFile(path.join(basePath, 'index.ts'), COMPONENT_TEMPLATES.index(name));

  // Optional files
  if (withTypes) {
    writeFile(path.join(basePath, \`\${name}.types.ts\`), COMPONENT_TEMPLATES.types(name));
  }

  if (withTest) {
    writeFile(path.join(basePath, \`\${name}.test.tsx\`), COMPONENT_TEMPLATES.test(name));
  }

  if (withStories) {
    writeFile(path.join(basePath, \`\${name}.stories.ts\`), COMPONENT_TEMPLATES.stories(name));
  }

  console.log('');
  console.log(\`✅ Component \${name} generated successfully!\`);
  
  // Update components index file
  updateComponentsIndex(name, directory);
}

function updateComponentsIndex(componentName, directory) {
  const indexPath = path.join(process.cwd(), directory, 'index.ts');
  const exportStatement = \`export * from './\${componentName}';\n\`;

  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf8');
    if (!content.includes(exportStatement.trim())) {
      fs.appendFileSync(indexPath, exportStatement);
      console.log(\`  ✅ Updated: \${path.relative(process.cwd(), indexPath)}\`);
    }
  } else {
    writeFile(indexPath, exportStatement);
  }
}

function showHelp() {
  console.log('Usage: npm run generate:component <component-name> [options]');
  console.log('');
  console.log('Options:');
  console.log('  --no-types     Skip generating .types.ts file');
  console.log('  --no-test      Skip generating .test.tsx file');
  console.log('  --stories      Generate .stories.ts file');
  console.log('  --dir <path>   Custom directory (default: src/libs/ui/components)');
  console.log('');
  console.log('Examples:');
  console.log('  npm run generate:component Button');
  console.log('  npm run generate:component Modal --stories');
  console.log('  npm run generate:component Card --dir src/modules/mod-venues/presentation/components');
}

// CLI handling
const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  showHelp();
  process.exit(0);
}

const componentName = args[0];
const options = {
  withTypes: !args.includes('--no-types'),
  withTest: !args.includes('--no-test'),
  withStories: args.includes('--stories'),
  directory: args.includes('--dir') ? args[args.indexOf('--dir') + 1] : 'src/libs/ui/components'
};

generateComponent(componentName, options);