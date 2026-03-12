// Smart Requirements Engine — Imersão IA Portugal
// Generates BriefingOutput JSON for pipeline consumption (Prompt Optimizer → AIOS Compiler)

export interface BriefingOutput {
  projectName: string;
  painPoints: string;
  features: string[];
  targetAudience: string;
  experienceLevel: 'iniciante' | 'intermediário' | 'avançado';
  suggestedStack: {
    architecture: string;
    frontend: string;
    backend: string;
    database: string;
  };
  uiVibe: string;
  prdText: string;
  timestamp: string;
}

export type ProjectType = 'restaurant' | 'dashboard' | 'ecommerce' | 'portfolio' | 'saas' | 'scheduling' | 'generic';

export const PROJECT_TYPE_LABELS: Record<ProjectType, { label: string; emoji: string; architecture: string }> = {
  restaurant:  { label: 'Restaurante / Café',      emoji: '🍽️',  architecture: 'PWA Mobile-First' },
  dashboard:   { label: 'Dashboard / Painel',       emoji: '📊',  architecture: 'Analytical SPA' },
  ecommerce:   { label: 'Loja Online',              emoji: '🛒',  architecture: 'Conversion-Optimised Store' },
  portfolio:   { label: 'Portfólio / Showcase',     emoji: '🎨',  architecture: 'Static Site com Animações' },
  saas:        { label: 'SaaS / Plataforma',        emoji: '🚀',  architecture: 'Monolito Modular SaaS' },
  scheduling:  { label: 'Agendamentos / Reservas',  emoji: '📅',  architecture: 'Calendar-First PWA' },
  generic:     { label: 'Aplicação Web',            emoji: '💡',  architecture: 'Monolito Modular Moderno' },
};

interface StackConfig {
  architecture: string;
  frontend: string;
  backend: string;
  database: string;
  uiVibe: string;
}

const STACK_MAP: Record<ProjectType, StackConfig> = {
  restaurant: {
    architecture: 'PWA Mobile-First',
    frontend: 'React 19 + Vite',
    backend: 'Supabase',
    database: 'PostgreSQL + Supabase',
    uiVibe: 'Neo-Gastro Premium',
  },
  dashboard: {
    architecture: 'Analytical SPA',
    frontend: 'React 19 + Vite',
    backend: 'Supabase',
    database: 'PostgreSQL + Supabase',
    uiVibe: 'Dark Dashboard Profissional',
  },
  ecommerce: {
    architecture: 'Conversion-Optimised Store',
    frontend: 'React 19 + Vite',
    backend: 'Supabase',
    database: 'PostgreSQL + Supabase',
    uiVibe: 'Premium E-commerce',
  },
  portfolio: {
    architecture: 'Static Site com Animações',
    frontend: 'React 19 + Vite',
    backend: 'Nenhum (estático)',
    database: 'Nenhuma',
    uiVibe: 'Portfolio Criativo Moderno',
  },
  saas: {
    architecture: 'Monolito Modular SaaS',
    frontend: 'React 19 + Vite',
    backend: 'Supabase + Edge Functions',
    database: 'PostgreSQL + Supabase RLS',
    uiVibe: 'SaaS Clean Dark Mode',
  },
  scheduling: {
    architecture: 'Calendar-First PWA',
    frontend: 'React 19 + Vite',
    backend: 'Supabase',
    database: 'PostgreSQL + Supabase',
    uiVibe: 'Clean Scheduling UI',
  },
  generic: {
    architecture: 'Monolito Modular Moderno',
    frontend: 'React 19 + Vite',
    backend: 'Supabase',
    database: 'PostgreSQL + Supabase',
    uiVibe: 'Premium High-Contrast Dark Mode',
  },
};

export function detectProjectType(text: string): ProjectType {
  const t = text.toLowerCase();
  if (/menu|restaurante|ementa|comida|café|pastelaria|takeaway|prato|cozinha/.test(t)) return 'restaurant';
  if (/dashboard|painel|analise|análise|gráfico|métricas|kpi|relatório|estatísticas|backoffice/.test(t)) return 'dashboard';
  if (/loja|e-commerce|ecommerce|vender|carrinho|produto|comprar|pagamento|stock|encomenda|stripe/.test(t)) return 'ecommerce';
  if (/portfólio|portfolio|galeria|cv|currículo|showcase|projetos|trabalhos/.test(t)) return 'portfolio';
  if (/saas|subscrição|plano|faturação|clientes|utilizadores|multi-tenant|dashboard.*clientes/.test(t)) return 'saas';
  if (/agenda|marcação|agendamento|reserva|horário|calendário|appointment|booking/.test(t)) return 'scheduling';
  return 'generic';
}

/** Generates structured BriefingOutput JSON for pipeline consumption */
export function generateBriefingOutput(briefing: {
  projectName: string;
  painPoints: string;
  features: string;
  targetAudience: string;
  constraints?: string;
  experienceLevel: 'iniciante' | 'intermediário' | 'avançado';
}): BriefingOutput {
  const { projectName, painPoints, features, targetAudience, constraints, experienceLevel } = briefing;
  const combined = projectName + ' ' + painPoints + ' ' + features;
  const projectType = detectProjectType(combined);
  const stack = STACK_MAP[projectType];
  const featuresList = features.split('\n').filter((f: string) => f.trim() !== '');

  const constraintsSection = constraints?.trim()
    ? `\n\n## Restrições\n${constraints.trim()}`
    : '';

  const prdText = `# PRD: ${projectName}\n\n## Problema\n${painPoints}\n\n## Público-Alvo\n${targetAudience}${constraintsSection}\n\n## Funcionalidades MVP\n${featuresList.map((f, i) => `- FR-${i + 1}: ${f.trim()}`).join('\n')}\n\n## Stack Sugerida\n- Frontend: ${stack.frontend}\n- Backend: ${stack.backend}\n- Base de Dados: ${stack.database}\n- Arquitectura: ${stack.architecture}`;

  return {
    projectName,
    painPoints,
    features: featuresList,
    targetAudience,
    experienceLevel,
    suggestedStack: {
      architecture: stack.architecture,
      frontend: stack.frontend,
      backend: stack.backend,
      database: stack.database,
    },
    uiVibe: stack.uiVibe,
    prdText,
    timestamp: new Date().toISOString(),
  };
}

export const generateSmartRequirements = (briefing: any) => {
  const { projectName, painPoints: pain, features, experienceLevel, targetAudience } = briefing;

  const combined = projectName + ' ' + pain + ' ' + features;
  const projectType = detectProjectType(combined);
  const stack = STACK_MAP[projectType];
  const suggestedArchitecture = stack.architecture;
  const frontendStack = stack.frontend;
  const backendStack = stack.backend;
  const dbStack = stack.database;
  const uiVibe = stack.uiVibe;

  const featuresList = features.split('\n').filter((f: string) => f.trim() !== "");

  // --- COMPONENTE 1: PROMPT PARA CLAUDE CODE (O EXECUTOR) ---
  const claudePrompt = `
# 🏆 DIRETRIZ DE EXECUÇÃO: ARQUITETURA DE ELITE
**PROJETO:** ${projectName.toUpperCase()}
**NÍVEL DO ALUNO:** ${experienceLevel.toUpperCase()}
**FOCO:** Branding Pessoal e Entrega de Alto Valor (Padrão Manuel Manero)

## 🎯 VISÃO ESTRATÉGICA
Este não é apenas um projeto técnico; é uma ferramenta de posicionamento. O objetivo é resolver a dor: "${pain}" para o público: "${targetAudience}".

## 🏛️ BLUEPRINT TÉCNICO (STACK PREMIUM)
- **Frontend:** ${frontendStack} (Foco em performance e "Micro-interações")
- **Backend/Data:** ${dbStack}
- **Arquitetura:** ${suggestedArchitecture}

## 📋 REQUISITOS FUNCIONAIS (BACKLOG DE ALTO NÍVEL)
${featuresList.map((f: string, i: number) => `### FR-${i+1}: ${f.trim()}
- **Objetivo:** Maximizar a percepção de valor para o utilizador final.
- **UX:** Transições fluidas e feedback imediato.
- **Lógica:** Implementar com Clean Code e padrões DRY.`).join('\n\n')}

## 🎨 DIRETRIZES DE DESIGN (O EFEITO UAU)
- **Aesthetic:** ${uiVibe}.
- **Interações:** Usa Framer Motion ou transições nativas do Tailwind v4 para estados de "Loading" e "Success".
- **Empty States:** Nunca mostres uma lista vazia sem um design elegante e uma CTA.

## 🔐 SEGURANÇA E DADOS
- Implementar Row Level Security (RLS) se usares Supabase.
- Validação de inputs rigorosa com Zod.

---
**ORDEM DE EXECUÇÃO:**
1. @architect: Cria o PROJECT_MAP.md e a estrutura de pastas modular.
2. @pm: Gera 3 User Stories detalhadas para cada funcionalidade acima.
3. @dev: Inicia o "Scaffolding" com Tailwind v4 e Lucide Icons.
`;

  // --- COMPONENTE 2: PAYLOAD PARA GEMINI CLI / AIOS (O CÉREBRO) ---
  const geminiPrompt = `
# 🚀 MISSION_START: ${projectName.toUpperCase()}
**CONTEXT:** Independent Project Scaffolding.
**GOAL:** Transform requirements into a functional software structure.

### 1. INITIAL_DOCUMENTATION:
- Create 'docs/blueprint.md' with the following project definition:
{
  "project_name": "${projectName}",
  "problem_solved": "${pain}",
  "target_audience": "${targetAudience}",
  "tech_stack": ["${frontendStack}", "${backendStack}", "${dbStack}"]
}

### 2. ARCHITECTURAL_SCAFFOLDING:
- Task: Define a modular folder structure for a "${suggestedArchitecture}".
- Task: Create 'src/index.css' with the initial theme for "${uiVibe}".
- Task: Create a 'schema.sql' file with basic table definitions for: ${featuresList.join(', ')}.

### 3. ACTION_PLAN:
- Step 1: Initialize the README.md with the project vision.
- Step 2: Set up the base React/Vite components.
- Step 3: Implement the first User Story: "${featuresList[0] || 'Base CRUD'}".

---
> **Instrução para o Aluno:** Copia este Payload. Ele foi desenhado para que a IA assuma o controlo total da estrutura inicial do teu projeto de forma autónoma.
`;

  return `
${claudePrompt}

================================================================================

${geminiPrompt}
`;
};

/**
 * GERA O ADN ESTRUTURADO PARA A LINHA DE MONTAGEM AIOS (FÍSICA)
 */
export const generateProjectSeed = (briefing: any) => {
  const { projectName, painPoints, features, experienceLevel, targetAudience } = briefing;
  
  return {
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    project: {
      name: projectName,
      level: experienceLevel,
      pain: painPoints,
      audience: targetAudience,
      features: features.split('\n').filter((f: string) => f.trim() !== "")
    },
    architecture: {
      suggested: "Monolito Modular Moderno",
      frontend: "React 19 + Vite + Tailwind CSS v4",
      database: "PostgreSQL + Supabase"
    },
    dna: "AIOS-ELITE-SEED"
  };
};
