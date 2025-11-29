import React, { useState } from "react";
import {
  Search,
  MessageCircle,
  Book,
  Video,
  Mail,
  Phone,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  FileText,
  Users,
  Zap,
  Shield,
  Settings,
  ShoppingCart,
  BarChart3,
} from "lucide-react";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("getting-started");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const categories = [
    { id: "getting-started", label: "Getting Started", icon: Zap },
    { id: "orders", label: "Orders & Sales", icon: ShoppingCart },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "security", label: "Security", icon: Shield },
    { id: "account", label: "Account Management", icon: Users },
  ];

  const faqs = {
    "getting-started": [
      {
        question: "How do I set up my admin account?",
        answer:
          "To set up your admin account, navigate to Settings > Profile and fill in your personal information. Make sure to upload a profile picture and verify your email address.",
      },
      {
        question: "What are the system requirements?",
        answer:
          "Our platform works on all modern web browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version for the best experience.",
      },
      {
        question: "How do I navigate the dashboard?",
        answer:
          "The dashboard is organized into sections accessible from the sidebar. Click on Statistics for analytics, Orders for sales management, and Settings for configuration options.",
      },
    ],
    orders: [
      {
        question: "How do I create a new order?",
        answer:
          "Navigate to Sales > Orders and click the 'Add Order' button. Fill in the customer details, select products, and set the payment information to create a new order.",
      },
      {
        question: "How can I track order status?",
        answer:
          "Go to the Orders page where you can see all orders with their current status. You can update status by clicking on the dropdown in the Order Status column.",
      },
      {
        question: "What payment methods are supported?",
        answer:
          "We support various payment methods including credit cards, debit cards, UPI, net banking, and cash on delivery depending on your configuration.",
      },
    ],
    analytics: [
      {
        question: "How do I view sales reports?",
        answer:
          "Visit the Statistics page to view comprehensive sales analytics including order volume, revenue trends, and top-selling products with interactive charts.",
      },
      {
        question: "Can I export analytics data?",
        answer:
          "Yes, you can export analytics data in CSV or Excel format using the export button on the Orders page or Statistics dashboard.",
      },
    ],
    settings: [
      {
        question: "How do I change my password?",
        answer:
          "Go to Settings > Security and use the 'Change Password' section to update your password. Make sure to use a strong password for security.",
      },
      {
        question: "How do I configure notifications?",
        answer:
          "Navigate to Settings > Notifications to customize your notification preferences for orders, emails, SMS alerts, and marketing communications.",
      },
    ],
    security: [
      {
        question: "How do I enable two-factor authentication?",
        answer:
          "In Settings > Security, find the Two-Factor Authentication section and click 'Enable 2FA'. Follow the setup process using your preferred authenticator app.",
      },
      {
        question: "How do I manage login sessions?",
        answer:
          "Check Settings > Security > Login Sessions to view all active sessions. You can revoke access from any device you don't recognize.",
      },
    ],
    account: [
      {
        question: "How do I update my profile information?",
        answer:
          "Go to Settings > Profile to update your personal information, contact details, and profile picture. Remember to save changes after making updates.",
      },
      {
        question: "Can I change my email address?",
        answer:
          "Yes, you can update your email address in Settings > Profile. You'll need to verify the new email address before the change takes effect.",
      },
    ],
  };

  const quickActions = [
    {
      title: "Create New Order",
      description: "Add a new order to the system",
      icon: ShoppingCart,
      link: "/sales/orders",
    },
    {
      title: "View Analytics",
      description: "Check your sales performance",
      icon: BarChart3,
      link: "/statistics",
    },
    {
      title: "Manage Settings",
      description: "Configure your account",
      icon: Settings,
      link: "/settings",
    },
    {
      title: "Contact Support",
      description: "Get help from our team",
      icon: MessageCircle,
      link: "#contact",
    },
  ];

  const resources = [
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides",
      icon: Video,
      type: "external",
    },
    {
      title: "User Manual",
      description: "Comprehensive documentation",
      icon: Book,
      type: "external",
    },
    {
      title: "API Documentation",
      description: "For developers and integrations",
      icon: FileText,
      type: "external",
    },
    {
      title: "System Status",
      description: "Check platform availability",
      icon: Shield,
      type: "external",
    },
  ];

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const filteredFaqs =
    faqs[activeCategory]?.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="p-4 w-full">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              How can we help you?
            </h1>
            <p className="text-gray-600">
              Find answers to common questions and get support
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <action.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {action.title}
                  </h3>
                </div>
              </div>
              <p className="text-xs text-gray-500">{action.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Categories
              </h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeCategory === category.id
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <category.icon className="w-4 h-4" />
                    <span className="flex-1 text-left">{category.label}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Support
              </h3>
              <div className="space-y-3">
                <a
                  href="mailto:support@shopvii.com"
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600"
                >
                  <Mail className="w-4 h-4" />
                  support@shopvii.com
                </a>
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600"
                >
                  <Phone className="w-4 h-4" />
                  +91 98765 43210
                </a>
                <button className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600">
                  <MessageCircle className="w-4 h-4" />
                  Live Chat
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* FAQ Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>

              {filteredFaqs.length > 0 ? (
                <div className="space-y-3">
                  {filteredFaqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                      >
                        <span className="text-sm font-medium text-gray-900">
                          {faq.question}
                        </span>
                        {expandedFaq === index ? (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                      {expandedFaq === index && (
                        <div className="px-4 pb-4 border-t border-gray-100">
                          <p className="text-sm text-gray-600 pt-3">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No FAQs found matching your search.
                  </p>
                </div>
              )}
            </div>

            {/* Resources */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((resource, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                  >
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <resource.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {resource.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {resource.description}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                System Status
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">API Services</span>
                  <span className="inline-flex items-center gap-2 text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Database</span>
                  <span className="inline-flex items-center gap-2 text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Payment Gateway</span>
                  <span className="inline-flex items-center gap-2 text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Operational
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Last updated: Oct 22, 2025 at 5:20 PM IST
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
