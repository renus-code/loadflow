import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'warning' | 'danger';
  confirmText?: string;
  cancelText?: string;
}

// Internal portal wrapper to escape stacking contexts
function ModalPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  if (!isOpen) return null;

  const isDanger = type === 'danger';
  const accentColor = isDanger ? '#ff4d4d' : '#f59e0b';
  const glowClass = isDanger ? 'shadow-glow-danger' : 'shadow-glow-warning';

  return (
    <ModalPortal>
    <div 
      className="modal show d-block" 
      style={{ 
        backgroundColor: 'transparent', 
        backdropFilter: 'blur(12px)',
        zIndex: 999999,
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={onClose}
    >
      <div 
        className="modal-dialog animate-scale-in" 
        style={{ maxWidth: '360px', marginTop: '10vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div 
          className="modal-content border-0 rounded-4 overflow-hidden shadow-2xl"
          style={{
            background: 'rgba(10, 20, 42, 0.98)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1) !important'
          }}
        >
          {/* Top accent glow */}
          <div 
            style={{ 
              height: '3px', 
              background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`, 
              width: '100%',
              opacity: 0.6
            }} 
          />

          <div className="modal-body p-4 text-center">
            {/* Animated Icon Container */}
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ 
                width: '60px', 
                height: '60px', 
                background: `radial-gradient(circle, rgba(${isDanger ? '255,77,77' : '245,158,11'}, 0.12) 0%, transparent 70%)`,
                border: `1.5px solid ${accentColor}22`,
                boxShadow: `0 0 15px ${accentColor}08`
              }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {isDanger ? (
                  <>
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </>
                ) : (
                  <>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </>
                )}
              </svg>
            </div>

            <h4 className="fw-black text-white mb-2" style={{ 
              fontFamily: 'var(--font-syne)', 
              letterSpacing: '-0.02em',
              fontSize: '1.4rem'
            }}>
              {title}
            </h4>
            
            <p className="text-white opacity-60 mb-4 small leading-relaxed">
              {message}
            </p>

            <div className="d-flex gap-2">
              <button 
                className="btn w-100 py-2.5 fw-bold text-white border-0"
                style={{ 
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  transition: 'background 0.2s',
                  backdropFilter: 'blur(4px)'
                }}
                onClick={onClose}
                onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              >
                {cancelText}
              </button>
              <button 
                className={`btn w-100 py-2.5 fw-bold text-white border-0 ${glowClass}`}
                style={{ 
                  background: isDanger ? 'linear-gradient(135deg, #ff4d4d, #c53030)' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .shadow-glow-warning {
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
        }
        .shadow-glow-danger {
          box-shadow: 0 8px 25px rgba(255, 77, 77, 0.4);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .modal-content {
          animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
    </ModalPortal>
  );
};

export default ConfirmationModal;
