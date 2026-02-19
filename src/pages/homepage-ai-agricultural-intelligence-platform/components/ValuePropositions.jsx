import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import { useTranslation } from '../../../context/LanguageContext';

const ValuePropositions = () => {
  const { t } = useTranslation();
  
  const propositions = [
    {
      icon: "Brain",
      title: t('home.value.prop1Title'),
      description: t('home.value.prop1Desc'),
      features: [t('home.value.prop1Feature1'), t('home.value.prop1Feature2'), t('home.value.prop1Feature3')],
      link: "/ai-ranking-engine-methodology-showcase",
      gradient: "from-blue-500 to-purple-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      icon: "BarChart3",
      title: t('home.value.prop2Title'),
      description: t('home.value.prop2Desc'),
      features: [t('home.value.prop2Feature1'), t('home.value.prop2Feature2'), t('home.value.prop2Feature3')],
      link: "/crop-championship-center-interactive-rankings",
      gradient: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      icon: "Trophy",
      title: t('home.value.prop3Title'),
      description: t('home.value.prop3Desc'),
      features: [t('home.value.prop3Feature1'), t('home.value.prop3Feature2'), t('home.value.prop3Feature3')],
      link: "/farmer-success-league-community-leaderboards",
      gradient: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Icon name="Sparkles" size={16} />
            <span>{t('home.value.badge')}</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t('home.value.heading1')}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              {t('home.value.heading2')}
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('home.value.subtitle2')}
          </p>
        </div>

        {/* Value Proposition Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {propositions?.map((prop, index) => (
            <div 
              key={index}
              className={`${prop?.bgColor} ${prop?.borderColor} border rounded-2xl p-8 hover-lift transition-all duration-300 group relative overflow-hidden`}
            >
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <div className={`w-full h-full bg-gradient-to-br ${prop?.gradient} rounded-full blur-2xl`}></div>
              </div>

              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${prop?.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <Icon name={prop?.icon} size={32} className="text-white" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
                  {prop?.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {prop?.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {prop?.features?.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Link */}
                <Link 
                  to={prop?.link}
                  className="inline-flex items-center space-x-2 text-primary font-semibold hover:text-primary/80 transition-colors duration-200 group/link"
                >
                  <span>{t('home.value.learnMore')}</span>
                  <Icon 
                    name="ArrowRight" 
                    size={16} 
                    className="group-hover/link:translate-x-1 transition-transform duration-200" 
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">{t('home.value.ctaHeading')}</h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              {t('home.value.ctaSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2">
                <Icon name="Zap" size={20} />
                <span>{t('home.value.startFreeAssessment')}</span>
              </button>
              <Link to="/ai-ranking-engine-methodology-showcase">
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors duration-200 flex items-center justify-center space-x-2 w-full sm:w-auto">
                  <Icon name="Play" size={20} />
                  <span>{t('home.value.watchDemo')}</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuePropositions;
