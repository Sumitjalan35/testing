import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

const CareerAdviceDisplay = ({ advice, title = "Your Personalized Career Advice", subtitle = "Based on your profile, here are our AI-powered recommendations" }) => {
  if (!advice) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-secondary-800 mb-2">
          {title}
        </h2>
        <p className="text-lg text-secondary-600">
          {subtitle}
        </p>
      </div>
      
      <div className="career-advice-content">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold text-secondary-800 mb-4 mt-6 first:mt-0 border-b border-secondary-200 pb-2">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-bold text-secondary-800 mb-3 mt-5 flex items-center">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-semibold text-secondary-800 mb-2 mt-4 flex items-center">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-secondary-700 mb-3 leading-relaxed">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside mb-4 space-y-2">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside mb-4 space-y-2">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="text-secondary-700 leading-relaxed">
                {children}
              </li>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-secondary-800">
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em className="italic text-secondary-600">
                {children}
              </em>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-primary-500 pl-4 my-4 italic text-secondary-600 bg-primary-50 py-2 rounded-r">
                {children}
              </blockquote>
            ),
            code: ({ children }) => (
              <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">
                {children}
              </code>
            ),
            pre: ({ children }) => (
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4 border">
                {children}
              </pre>
            ),
          }}
        >
          {advice}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
};

export default CareerAdviceDisplay;
