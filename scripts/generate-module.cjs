#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const TEMPLATES = {
  entity: (name) => `export interface ${name} {
  id: string;
  // Add your ${name.toLowerCase()} properties here
  createdAt: Date;
  updatedAt: Date;
}

export interface Create${name}Data {
  // Add creation properties here
}

export interface Update${name}Data {
  // Add update properties here
}

export enum ${name}Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}
`,

  repository: (name) => `import { ${name} } from '../entities/${name}';

export interface I${name}Repository {
  create(data: Create${name}Data): Promise<${name}>;
  findById(id: string): Promise<${name} | null>;
  update(id: string, data: Partial<Update${name}Data>): Promise<${name}>;
  delete(id: string): Promise<void>;
  list(options: List${name}Options): Promise<List${name}Result>;
}

export interface Create${name}Data {
  // Add creation interface properties
}

export interface Update${name}Data {
  // Add update interface properties
}

export interface List${name}Options {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: ${name}Filters;
}

export interface ${name}Filters {
  // Add filter properties
}

export interface List${name}Result {
  items: ${name}[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
`,

  useCase: (name) => `import { I${name}Repository } from '../repositories/I${name}Repository';
import { ${name} } from '../entities/${name}';

export class ${name}ManagementUseCase {
  constructor(private ${name.toLowerCase()}Repository: I${name}Repository) {}

  async create${name}(data: Create${name}Data): Promise<${name}> {
    // Add business logic validation here
    return this.${name.toLowerCase()}Repository.create(data);
  }

  async get${name}ById(id: string): Promise<${name} | null> {
    return this.${name.toLowerCase()}Repository.findById(id);
  }

  async update${name}(id: string, data: Update${name}Data): Promise<${name}> {
    // Add business logic validation here
    return this.${name.toLowerCase()}Repository.update(id, data);
  }

  async delete${name}(id: string): Promise<void> {
    return this.${name.toLowerCase()}Repository.delete(id);
  }

  async list${name}s(options: List${name}Options): Promise<List${name}Result> {
    return this.${name.toLowerCase()}Repository.list(options);
  }
}
`,

  interfaces: (name) => `export interface ${name}SearchParams {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: ${name}Filters;
}

export interface ${name}Filters {
  status?: string;
  createdAfter?: Date;
  createdBefore?: Date;
}

export interface ${name}ManagementOptions {
  includeInactive?: boolean;
  expandRelations?: string[];
}

export interface ${name}ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}
`,

  hooks: (name) => `import { useState, useEffect, useCallback } from 'react';
import { ${name} } from '@/libs/domain';
import { use${name}Service } from '@/libs/services';

export interface Use${name}Result {
  ${name.toLowerCase()}s: ${name}[];
  loading: boolean;
  error: string | null;
  create${name}: (data: Create${name}Data) => Promise<${name}>;
  update${name}: (id: string, data: Update${name}Data) => Promise<${name}>;
  delete${name}: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function use${name}Management(): Use${name}Result {
  const [${name.toLowerCase()}s, set${name}s] = useState<${name}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ${name.toLowerCase()}Service = use${name}Service();

  const load${name}s = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await ${name.toLowerCase()}Service.list();
      set${name}s(result.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [${name.toLowerCase()}Service]);

  const create${name} = useCallback(async (data: Create${name}Data): Promise<${name}> => {
    setError(null);
    try {
      const new${name} = await ${name.toLowerCase()}Service.create(data);
      set${name}s(prev => [...prev, new${name}]);
      return new${name};
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create ${name.toLowerCase()}';
      setError(message);
      throw err;
    }
  }, [${name.toLowerCase()}Service]);

  const update${name} = useCallback(async (id: string, data: Update${name}Data): Promise<${name}> => {
    setError(null);
    try {
      const updated${name} = await ${name.toLowerCase()}Service.update(id, data);
      set${name}s(prev => prev.map(item => item.id === id ? updated${name} : item));
      return updated${name};
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update ${name.toLowerCase()}';
      setError(message);
      throw err;
    }
  }, [${name.toLowerCase()}Service]);

  const delete${name} = useCallback(async (id: string): Promise<void> => {
    setError(null);
    try {
      await ${name.toLowerCase()}Service.delete(id);
      set${name}s(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete ${name.toLowerCase()}';
      setError(message);
      throw err;
    }
  }, [${name.toLowerCase()}Service]);

  useEffect(() => {
    load${name}s();
  }, [load${name}s]);

  return {
    ${name.toLowerCase()}s,
    loading,
    error,
    create${name},
    update${name},
    delete${name},
    refresh: load${name}s,
  };
}
`,

  service: (name) => `import { ${name} } from '@/libs/domain';
import { ApiService } from '@/libs/services/api/base/ApiService';

export class ${name}Service extends ApiService {
  private readonly basePath = '/${name.toLowerCase()}s';

  async list(options?: List${name}Options): Promise<List${name}Result> {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.sortBy) params.append('sortBy', options.sortBy);
    if (options?.sortOrder) params.append('sortOrder', options.sortOrder);

    return this.get<List${name}Result>(\`\${this.basePath}?\${params.toString()}\`);
  }

  async getById(id: string): Promise<${name}> {
    return this.get<${name}>(\`\${this.basePath}/\${id}\`);
  }

  async create(data: Create${name}Data): Promise<${name}> {
    return this.post<${name}>(this.basePath, data);
  }

  async update(id: string, data: Update${name}Data): Promise<${name}> {
    return this.put<${name}>(\`\${this.basePath}/\${id}\`, data);
  }

  async delete(id: string): Promise<void> {
    return this.delete<void>(\`\${this.basePath}/\${id}\`);
  }
}

// Hook to use the service
export function use${name}Service(): ${name}Service {
  return new ${name}Service();
}
`,

  component: (name) => `import React from 'react';
import { ${name} } from '@/libs/domain';
import { Card } from '@/libs/ui';
import { Styled${name}Card, ${name}Header, ${name}Content } from './${name}Card.styled';

export interface ${name}CardProps {
  ${name.toLowerCase()}: ${name};
  onClick?: (${name.toLowerCase()}: ${name}) => void;
  onEdit?: (${name.toLowerCase()}: ${name}) => void;
  onDelete?: (${name.toLowerCase()}: ${name}) => void;
  showActions?: boolean;
}

export function ${name}Card({
  ${name.toLowerCase()},
  onClick,
  onEdit,
  onDelete,
  showActions = false,
}: ${name}CardProps) {
  const handleClick = () => {
    onClick?.(${name.toLowerCase()});
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(${name.toLowerCase()});
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(${name.toLowerCase()});
  };

  return (
    <Styled${name}Card onClick={handleClick}>
      <Card>
        <${name}Header>
          <h3>{${name.toLowerCase()}.name || '${name}'}</h3>
          {showActions && (
            <div>
              <button onClick={handleEdit}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          )}
        </${name}Header>
        <${name}Content>
          <p>Created: {new Date(${name.toLowerCase()}.createdAt).toLocaleDateString()}</p>
          {/* Add more ${name.toLowerCase()} details here */}
        </${name}Content>
      </Card>
    </Styled${name}Card>
  );
}
`,

  styledComponent: (name) => `import styled from 'styled-components';

export const Styled${name}Card = styled.div\`
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
  }
\`;

export const ${name}Header = styled.div\`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: \${({ theme }) => theme.spacing.md};

  h3 {
    margin: 0;
    color: \${({ theme }) => theme.colors.text.primary};
  }

  div {
    display: flex;
    gap: \${({ theme }) => theme.spacing.sm};
  }

  button {
    padding: \${({ theme }) => theme.spacing.xs} \${({ theme }) => theme.spacing.sm};
    border: 1px solid \${({ theme }) => theme.colors.border.light};
    border-radius: \${({ theme }) => theme.borderRadius.sm};
    background: \${({ theme }) => theme.colors.background.paper};
    cursor: pointer;

    &:hover {
      background: \${({ theme }) => theme.colors.background.hover};
    }
  }
\`;

export const ${name}Content = styled.div\`
  p {
    margin: \${({ theme }) => theme.spacing.xs} 0;
    color: \${({ theme }) => theme.colors.text.secondary};
    font-size: \${({ theme }) => theme.typography.size.sm};
  }
\`;
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
}

function generateModule(moduleName) {
  const name = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
  const basePath = path.join(process.cwd(), 'src/modules', \`mod-\${moduleName.toLowerCase()}\`);

  console.log(\`📦 Generating module: mod-\${moduleName.toLowerCase()}\`);

  // Domain layer
  const domainPath = path.join(basePath, 'domain');
  writeFile(path.join(domainPath, 'entities', \`\${name}.ts\`), TEMPLATES.entity(name));
  writeFile(path.join(domainPath, 'repositories', \`I\${name}Repository.ts\`), TEMPLATES.repository(name));
  writeFile(path.join(domainPath, 'use-cases', \`\${name}ManagementUseCase.ts\`), TEMPLATES.useCase(name));
  writeFile(path.join(domainPath, 'interfaces', \`\${name.toLowerCase()}.interfaces.ts\`), TEMPLATES.interfaces(name));

  // Data layer
  const dataPath = path.join(basePath, 'data');
  writeFile(path.join(dataPath, 'repositories', \`Server\${name}Repository.ts\`), \`// TODO: Implement Server\${name}Repository\`);

  // Presentation layer
  const presentationPath = path.join(basePath, 'presentation');
  writeFile(path.join(presentationPath, 'hooks', \`use\${name}Management.ts\`), TEMPLATES.hooks(name));
  writeFile(path.join(presentationPath, 'services', \`\${name}Service.ts\`), TEMPLATES.service(name));
  writeFile(path.join(presentationPath, 'components', \`\${name}Card`, \`\${name}Card.tsx\`), TEMPLATES.component(name));
  writeFile(path.join(presentationPath, 'components', \`\${name}Card`, \`\${name}Card.styled.ts\`), TEMPLATES.styledComponent(name));

  // Index files
  writeFile(path.join(domainPath, 'index.ts'), \`export * from './entities/\${name}';
export * from './repositories/I\${name}Repository';
export * from './use-cases/\${name}ManagementUseCase';
export * from './interfaces/\${name.toLowerCase()}.interfaces';
\`);

  writeFile(path.join(dataPath, 'index.ts'), \`export * from './repositories/Server\${name}Repository';\`);

  writeFile(path.join(presentationPath, 'index.ts'), \`export * from './hooks/use\${name}Management';
export * from './services/\${name}Service';
export * from './components/\${name}Card/\${name}Card';
\`);

  writeFile(path.join(basePath, 'index.ts'), \`export * from './domain';
export * from './data';
export * from './presentation';
\`);

  console.log(\`✅ Module mod-\${moduleName.toLowerCase()} generated successfully!\`);
  console.log(\`📁 Location: \${basePath}\`);
  console.log('');
  console.log('Generated files:');
  console.log(\`  - Domain: entities, repositories, use-cases, interfaces\`);
  console.log(\`  - Data: repository implementation\`);
  console.log(\`  - Presentation: hooks, services, components\`);
}

// CLI handling
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: npm run generate:module <module-name>');
  console.log('Example: npm run generate:module product');
  process.exit(1);
}

const moduleName = args[0];
generateModule(moduleName);
