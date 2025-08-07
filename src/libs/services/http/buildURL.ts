import { BuildURLParams } from './interfaces';

/**
 * Renders endpoint template with parameters
 */
const renderEndpoint = (template: string, data: Record<string, string>): string => {
  return template.replace(/{(.*?)}/g, (_, key) => data[key] || `{${key}}`);
};

/**
 * Builds complete URL from base URL, endpoint, params, and query
 */
const buildURL = ({
  endpoint,
  extraCustomQuery = '',
  params,
  query = {},
  url,
}: BuildURLParams): string => {
  const renderedEndpoint = params ? renderEndpoint(endpoint, params) : endpoint;

  const queryParams = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        queryParams.set(key, value.join(','));
      } else {
        queryParams.set(key, String(value));
      }
    }
  });

  const renderedQuery = queryParams.toString();
  const finalQueryString = [extraCustomQuery, renderedQuery].filter(Boolean).join('&');

  return `${url}${renderedEndpoint}${finalQueryString ? `?${finalQueryString}` : ''}`;
};

export { buildURL };
