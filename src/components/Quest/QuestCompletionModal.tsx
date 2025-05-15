import React from 'react';
import Modal from '../Modal';
import styles from './RecordFormModal.module.css';

interface QuestCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  questTitle: string;
  pointsEarned: number;
  questType: 'harvest' | 'storage' | 'transport';
  cropType?: string;
  riskLevel?: string;
  mainFactor?: string;
  recommendation?: string;
}

const QuestCompletionModal: React.FC<QuestCompletionModalProps> = ({
  isOpen,
  onClose,
  questTitle,
  pointsEarned,
  questType,
  cropType,
  riskLevel,
  mainFactor,
  recommendation
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Today's Daily quest"
      size="medium"
    >
      <div className={styles.formContainer}>
        <div className={styles.completionContainer}>
          <div className={styles.checkmarkIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8BC34A" width="64" height="64">
              <path d="M0 0h24v24H0z" fill="none"/>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          
          <h2 className={styles.completionTitle}>{questTitle} Quest Completed</h2>
          <p className={styles.completionMessage}>Great job!</p>
          
          <div className={styles.pointsContainer}>
            <div className={styles.pointsIcon}>🏆</div>
            <div className={styles.pointsInfo}>
              <span>Point Earned:</span>
              <span className={styles.pointsValue}>{pointsEarned}+</span>
            </div>
          </div>
          
          {questType === 'harvest' && cropType && (
            <div className={styles.detailsCard}>
              <div className={styles.detailsIcon}>🌱</div>
              <div className={styles.detailsContent}>
                <h3>{cropType}</h3>
                {riskLevel && <p>Risk Level: {riskLevel}</p>}
                {mainFactor && <p>Main Factor: {mainFactor}</p>}
                {recommendation && (
                  <div className={styles.recommendation}>
                    <p>Recommendation</p>
                    <p>{recommendation}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <button 
            onClick={onClose} 
            className={styles.closeCompletionButton}
          >
            Continue
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default QuestCompletionModal; 