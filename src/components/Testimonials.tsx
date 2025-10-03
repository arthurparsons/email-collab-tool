import React from 'react';
import { collaborators } from '../data/collaborators';

const testimonials = [
  {
    content: 'This tool has transformed how our marketing team collaborates on email campaigns. We save hours every week!',
    author: collaborators[0],
    role: 'Marketing Director',
  },
  {
    content: 'The real-time editing and version history features are game-changers. No more email chains with attachments!',
    author: collaborators[1],
    role: 'Product Manager',
  },
  {
    content: 'Finally, a collaborative email tool that actually works. The mobile app is just as good as the web version.',
    author: collaborators[2],
    role: 'Sales Lead',
  },
];

export default function Testimonials() {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Loved by Teams Worldwide
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-xl">
              <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
              <div className="flex items-center gap-3">
                <img src={testimonial.author.avatar} alt={testimonial.author.name} className="w-12 h-12 rounded-full" />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
