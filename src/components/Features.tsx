import React from 'react';

const features = [
  {
    icon: '👥',
    title: 'Real-Time Collaboration',
    description: 'See who\'s editing, where they\'re typing, and what changes they make - all in real-time.',
  },
  {
    icon: '💬',
    title: 'Inline Comments',
    description: 'Add comments, suggestions, and @mentions directly in the email for seamless feedback.',
  },
  {
    icon: '📝',
    title: 'Rich Text Editor',
    description: 'Full formatting toolbar with bold, italic, lists, links, and more for professional emails.',
  },
  {
    icon: '🕐',
    title: 'Version History',
    description: 'Track every change with automatic version history. Restore any previous version instantly.',
  },
  {
    icon: '📱',
    title: 'Works Everywhere',
    description: 'Seamless experience across web, iOS, and Android. Edit on any device, anytime.',
  },
  {
    icon: '🔒',
    title: 'Secure & Private',
    description: 'Enterprise-grade security with end-to-end encryption and granular permissions.',
  },
];

export default function Features() {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-lg text-gray-600">
            Powerful features for seamless email collaboration
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
