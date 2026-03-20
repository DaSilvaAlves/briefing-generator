# Gerador de Briefings Imersão IA (AIOS Told)

## Propósito

Este Gerador de Briefings é uma **"told" (ferramenta guiada)** essencial para os participantes da Imersão de IA Avançada PT. O seu objetivo é simplificar o processo de transformar uma ideia de projeto abstrata em:

1.  **Requisitos estruturados:** Um Product Requirements Document (PRD) de alto nível.
2.  **Prompts para Agentes AIOS:** Instruções detalhadas para orquestrar agentes de IA (Arquitect, PM, Dev) via Gemini CLI.
3.  **Project Seed:** Um "ADN" do projeto para injetar no AIOS Dashboard.

Ele serve como um primeiro contacto prático com a **orquestração de IA de Nível 4**, permitindo que os alunos experienciem o poder do framework AIOS de forma acessível, mesmo sem experiência em programação avançada.

## Como Usar

### 1. Execução Local (para desenvolvedores ou para explorar o código)

Certifique-se de ter o Node.js e npm instalados.

1.  Navegue até o diretório `briefing-generator` no terminal:
    ```bash
    cd C:\Users\XPS\Documents\imersao-tools\briefing-generator
    ```
2.  Instale as dependências do projeto:
    ```bash
    npm install
    ```
3.  Inicie a aplicação em modo de desenvolvimento:
    ```bash
    npm run dev
    ```
    A aplicação será aberta no seu navegador, geralmente em `http://localhost:5173`.

### 2. Guia de Preenchimento (4 Passos)

Siga os 4 passos do formulário, fornecendo informações sobre:

*   **Identidade:** Nome do projeto e o seu nível de experiência.
*   **A Dor:** O problema central que o seu projeto pretende resolver.
*   **Solução:** As funcionalidades MVP (Produto Mínimo Viável).
*   **Impacto:** O público-alvo da solução e possíveis restrições.

### 3. Outputs Principais

Após preencher o formulário, a IA gerará 3 outputs principais:

*   **Injetar na Linha de Montagem AIOS (JSON):** Faça download deste ficheiro `.json`. Ele contém o "ADN estruturado" do seu projeto, pronto para ser "injetado" no AIOS Dashboard ou em outras ferramentas de orquestração AIOS, automatizando a criação inicial do seu projeto.
    *   **Uso na Imersão:** Será explicado como usar este ficheiro para iniciar o seu projeto automaticamente no ambiente AIOS.
*   **Payload de Orquestração (Gemini CLI):** Uma string de comando formatada para ser copiada e colada diretamente no terminal do Gemini CLI. Este payload instrui os agentes AIOS a iniciar a orquestração do seu projeto (e.g., `@architect`, `@pm`, `@dev`).
    *   **Exemplo:** `@architect: Cria o PROJECT_MAP.md e a estrutura de pastas modular.`
*   **Blueprint Estratégico (Claude Code):** Um prompt detalhado e estruturado para o Claude Code (ou outro LLM avançado). Este blueprint descreve a visão, o stack técnico sugerido, requisitos funcionais e diretrizes de design, permitindo que o Claude Code atue como um "executor inteligente".

## Configurações e Integrações

*   **Supabase:** A ferramenta integra-se com o Supabase para persistir e carregar briefings. Para uso completo, um ambiente Supabase deve ser configurado (será abordado na Imersão).
*   **Prompt Optimizer:** A ferramenta pode "enviar para o Prompt Optimizer" (`http://localhost:5193`), uma outra ferramenta no ecossistema AIOS para refinar e otimizar os prompts gerados.

Este Gerador de Briefings é um poderoso ponto de partida para a sua jornada na orquestração de IA com o framework AIOS!
