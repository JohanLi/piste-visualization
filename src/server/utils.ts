// https://gist.github.com/codeguy/6684588#gistcomment-3243980
export const createSlug = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/--+/g, '-');
