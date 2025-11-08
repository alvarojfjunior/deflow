import { WalletFormData, WalletSafeDTO } from '@/types/wallet';
import { logger } from '@/lib/logger';
import { BlockchainNetwork, WalletBalance } from '@/types/blockchain';

/**
 * Service to interact with the wallets API
 */
export const WalletService = {
  /**
   * Get all wallets
   */
  async getWallets(): Promise<WalletSafeDTO[]> {
    try {
      const response = await fetch('/api/wallets', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wallets');
      }

      const data = await response.json();
      return data.wallets;
    } catch (error) {
      logger.error('Error getting wallets:', error);
      throw error;
    }
  },

  /**
   * Get a specific wallet
   */
  async getWallet(id: string): Promise<WalletSafeDTO> {
    try {
      const response = await fetch(`/api/wallets/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wallet');
      }

      const data = await response.json();
      return data.wallet;
    } catch (error) {
      logger.error('Error getting wallet:', error);
      throw error;
    }
  },

  /**
   * Create a new wallet
   */
  async createWallet(formData: WalletFormData): Promise<WalletSafeDTO> {
    try {
      const response = await fetch('/api/wallets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create wallet');
      }

      const data = await response.json();
      return data.wallet;
    } catch (error) {
      logger.error('Error creating wallet:', error);
      throw error;
    }
  },

  /**
   * Update a wallet
   */
  async updateWallet(id: string, formData: Partial<WalletFormData>): Promise<WalletSafeDTO> {
    try {
      const response = await fetch(`/api/wallets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update wallet');
      }

      const data = await response.json();
      return data.wallet;
    } catch (error) {
      logger.error('Error updating wallet:', error);
      throw error;
    }
  },

  /**
   * Delete a wallet
   */
  async deleteWallet(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/wallets/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to delete wallet');
      }
    } catch (error) {
      logger.error('Error deleting wallet:', error);
      throw error;
    }
  },

  /**
   * Get wallet balance from blockchain
   */
  async getWalletBalance(walletId: string, blockchain: BlockchainNetwork): Promise<WalletBalance> {
    try {
      const response = await fetch(`/api/wallets/${walletId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wallet balance');
      }

      const data = await response.json();
      return data.wallet.balance;
    } catch (error) {
      logger.error(`Error getting wallet balance for ${walletId}:`, error);
      throw error;
    }
  }
};