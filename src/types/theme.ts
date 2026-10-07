export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type ColorVariant = 'primary' | 'secondary' | 'surface' | 'muted' | 'destructive';

export type SizeVariant = 'sm' | 'md' | 'lg' | 'xl';

export interface ThemeConfig {
  name: string;
  dark: boolean;
  accentColor: string;
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
}
