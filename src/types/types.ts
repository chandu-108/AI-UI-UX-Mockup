export interface ScreenConfig {
  id?: number;
  projectId: string;
  screenId: string;
  screenName: string;
  purpose: string;
  screenDescription: string;
  code?: string;
}

export interface ProjectType {
  id?: number;
  projectId: string;
  userId: string;
  userInput: string;
  device: string;
  projectName: string;
  theme: string;
  projectVisualDescription?: string;
  screenshot?: string;
  config?: unknown;
  createdOn?: Date;
  screens?: ScreenConfig[];
}

export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  card: string;
  cardForeground: string;
}

export interface GenerateConfigResponse {
  projectName: string;
  theme: string;
  projectVisualDescription: string;
  screens: {
    screenId: string;
    name: string;
    purpose: string;
    layoutDescription: string;
  }[];
}

export interface Suggestion {
  icon: string;
  name: string;
  description: string;
}
