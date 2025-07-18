
import React from 'react';
import OwnerResponsibilities from './ResponsibilityGuide/OwnerResponsibilities';
import TenantResponsibilities from './ResponsibilityGuide/TenantResponsibilities';
import SpecialCases from './ResponsibilityGuide/SpecialCases';
import LegalReference from './ResponsibilityGuide/LegalReference';

const ResponsibilityGuide = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OwnerResponsibilities />
        <TenantResponsibilities />
      </div>
      <SpecialCases />
      <LegalReference />
    </div>
  );
};

export default ResponsibilityGuide;
