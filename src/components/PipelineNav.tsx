import React from 'react';

const PIPELINE_STEPS = [
  { num: 1, label: 'Profiler', url: 'https://student-profiler-one.vercel.app' },
  { num: 2, label: 'Briefing', url: 'https://briefing-generator-delta.vercel.app' },
  { num: 3, label: 'Starter', url: 'https://starter-builder.vercel.app' },
  { num: 4, label: 'Optimizer', url: 'https://prompt-optimizer-ruddy-omega.vercel.app' },
  { num: 5, label: 'Compiler', url: 'https://aios-compiler.vercel.app' },
  { num: 6, label: 'Dashboard', url: 'https://ai-velocity-project.vercel.app' },
] as const;

const CURRENT_STEP = 2;

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    background: 'rgba(4, 4, 10, 0.95)',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    padding: '12px 16px',
    fontFamily: "'Inter', sans-serif",
  },
  inner: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  label: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: '#00F5FF',
    textTransform: 'uppercase' as const,
  },
  stepCount: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: '#8892A4',
  },
  progressTrack: {
    width: '100%',
    height: '4px',
    background: 'rgba(255, 255, 255, 0.06)',
    borderRadius: '2px',
    marginBottom: '10px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  stepsRow: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
    overflowX: 'auto',
    scrollbarWidth: 'none' as const,
  },
  stepChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    fontFamily: "'JetBrains Mono', monospace",
    whiteSpace: 'nowrap' as const,
    textDecoration: 'none',
    transition: '0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    border: '1px solid transparent',
  },
  stepNum: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.6rem',
    fontWeight: 800,
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
  },
  connector: {
    width: '12px',
    height: '1px',
    background: 'rgba(255, 255, 255, 0.1)',
    flexShrink: 0,
  },
  nextBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '10px',
    padding: '8px 16px',
    background: '#00F5FF',
    color: '#04040A',
    border: 'none',
    borderRadius: '6px',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 700,
    fontSize: '0.8rem',
    cursor: 'pointer',
    boxShadow: '0 0 20px rgba(0, 245, 255, 0.4)',
    transition: '0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    textDecoration: 'none',
    width: '100%',
    justifyContent: 'center',
  },
};

function getStepStyles(stepNum: number): { chip: React.CSSProperties; num: React.CSSProperties } {
  if (stepNum < CURRENT_STEP) {
    return {
      chip: {
        ...styles.stepChip,
        background: 'rgba(255, 184, 0, 0.08)',
        border: '1px solid rgba(255, 184, 0, 0.2)',
        color: '#FFB800',
      },
      num: {
        ...styles.stepNum,
        background: 'rgba(255, 184, 0, 0.2)',
        color: '#FFB800',
      },
    };
  }
  if (stepNum === CURRENT_STEP) {
    return {
      chip: {
        ...styles.stepChip,
        background: 'rgba(0, 245, 255, 0.08)',
        border: '1px solid rgba(0, 245, 255, 0.2)',
        color: '#00F5FF',
      },
      num: {
        ...styles.stepNum,
        background: 'rgba(0, 245, 255, 0.25)',
        color: '#00F5FF',
      },
    };
  }
  return {
    chip: {
      ...styles.stepChip,
      background: 'rgba(255, 255, 255, 0.025)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      color: '#4A5568',
    },
    num: {
      ...styles.stepNum,
      background: 'rgba(255, 255, 255, 0.05)',
      color: '#4A5568',
    },
  };
}

interface PipelineNavProps {
  email?: string;
}

function appendEmail(url: string, email?: string): string {
  if (!email) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}email=${encodeURIComponent(email)}`;
}

export default function PipelineNav({ email }: PipelineNavProps) {
  const progress = (CURRENT_STEP / PIPELINE_STEPS.length) * 100;
  const nextStep = PIPELINE_STEPS.find(s => s.num === CURRENT_STEP + 1);

  return (
    <div style={styles.wrapper}>
      <div style={styles.inner}>
        <div style={styles.topRow}>
          <span style={styles.label}>Pipeline Imersao IA</span>
          <span style={styles.stepCount}>Passo {CURRENT_STEP} de {PIPELINE_STEPS.length}</span>
        </div>

        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressFill,
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #00F5FF, #9D00FF)',
            }}
          />
        </div>

        <div style={styles.stepsRow}>
          {PIPELINE_STEPS.map((step, i) => {
            const s = getStepStyles(step.num);
            const isClickable = step.num !== CURRENT_STEP;
            const Tag = isClickable ? 'a' : 'span';
            const linkProps = isClickable
              ? { href: appendEmail(step.url, email), target: '_blank' as const, rel: 'noopener noreferrer' }
              : {};
            return (
              <React.Fragment key={step.num}>
                {i > 0 && <div style={styles.connector} />}
                <Tag style={s.chip} {...linkProps}>
                  <span style={s.num}>{step.num}</span>
                  {step.label}
                </Tag>
              </React.Fragment>
            );
          })}
        </div>

        {nextStep && (
          <a
            href={appendEmail(nextStep.url, email)}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.nextBtn}
          >
            Proximo Passo: {nextStep.label} →
          </a>
        )}
      </div>
    </div>
  );
}
