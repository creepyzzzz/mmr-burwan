import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { HelpCircle, MessageSquare, Mail, Phone, ChevronDown } from 'lucide-react';

const HelpPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('help');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: t('faqs.startRegistration.question'),
      answer: t('faqs.startRegistration.answer'),
    },
    {
      question: t('faqs.documents.question'),
      answer: t('faqs.documents.answer'),
    },
    {
      question: t('faqs.processTime.question'),
      answer: t('faqs.processTime.answer'),
    },
    {
      question: t('faqs.reschedule.question'),
      answer: t('faqs.reschedule.answer'),
    },
  ];

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 pt-16 sm:pt-20 pb-6 sm:pb-8">
      <div className="mb-4 sm:mb-6 text-center">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Help Center</h1>
        <p className="text-xs sm:text-sm text-gray-600">Find answers to common questions</p>
      </div>

      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <Card key={index} className="overflow-hidden">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-3 sm:px-5 py-3 sm:py-4 text-left flex items-center justify-between gap-2 sm:gap-3 hover:bg-rose-50/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gold-200 focus:ring-offset-2 rounded-xl"
                aria-expanded={isOpen}
                aria-controls={`answer-${index}`}
              >
                <div className="flex items-start gap-2 sm:gap-3 flex-1">
                  <div className="flex-shrink-0">
                    <HelpCircle size={16} className="sm:w-5 sm:h-5 text-gold-600 mt-0.5" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base pr-2">
                    {faq.question}
                  </h3>
                </div>
                <ChevronDown
                  size={16}
                  className={`flex-shrink-0 text-gold-600 transition-transform duration-300 sm:w-5 sm:h-5 ${
                    isOpen ? 'transform rotate-180' : ''
                  }`}
                />
              </button>

              <div
                id={`answer-${index}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-3 sm:px-5 pb-3 sm:pb-4 pl-8 sm:pl-12">
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-4 sm:p-6 text-center">
        <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">Still need help?</h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Get in touch with our support team</p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
          <Button variant="primary" size="sm" onClick={() => navigate('/chat')}>
            <MessageSquare size={14} className="mr-1.5 sm:w-4 sm:h-4" />
            Start Chat
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => window.location.href = 'mailto:support@mmr.gov.in?subject=Support Request'}
          >
            <Mail size={14} className="mr-1.5 sm:w-4 sm:h-4" />
            Email Support
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => window.location.href = 'tel:18001234567'}
          >
            <Phone size={14} className="mr-1.5 sm:w-4 sm:h-4" />
            Call Us
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default HelpPage;

