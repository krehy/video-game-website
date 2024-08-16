// components/IndexPage/Breadcrumbs.js
import React from 'react';

const Breadcrumbs = ({ breadcrumbList }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
  />
);

export default Breadcrumbs;
