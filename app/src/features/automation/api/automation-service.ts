import { AutomationFormData, AutomationSafeDTO } from '@/types/automation';
import { logger } from '@/lib/logger';

export const AutomationService = {
  async getAutomations(): Promise<AutomationSafeDTO[]> {
    try {
      const response = await fetch('/api/automations', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch automations');
      }

      const data = await response.json();
      // Backend currently returns { bots } due to legacy naming; normalize.
      return (data.automations ?? data.bots) as AutomationSafeDTO[];
    } catch (error) {
      logger.error('Error getting automations:', error);
      throw error;
    }
  },

  async getAutomation(id: string): Promise<AutomationSafeDTO> {
    try {
      const response = await fetch(`/api/automations/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch automation');
      }

      const data = await response.json();
      return data.automation as AutomationSafeDTO;
    } catch (error) {
      logger.error('Error getting automation:', error);
      throw error;
    }
  },

  async createAutomation(formData: AutomationFormData): Promise<AutomationSafeDTO> {
    try {
      const response = await fetch('/api/automations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create automation');
      }

      const data = await response.json();
      return data.automation as AutomationSafeDTO;
    } catch (error) {
      logger.error('Error creating automation:', error);
      throw error;
    }
  },

  async updateAutomation(id: string, formData: Partial<AutomationFormData>): Promise<AutomationSafeDTO> {
    try {
      const response = await fetch(`/api/automations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update automation');
      }

      const data = await response.json();
      return data.automation as AutomationSafeDTO;
    } catch (error) {
      logger.error('Error updating automation:', error);
      throw error;
    }
  },

  async deleteAutomation(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/automations/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to delete automation');
      }
    } catch (error) {
      logger.error('Error deleting automation:', error);
      throw error;
    }
  }
};