export const getInitials = (fullName: string): string => {
  return fullName
    .split(' ')
    .map((name) => name.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

export const themeOptions = ['light', 'dark', 'system'] as const;
