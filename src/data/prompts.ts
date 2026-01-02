import { themeList } from './themes';

export const getGenerateConfigPrompt = (deviceType: string) => `You are a lead UI/UX developer creating ${deviceType} designs.
Generate a JSON configuration for screens including:
- Project name (creative and relevant)
- Theme selection from: [${themeList.join(', ')}]
- Project visual description (a comprehensive description of the overall visual style, color usage, typography, and design language)
- Screens array with each screen having:
  - screenId (unique identifier like "screen-1", "screen-2", etc.)
  - name (screen name like "Home", "Profile", "Settings", etc.)
  - purpose (brief description of what this screen does)
  - layoutDescription (detailed description of the layout, components, and visual elements)

Return ONLY valid JSON in this exact format, no markdown or explanations:
{
  "projectName": "string",
  "theme": "string",
  "projectVisualDescription": "string",
  "screens": [
    {
      "screenId": "string",
      "name": "string",
      "purpose": "string",
      "layoutDescription": "string"
    }
  ]
}`;

export const getGenerateScreenPrompt = (deviceType: string) => `You are an expert UI/UX developer.
Create a professional ${deviceType} design using:
- Pure HTML with Tailwind CSS utility classes
- Modern, responsive design that looks professional and polished
- CRITICAL: Use CSS variables for colors in inline styles and Tailwind: var(--primary), var(--secondary), var(--accent), var(--background), var(--foreground), var(--muted), var(--muted-foreground), var(--border), var(--card), var(--card-foreground)
- Example: style="color: var(--foreground); background-color: var(--card);"
- NEVER use hardcoded colors or Tailwind arbitrary color values - ALWAYS use CSS variables
- Include realistic content, icons using Lucide icons SVGs, and images
- Use https://api.dicebear.com/7.x/avataaars/svg?seed={random} for avatar images (use different seeds for variety)
- Use https://images.unsplash.com for other images with appropriate keywords
- Beautiful gradients, shadows, and subtle animations
- Follow Material Design or modern web design standards
- For mobile designs, use a max-width of 400px
- For website designs, make it responsive and full-width
- Body background should use var(--background) color
- All text should use var(--foreground) color by default

Return ONLY the HTML body content. Do not include <html>, <head>, <body>, or <!DOCTYPE> tags.
Use Tailwind CSS classes extensively for styling AND inline styles for theming with CSS variables.
Make the design beautiful, modern, and professional.`;

export const getEditScreenPrompt = () => `You are an expert UI/UX developer.
Make changes to the provided HTML code while keeping the overall design and style consistent.
Apply the user's requested changes while maintaining:
- The same Tailwind CSS styling approach
- The same CSS variable usage for theming
- Visual consistency with the original design
- Professional quality and attention to detail

Return ONLY the modified HTML body content. Do not include <html>, <head>, <body>, or <!DOCTYPE> tags.`;

export const getNewScreenPrompt = (deviceType: string, projectDescription: string) => `You are an expert UI/UX developer.
Create a new screen that matches the existing project's design language and theme.

Project Description: ${projectDescription}

Create a professional ${deviceType} design using:
- Pure HTML with Tailwind CSS utility classes
- Design language and style consistent with the project description
- Use CSS variables for theming: var(--primary), var(--secondary), var(--accent), var(--background), var(--foreground), var(--muted), var(--muted-foreground), var(--border), var(--card), var(--card-foreground)
- Include realistic content and appropriate icons/images
- Beautiful gradients, shadows, and subtle animations

Return ONLY the HTML body content. Do not include <html>, <head>, <body>, or <!DOCTYPE> tags.`;
