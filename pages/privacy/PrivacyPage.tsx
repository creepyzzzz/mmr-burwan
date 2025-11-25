import React from 'react';
import Card from '../../components/ui/Card';
import { ShieldCheck } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-24 pb-8">
      <div className="mb-8 text-center">
        <ShieldCheck size={48} className="text-gold-600 mx-auto mb-4" />
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-600">Last updated: January 2025</p>
      </div>

      <Card className="p-8">
        <div className="prose max-w-none space-y-6">
          <section>
            <h2 className="font-serif text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              MMR Burwan is committed to protecting your privacy. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you use our marriage registration portal.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Personal identification information (name, date of birth, ID number)</li>
              <li>Contact information (email, phone number, address)</li>
              <li>Marriage registration documents</li>
              <li>Account credentials</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Process and manage your marriage registration application</li>
              <li>Communicate with you about your application</li>
              <li>Provide customer support</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information
              against unauthorized access, alteration, disclosure, or destruction. All data is encrypted in transit
              and at rest.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@mmr.gov.in" className="text-gold-600 hover:text-gold-700">
                privacy@mmr.gov.in
              </a>
            </p>
          </section>
        </div>
      </Card>
    </div>
  );
};

export default PrivacyPage;

