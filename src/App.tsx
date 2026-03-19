import React, { useState, useEffect } from 'react';
import './App.css';
import { Download, Copy, ChevronRight, ChevronLeft, CheckCircle, BrainCircuit, Sparkles, Terminal } from 'lucide-react';
import { generateSmartRequirements, generateProjectSeed, generateBriefingOutput, detectProjectType, PROJECT_TYPE_LABELS } from './SmartAI';
import { saveBriefing, getBriefingById } from './supabaseClient';

interface FormData {
  projectName: string;
  painPoints: string;
  features: string;
  targetAudience: string;
  constraints: string;
  experienceLevel: 'iniciante' | 'intermediário' | 'avançado';
}

const steps = [
  { id: 1, title: 'Identidade', label: 'Nome e Nível', icon: <BrainCircuit size={20} /> },
  { id: 2, title: 'A Dor', label: 'Problema Central', icon: <ChevronRight size={20} /> },
  { id: 3, title: 'Solução', label: 'Funcionalidades', icon: <Sparkles size={20} /> },
  { id: 4, title: 'Impacto', label: 'Público-Alvo', icon: <CheckCircle size={20} /> },
];

const PROMPT_OPTIMIZER_URL = import.meta.env.VITE_PROMPT_OPTIMIZER_URL || 'http://localhost:5193';

function loadProfileFromURL(): Partial<FormData> {
  const params = new URLSearchParams(window.location.search);
  const profileParam = params.get('profile');
  if (!profileParam) return {};
  try {
    const profile = JSON.parse(decodeURIComponent(profileParam)) as Record<string, string>;
    // AC-6: Map all relevant ProfileData fields to FormData
    const experienceLevel = (
      profile['logic'] === 'high' || profile['intent'] === 'entrepreneur'
        ? 'avançado'
        : profile['tools_knowledge'] === 'vibe_master'
        ? 'intermediário'
        : 'iniciante'
    ) as FormData['experienceLevel'];

    // market_view → targetAudience hint
    const targetAudience = profile['market_view']
      ? `Público: ${profile['market_view']}`
      : '';

    // vision → projectName hint (if user hasn't typed anything)
    const projectName = profile['vision'] ? profile['vision'] : '';

    return { experienceLevel, ...(targetAudience && { targetAudience }), ...(projectName && { projectName }) };
  } catch { return {}; }
}

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(() => {
    const fromURL = loadProfileFromURL();
    const saved = localStorage.getItem('briefing-v2');
    const base = saved ? JSON.parse(saved) as FormData : {
      projectName: '',
      painPoints: '',
      features: '',
      targetAudience: '',
      constraints: '',
      experienceLevel: 'iniciante' as const,
    };
    return { ...base, ...fromURL };
  });
  const [isFinished, setIsFinished] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedPRD, setGeneratedPRD] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState('');
  const [briefingJSON, setBriefingJSON] = useState<string>('');
  const [briefingId, setBriefingId] = useState<string | null>(null);

  // AC-11: detected project type (shown live as user types in step 2)
  const detectedType = formData.painPoints.trim().length > 10
    ? detectProjectType(formData.projectName + ' ' + formData.painPoints + ' ' + formData.features)
    : null;

  useEffect(() => {
    localStorage.setItem('briefing-v2', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const loadId = params.get('load-briefing');
    if (loadId) {
      getBriefingById(loadId).then(data => {
        if (data) {
          setFormData(prev => ({
            ...prev,
            projectName: data.projectName ?? '',
            painPoints: data.painPoints ?? '',
            features: Array.isArray(data.features) ? data.features.join('\n') : '',
            targetAudience: data.targetAudience ?? '',
            experienceLevel: (data.experienceLevel as FormData['experienceLevel']) ?? 'iniciante',
          }));
          setBriefingJSON(JSON.stringify(data, null, 2));
          setIsFinished(true);
        }
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validateCurrentStep = () => {
    const fields: Record<number, keyof FormData> = {
      1: 'projectName',
      2: 'painPoints',
      3: 'features',
      4: 'targetAudience'
    };
    
    const field = fields[currentStep as keyof typeof fields];
    if (field && !formData[field].trim()) {
      setError('Por favor, preenche este campo antes de continuar.');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (!validateCurrentStep()) return;
    
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      processPRD();
    }
  };

  const processPRD = () => {
    setIsProcessing(true);
    setTimeout(async () => {
      const prd = generateSmartRequirements(formData);
      setGeneratedPRD(prd);
      const output = generateBriefingOutput(formData);
      setBriefingJSON(JSON.stringify(output, null, 2));

      // Persist to Supabase 'briefings' table (graceful — never blocks the UI)
      const saved = await saveBriefing(output);
      if (saved?.id) setBriefingId(saved.id);

      setIsProcessing(false);
      setIsFinished(true);
    }, 2000);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    setError('');
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    alert(`${type} Copiado com sucesso!`);
  };

  const downloadProjectSeed = () => {
    const seed = generateProjectSeed(formData);
    const blob = new Blob([JSON.stringify(seed, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-project-seed-${formData.projectName.replace(/\s+/g, '-')}.json`;
    a.click();
    alert('ADN DO PROJETO GERADO! Agora injeta este ficheiro na MISSÃO 01 do AIOS Dashboard.');
  };

  return (
    <div className="card-container">
      <div className="card">
        <header className="header">
          <div className="logo-area">
            <BrainCircuit size={32} color="var(--primary)" />
            <h1>Imersão AI Generator</h1>
          </div>
          <p className="subtitle">Do Conceito ao Código em 4 Passos</p>
        </header>

        {!isFinished && !isProcessing ? (
          <>
            {/* AC-9: progress bar with % */}
            <div className="step-indicator">
              {steps.map(step => (
                <div
                  key={step.id}
                  className={`step-dot ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
                >
                  {currentStep > step.id ? <CheckCircle size={18} /> : step.id}
                </div>
              ))}
            </div>
            <div style={{ width: '100%', background: '#1e293b', borderRadius: '4px', height: '4px', margin: '-12px 0 16px' }}>
              <div style={{ width: `${((currentStep - 1) / steps.length) * 100}%`, background: 'var(--primary)', height: '4px', borderRadius: '4px', transition: 'width 0.3s ease' }} />
            </div>
            <p style={{ textAlign: 'right', fontSize: '0.75rem', color: '#64748b', marginTop: '-10px', marginBottom: '16px' }}>
              Passo {currentStep} de {steps.length} — {Math.round(((currentStep - 1) / steps.length) * 100)}% concluído
            </p>

            <div className="form-content fade-in">
              {currentStep === 1 && (
                <>
                  <div className="form-group">
                    <label>Qual é o nome do teu projeto?</label>
                    <p className="hint">Pensa em algo curto e memorável.</p>
                    <input 
                      type="text" 
                      name="projectName" 
                      placeholder="Ex: Gestor de Oficina Pro" 
                      value={formData.projectName}
                      onChange={handleChange}
                      autoFocus
                    />
                  </div>
                  <div className="form-group">
                    <label>Qual é o teu nível de experiência?</label>
                    <p className="hint">Isto ajusta a complexidade técnica e pedagógica do PRD.</p>
                    <div className="level-selector" style={{display: 'flex', gap: '12px'}}>
                      {(['iniciante', 'intermediário', 'avançado'] as const).map(level => (
                        <button
                          key={level}
                          type="button"
                          className={`btn-secondary ${formData.experienceLevel === level ? 'active' : ''}`}
                          style={formData.experienceLevel === level ? {borderColor: 'var(--primary)', background: 'rgba(99, 102, 241, 0.1)'} : {}}
                          onClick={() => setFormData(prev => ({ ...prev, experienceLevel: level }))}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <div className="form-group">
                  <label>Que problema (Dor) estás a tentar resolver?</label>
                  <p className="hint">Quanto mais específico fores, melhor a IA trabalha.</p>
                  <textarea
                    name="painPoints"
                    placeholder="Ex: Perco muito tempo a organizar faturas e a marcar agendamentos à mão..."
                    value={formData.painPoints}
                    onChange={handleChange}
                    autoFocus
                  />
                  {/* AC-11: live project type detection card */}
                  {detectedType && detectedType !== 'generic' && (
                    <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', padding: '10px 14px' }}>
                      <span style={{ fontSize: '1.4rem' }}>{PROJECT_TYPE_LABELS[detectedType].emoji}</span>
                      <div>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>Detectámos o tipo de projecto:</p>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>
                          {PROJECT_TYPE_LABELS[detectedType].label} — {PROJECT_TYPE_LABELS[detectedType].architecture}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <div className="form-group">
                  <label>Quais as 3 funcionalidades principais? (Uma por linha)</label>
                  <p className="hint">O que é essencial para o MVP?</p>
                  <textarea 
                    name="features" 
                    placeholder="Agendamento automático&#10;Controlo de stock&#10;Avisos por WhatsApp" 
                    value={formData.features}
                    onChange={handleChange}
                    autoFocus
                  />
                </div>
              )}

              {currentStep === 4 && (
                <>
                  <div className="form-group">
                    <label>Para quem é esta solução?</label>
                    <p className="hint">Quem vai usar a aplicação no dia a dia?</p>
                    <textarea
                      name="targetAudience"
                      placeholder="Ex: Pequenos empresários que trabalham sozinhos. Tem de ser simples e funcionar em mobile."
                      value={formData.targetAudience}
                      onChange={handleChange}
                      autoFocus
                    />
                  </div>
                  {/* AC-8: constraints with beginner-friendly label */}
                  <div className="form-group">
                    <label>O que NÃO queres na tua aplicação? <span style={{ color: '#64748b', fontWeight: 400 }}>(opcional)</span></label>
                    <p className="hint">Ex: Sem registo obrigatório, sem pagamentos, sem versão desktop.</p>
                    <textarea
                      name="constraints"
                      placeholder="Ex: Não quero que o utilizador precise de criar conta para começar a usar..."
                      value={formData.constraints}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>
                </>
              )}

              {error && <p className="error-message fade-in" style={{color: '#f87171', fontSize: '0.9rem', marginTop: '-16px', marginBottom: '16px'}}>{error}</p>}

              <div className="button-group">
                {currentStep > 1 && (
                  <button className="btn-secondary" onClick={prevStep}>
                    <ChevronLeft size={18} /> Anterior
                  </button>
                )}
                <button className="btn-primary" onClick={nextStep}>
                  {currentStep === steps.length ? 'Gerar PRD Inteligente ✨' : 'Próximo'} <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        ) : isProcessing ? (
          <div className="processing-state">
            <div className="spinner"></div>
            <h3>A IA está a analisar o teu projeto...</h3>
            <p>Criando arquitetura, user stories e requisitos técnicos.</p>
          </div>
        ) : (
          <div className="finish-area fade-in">
            <div className="success-header">
              <Sparkles size={48} color="#fbbf24" />
              <h2>Centro de Comando Ativado</h2>
              <p>O teu projeto foi estruturado. Escolhe o teu caminho de execução.</p>
              
              <button 
                className="btn-primary" 
                style={{marginTop: '20px', width: '100%', padding: '20px', background: 'var(--primary)', color: 'black', fontSize: '1.2rem', fontWeight: 'bold'}}
                onClick={downloadProjectSeed}
              >
                Injetar na Linha de Montagem AIOS 🚀
              </button>
              <p style={{fontSize: '0.8rem', color: '#64748b', marginTop: '10px'}}>Este ficheiro (.json) é o combustível real para o teu Dashboard físico.</p>

              <button
                className="btn-primary"
                style={{marginTop: '10px', width: '100%', background: 'var(--indigo)', color: 'white'}}
                onClick={() => {
                  const output = generateBriefingOutput(formData);
                  const encoded = encodeURIComponent(JSON.stringify(output));
                  window.open(`${PROMPT_OPTIMIZER_URL}?briefing=${encoded}`, '_blank');
                }}
              >
                Enviar para o Prompt Optimizer ⚡
              </button>

              <button
                className="btn-primary"
                style={{marginTop: '10px', width: '100%', background: 'var(--success)', color: 'black'}}
                onClick={() => {
                  const output = generateBriefingOutput(formData);
                  const blob = new Blob([JSON.stringify(output, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `briefing-${formData.projectName.replace(/\s+/g, '-')}.json`;
                  a.click();
                }}
              >
                Exportar Briefing JSON 📥
              </button>

              {briefingId && (
                <div style={{marginTop: '12px', background: '#0f172a', padding: '12px 16px', borderRadius: '8px', textAlign: 'left'}}>
                  <p style={{fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px'}}>🔗 Briefing guardado — URL partilhável:</p>
                  <code style={{fontSize: '0.7rem', color: '#4ade80', wordBreak: 'break-all'}}>
                    {`${window.location.origin}?load-briefing=${briefingId}`}
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}?load-briefing=${briefingId}`)}
                    style={{marginTop: '6px', display: 'block', padding: '4px 10px', background: 'none', border: '1px solid #4ade80', color: '#4ade80', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem'}}
                  >
                    Copiar URL
                  </button>
                </div>
              )}
            </div>

            <div className="output-split" style={{display: 'flex', flexDirection: 'column', gap: '30px', marginTop: '40px'}}>
              <div style={{background: '#000', border: '2px solid var(--primary)', borderRadius: '16px', padding: '25px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                  <h3 style={{color: 'var(--primary)', margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <Terminal size={20} /> TERMINAL DE ORQUESTRAÇÃO (AIOS)
                  </h3>
                </div>
                
                <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
                  {['@pm', '@architect', '@dev'].map(skill => (
                    <div key={skill} style={{fontSize: '0.8rem', color: '#4ade80', border: '1px solid #4ade80', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace'}}>
                      {skill}: ACTIVE
                    </div>
                  ))}
                </div>

                <pre className="output-area" style={{height: '250px', fontSize: '0.8rem', background: '#0f172a', color: '#4ade80', padding: '15px', overflowY: 'auto'}}>
                  <code>{generatedPRD.split('================================================================================')[1]}</code>
                </pre>
                
                <button 
                  className="btn-primary" 
                  style={{marginTop: '20px', width: '100%', background: 'var(--primary)', color: 'black'}}
                  onClick={() => copyToClipboard(generatedPRD.split('================================================================================')[1], 'Payload Gemini')}
                >
                  Copiar Payload de Orquestração 🚀
                </button>
              </div>

              <div style={{background: '#000', border: '2px solid var(--border)', padding: '25px', color: 'var(--text)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                  <h3 style={{color: 'var(--primary)', margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <Sparkles size={20} /> BLUEPRINT ESTRATÉGICO (CLAUDE)
                  </h3>
                </div>

                <pre className="output-area" style={{height: '250px', fontSize: '0.8rem', background: '#0a0a0a', color: '#4ade80', padding: '15px', overflowY: 'auto'}}>
                  <code>{generatedPRD.split('================================================================================')[0]}</code>
                </pre>
                
                <button 
                  className="btn-primary" 
                  style={{marginTop: '20px', width: '100%', background: '#222', color: 'var(--text)', border: '2px solid var(--border)'}}
                  onClick={() => copyToClipboard(generatedPRD.split('================================================================================')[0], 'Blueprint Claude')}
                >
                  Copiar Blueprint para Claude Code 🤖
                </button>
              </div>
            </div>

            <div style={{marginTop: '40px', textAlign: 'center'}}>
              <button className="btn-secondary" onClick={() => setIsFinished(false)}>
                ← Voltar e Ajustar Ideia
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
