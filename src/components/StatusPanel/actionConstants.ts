import { ActionType } from '../../types/vehicle';

export interface ActionOption {
  type: ActionType;
  label: string;
  description: string;
  tag: string;
}

export interface QuickTemplate {
  label: string;
  text: string;
}

export const ACTION_OPTIONS: ActionOption[] = [
  {
    type: 'PRICE_DROP',
    label: 'Price Markdown',
    description: 'Reduce retail price to stimulate immediate digital leads.',
    tag: 'Pricing Action',
  },
  {
    type: 'SEND_TO_AUCTION',
    label: 'Send to Auction',
    description: 'De-list and book vehicle for regional dealer auction.',
    tag: 'Liquidation',
  },
  {
    type: 'WHOLESALE_TRANSFER',
    label: 'Wholesale Transfer',
    description: 'Transfer vehicle to partner dealer network or wholesale buyer.',
    tag: 'B2B Transfer',
  },
  {
    type: 'RECONDITIONING',
    label: 'Reconditioning / Detail',
    description: 'Send vehicle for paint correction, PDR, or cosmetic re-detail.',
    tag: 'Lot Prep',
  },
  {
    type: 'MARKETING_BOOST',
    label: 'Featured Campaign',
    description: 'Feature vehicle in targeted social ads and website hero spot.',
    tag: 'Traffic Push',
  },
  {
    type: 'STATUS_CHANGE',
    label: 'Update Lot Status',
    description: 'Update inventory operational status (e.g. Sale Pending).',
    tag: 'Operations',
  },
];

export const QUICK_TEMPLATES: Record<ActionType, QuickTemplate[]> = {
  PRICE_DROP: [
    { label: 'Markdown $1,000', text: 'Reduce retail price by $1,000 to stimulate immediate digital leads.' },
    { label: 'Floor Break-even', text: 'Markdown price to wholesale floor break-even ($500 reduction).' },
    { label: 'Weekend Special -$2,500', text: 'Aggressive $2,500 weekend special pricing adjustment.' },
  ],
  SEND_TO_AUCTION: [
    { label: 'Book Manheim Lane', text: 'Scheduled for Manheim regional wholesale auction lane on Thursday.' },
    { label: 'Set Auction Reserve', text: 'Reserve set at $1,500 below current retail asking price.' },
    { label: 'Digital Consignment', text: 'Consign to digital dealer auction platform (ACV / BacklotCars).' },
  ],
  WHOLESALE_TRANSFER: [
    { label: 'Transfer to Sister Lot', text: 'Initiate wholesale transfer to sister dealership with higher model demand.' },
    { label: 'B2B Network Sale', text: 'Direct B2B wholesale package sale to partner dealer group.' },
    { label: 'Dealer Syndicate', text: 'Offer to local independent dealer syndicate at ACV appraisal.' },
  ],
  RECONDITIONING: [
    { label: 'Full Paint & Detail', text: 'Send for comprehensive 2-step paint correction, PDR, and interior detail.' },
    { label: 'Mechanical Refresh', text: 'Perform mechanical multi-point inspection and brake/tire pad replacement.' },
    { label: 'Re-shoot 360 Photos', text: 'Re-shoot high-definition 360 photo studio set after exterior touch-up.' },
  ],
  MARKETING_BOOST: [
    { label: 'Social & Email Blast', text: 'Feature in weekly email newsletter and targeted Facebook/Instagram campaign.' },
    { label: 'Homepage Hero Spot', text: 'Pin as Deal of the Week on dealership website homepage and premium spot.' },
    { label: 'Google Ad Boost', text: 'Allocate $250 Google Search local inventory ad budget for 7 days.' },
  ],
  STATUS_CHANGE: [
    { label: 'Sale Pending', text: 'Mark status as Sale Pending — customer deposit and financing secured.' },
    { label: 'In Transit / Prep', text: 'Mark status as In Transit between prep center and front showroom lot.' },
    { label: 'VIP Test Drive Hold', text: 'Hold for scheduled customer VIP test drive this afternoon.' },
  ],
};
