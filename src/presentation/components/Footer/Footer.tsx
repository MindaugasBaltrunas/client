import { FC } from 'react';
import { Link } from 'react-router-dom';
import { safeDisplay } from 'xss-safe-display';

interface FooterProps {
  companyName?: string;
  description?: string; 
  showLinks?: boolean;
  className?: string;
  socialLinks?: {
    platform: string;
    url: string;
    label: string;
  }[];
}

const Footer: FC<FooterProps> = ({ 
  companyName = "Mindaugas Baltrūnas", 
  description,
  showLinks = true,
  className = ""
}) => {
  const currentYear = new Date().getFullYear();
  
  const safeCompanyName = safeDisplay.text(companyName);
  const safeDescription = description ? 
    safeDisplay.html(description, ['p', 'strong', 'em', 'br']) : 
    { __html: "Building amazing experiences with modern web technologies. We create solutions that make a difference." };

  return (
    <footer className={`bg-gray-800 text-white border-gray-200 border-t  ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {showLinks && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="col-span-1 md:col-span-2">
              <h3 
                className="text-lg font-semibold mb-4"
                dangerouslySetInnerHTML={{ __html: safeCompanyName }}
              />
              <p 
                className="text-gray-300 text-sm leading-relaxed"
                dangerouslySetInnerHTML={safeDescription}
              />
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-300 hover:text-white text-sm transition-colors">Home</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white text-sm transition-colors">About</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white text-sm transition-colors">Services</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white text-sm transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-300 hover:text-white text-sm transition-colors">Help Center</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white text-sm transition-colors">Documentation</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white text-sm transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        )}

        <div className="border-t border-gray-700 pt-2">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © {currentYear} <span dangerouslySetInnerHTML={{ __html: safeCompanyName }} />. All rights reserved.
            </p>           

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;