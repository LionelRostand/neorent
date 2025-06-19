
import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutStory: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            {t('publicSite.about.story.title')}
          </h2>
          <div className="prose prose-lg mx-auto text-gray-600">
            <p className="mb-6">
              {t('publicSite.about.story.paragraph1')}
            </p>
            <p className="mb-6">
              {t('publicSite.about.story.paragraph2')}
            </p>
            <p>
              {t('publicSite.about.story.paragraph3')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutStory;
