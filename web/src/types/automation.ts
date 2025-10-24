import { Types } from 'mongoose';
import { BlockchainNetwork } from '@/types/blockchain';

export type AutomationStatus = 'active' | 'paused' | 'error';

export type StrategyName = 'poolAutomation';

export interface PoolAutomationParams {
  blockchain: BlockchainNetwork.SOLANA;
  walletId: string; // Wallet ObjectId as string
}

export interface StrategyDTO {
  name: StrategyName;
  params: PoolAutomationParams; // Extend with other strategies in future
}

export interface AutomationDTO {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategy: StrategyDTO;
  name: string;
  description?: string;
  status: AutomationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface AutomationSafeDTO extends AutomationDTO {}

export interface AutomationFormData {
  name: string;
  description?: string;
  status?: AutomationStatus; // defaults to 'paused' in backend
  strategy: StrategyDTO;
}