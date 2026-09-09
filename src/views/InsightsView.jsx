import React from 'react';
import { InsightCard } from '../components/insights/InsightCard';
import { ProjectContextNotice } from '../components/ui/PrivacyBadge';

export const InsightsView = () => {
  return (
    <div className="space-y-6">
      <InsightCard />
      <ProjectContextNotice />
    </div>
  );
};
