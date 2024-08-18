// src/components/BlogPage/Breadcrumbs.tsx

import React from 'react';
import { BreadcrumbsProps } from '../../types';

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumbList }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
  />
);

export default Breadcrumbs;
