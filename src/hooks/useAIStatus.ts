import { useState, useEffect } from 'react';

export const useAIStatus = () => {
  const [isAIAvailable, setIsAIAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAIStatus = () => {
      try {
        // Verificar se a API key está configurada
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.REACT_APP_OPENAI_API_KEY;
        
        if (apiKey && apiKey !== 'your_openai_api_key_here' && apiKey.startsWith('sk-')) {
          setIsAIAvailable(true);
          console.log('✅ AI Status: OpenAI API key detected');
        } else {
          setIsAIAvailable(false);
          console.log('⚠️ AI Status: OpenAI API key not configured');
        }
      } catch (error) {
        console.error('❌ AI Status: Error checking AI availability:', error);
        setIsAIAvailable(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAIStatus();
  }, []);

  return {
    isAIAvailable,
    isChecking,
    checkStatus: () => {
      setIsChecking(true);
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.REACT_APP_OPENAI_API_KEY;
      setIsAIAvailable(apiKey && apiKey !== 'your_openai_api_key_here' && apiKey.startsWith('sk-'));
      setIsChecking(false);
    }
  };
}; 