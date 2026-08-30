import { ActionType } from '../../types/vehicle';

/** Maps an ActionType enum value to a human-readable display name. */
export const formatActionName = (actionType: ActionType): string => {
  switch (actionType) {
    case 'PRICE_DROP':
      return 'Price markdown';
    case 'SEND_TO_AUCTION':
      return 'Auction liquidation';
    case 'WHOLESALE_TRANSFER':
      return 'Wholesale transfer';
    case 'RECONDITIONING':
      return 'Reconditioning';
    case 'MARKETING_BOOST':
      return 'Marketing push';
    case 'STATUS_CHANGE':
      return 'Status update';
    default:
      return 'Strategy updated';
  }
};
