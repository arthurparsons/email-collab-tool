export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
}

export const templates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Product Launch',
    description: 'Announce new products with style',
    thumbnail: 'https://d64gsuwffb70l.cloudfront.net/68dc70a8d59600cc4055697b_1759277287951_d7395151.webp',
    category: 'Marketing',
  },
  {
    id: '2',
    name: 'Team Update',
    description: 'Internal team communications',
    thumbnail: 'https://d64gsuwffb70l.cloudfront.net/68dc70a8d59600cc4055697b_1759277289655_bcdab0da.webp',
    category: 'Internal',
  },
  {
    id: '3',
    name: 'Newsletter',
    description: 'Monthly newsletter template',
    thumbnail: 'https://d64gsuwffb70l.cloudfront.net/68dc70a8d59600cc4055697b_1759277291406_97064576.webp',
    category: 'Marketing',
  },
  {
    id: '4',
    name: 'Event Invitation',
    description: 'Invite to company events',
    thumbnail: 'https://d64gsuwffb70l.cloudfront.net/68dc70a8d59600cc4055697b_1759277293172_b925daf0.webp',
    category: 'Events',
  },
  {
    id: '5',
    name: 'Sales Outreach',
    description: 'Professional sales emails',
    thumbnail: 'https://d64gsuwffb70l.cloudfront.net/68dc70a8d59600cc4055697b_1759277295076_efa17edb.webp',
    category: 'Sales',
  },
  {
    id: '6',
    name: 'Follow-up',
    description: 'Follow-up email template',
    thumbnail: 'https://d64gsuwffb70l.cloudfront.net/68dc70a8d59600cc4055697b_1759277296758_738406fc.webp',
    category: 'Sales',
  },
];
