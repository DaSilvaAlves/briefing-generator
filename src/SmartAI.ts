// Motor de Engenharia de Requisitos de Elite (Nível Arquiteto Senior)
// Alinhado com a Comunidade Manuel Manero: Foco em Valor, Branding e Execução Premium.

export const generateSmartRequirements = (briefing: any) => {
  const { projectName, painPoints: pain, features, experienceLevel, targetAudience } = briefing;
  
  // Lógica de Arquitetura Dinâmica (Refinada)
  let suggestedArchitecture = "Monolito Modular Moderno";
  let frontendStack = "React 19 + Vite + Tailwind CSS v4";
  let backendStack = "Node.js (Serverless)";
  let dbStack = "PostgreSQL + Prisma ORM (via Supabase)";
  let uiVibe = "Premium High-Contrast / Modern Dark Mode";

  const keywords = (pain + " " + features).toLowerCase();

  // Deteção de Padrões para Stacks de Elite
  if (keywords.includes("menu") || keywords.includes("restaurante") || keywords.includes("comida")) {
    suggestedArchitecture = "PWA Strategy (Mobile-First Hero)";
    frontendStack = "Next.js 15 (App Router) + Framer Motion";
    dbStack = "PostgreSQL com RLS (Row Level Security)";
  } else if (keywords.includes("dados") || keywords.includes("dashboard") || keywords.includes("analise")) {
    suggestedArchitecture = "Real-time Analytical Engine";
    frontendStack = "React + Tremor UI + Recharts";
    backendStack = "Python FastAPI (para processamento denso)";
  } else if (keywords.includes("loja") || keywords.includes("venda") || keywords.includes("carrinho")) {
    suggestedArchitecture = "Conversion-Optimized E-commerce";
    frontendStack = "Next.js + Stripe SDK + Tailwind v4";
  }

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
