import React, { useState, useEffect } from 'react';
import './App.css';
import { Download, Copy, ChevronRight, ChevronLeft, CheckCircle, BrainCircuit, Sparkles, Terminal } from 'lucide-react';
import { generateSmartRequirements } from './SmartAI';

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

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = localStorage.getItem('imersao-briefing-data');
    return saved ? JSON.parse(saved) : {
      projectName: '',
      painPoints: '',
      features: '',
      targetAudience: '',
      constraints: '',
      experienceLevel: 'iniciante',
    };
  });
  const [isFinished, setIsFinished] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedPRD, setGeneratedPRD] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('imersao-briefing-data', JSON.stringify(formData));
  }, [formData]);

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
    setTimeout(() => {
      const prd = generateSmartRequirements(formData);
      setGeneratedPRD(prd);
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
            </div>

            <div className="output-split" style={{display: 'flex', flexDirection: 'column', gap: '30px'}}>
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

              <div style={{background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '16px', padding: '25px', color: '#1e293b'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                  <h3 style={{color: '#6366f1', margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <Sparkles size={20} /> BLUEPRINT ESTRATÉGICO (CLAUDE)
                  </h3>
                </div>

                <pre className="output-area" style={{height: '250px', fontSize: '0.8rem', background: 'white', color: '#334155', padding: '15px', overflowY: 'auto'}}>
                  <code>{generatedPRD.split('================================================================================')[0]}</code>
                </pre>
                
                <button 
                  className="btn-primary" 
                  style={{marginTop: '20px', width: '100%', background: '#1e293b', color: 'white'}}
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
