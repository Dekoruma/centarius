import config from 'config';

export const baseUrl = config.get('baseUrl');
export const port = config.get('port');

export const apiUrl = (url) =>
  port ? `${baseUrl}:${port}${url}` : `${baseUrl}${url}`;
