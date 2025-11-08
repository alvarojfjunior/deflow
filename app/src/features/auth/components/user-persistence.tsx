'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

/**
 * Componente responsável por persistir o usuário autenticado no banco de dados.
 * Este componente não renderiza nada visualmente, apenas executa a lógica de persistência.
 */
export function UserPersistence() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    // Só executa quando o usuário estiver carregado e existir
    if (isLoaded && user) {
      const saveUserToDatabase = async () => {
        try {
          // Verifica se o usuário já existe e o cria se necessário
          const response = await fetch('/api/users/ensure', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              authId: user.id,
              email: user.primaryEmailAddress?.emailAddress
            })
          });

          if (!response.ok) {
            console.error('Erro ao persistir usuário no banco de dados');
          }
        } catch (error) {
          console.error('Erro ao persistir usuário:', error);
        }
      };

      saveUserToDatabase();
    }
  }, [isLoaded, user]);

  // Este componente não renderiza nada visualmente
  return null;
}