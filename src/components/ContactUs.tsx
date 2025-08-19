import React from 'react';

const ContactUs: React.FC = () => {
  const contactInfo = [
    {
      icon: "📧",
      title: "Email",
      details: "info@titliai.com",
      description: "Send us an email for general inquiries"
    },
    {
      icon: "📱",
      title: "Phone",
      details: "+91 98765 43210",
      description: "Call us during business hours"
    },
    {
      icon: "📍",
      title: "Address",
      details: "Mumbai, Maharashtra, India",
      description: "Our headquarters location"
    },
    {
      icon: "⏰",
      title: "Business Hours",
      details: "Mon - Fri: 9:00 AM - 6:00 PM IST",
      description: "We're here to help during these hours"
    }
  ];

  const socialLinks = [
    {
      icon: "💼",
      name: "LinkedIn",
      url: "https://linkedin.com/company/titliai",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: "🐦",
      name: "Twitter",
      url: "https://twitter.com/titliai",
      color: "from-sky-400 to-sky-500"
    },
    {
      icon: "📘",
      name: "Facebook",
      url: "https://facebook.com/titliai",
      color: "from-blue-600 to-blue-700"
    },
    {
      icon: "📸",
      name: "Instagram",
      url: "https://instagram.com/titliai",
      color: "from-pink-500 to-purple-500"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-[#e3e7ef] via-[#d1e3f8] to-[#b6c6e3] min-h-screen text-gray-900 font-sans">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Get in <span className="text-blue-600">Touch</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-6 max-w-3xl mx-auto">
            Have questions about our AI workshops, consulting services, or want to collaborate? 
            We'd love to hear from you. Reach out to us through any of the channels below.
          </p>
        </div>
      </section>

      {/* Contact Information Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white/70 to-blue-100/60 border border-blue-100 border-t border-white/40 rounded-xl shadow-2xl hover:shadow-blue-300/40 hover:scale-105 transition-all backdrop-blur-2xl relative group p-6 text-center"
            >
              <div className="absolute inset-0 rounded-xl pointer-events-none group-hover:ring-4 group-hover:ring-blue-200/40 transition" />
              <div className="text-4xl mb-4">{info.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{info.title}</h3>
              <p className="text-blue-600 font-semibold mb-2">{info.details}</p>
              <p className="text-gray-700 text-sm">{info.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-white/70 to-blue-100/60 border border-blue-100 border-t border-white/40 rounded-2xl shadow-2xl backdrop-blur-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Send us a Message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  placeholder="Enter your last name"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                placeholder="Enter your email address"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                Subject
              </label>
              <select
                id="subject"
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
              >
                <option value="">Select a subject</option>
                <option value="workshop">Workshop Inquiry</option>
                <option value="consulting">Consulting Services</option>
                <option value="partnership">Partnership</option>
                <option value="support">Technical Support</option>
                <option value="general">General Inquiry</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows={6}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm resize-none"
                placeholder="Tell us how we can help you..."
              ></textarea>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-all hover:shadow-lg"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Connect With Us</h2>
        <p className="text-lg text-gray-700 text-center mb-12 max-w-2xl mx-auto">
          Follow us on social media to stay updated with the latest AI trends, workshop announcements, and industry insights.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-white/70 to-blue-100/60 border border-blue-100 border-t border-white/40 rounded-xl shadow-2xl hover:shadow-blue-300/40 hover:scale-105 transition-all backdrop-blur-2xl relative group p-6 text-center"
            >
              <div className="absolute inset-0 rounded-xl pointer-events-none group-hover:ring-4 group-hover:ring-blue-200/40 transition" />
              <div className="text-4xl mb-4">{social.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900">{social.name}</h3>
            </a>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-white/70 to-blue-100/60 border border-blue-100 border-t border-white/40 rounded-xl shadow-2xl backdrop-blur-2xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">What AI workshops do you offer?</h3>
            <p className="text-gray-700">We offer Foundation, Beginner, and Advanced AI workshops covering topics from basic AI concepts to advanced implementation strategies.</p>
          </div>
          <div className="bg-gradient-to-br from-white/70 to-blue-100/60 border border-blue-100 border-t border-white/40 rounded-xl shadow-2xl backdrop-blur-2xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Do you provide corporate training?</h3>
            <p className="text-gray-700">Yes, we offer customized AI training programs for corporate teams, tailored to your specific industry and business needs.</p>
          </div>
          <div className="bg-gradient-to-br from-white/70 to-blue-100/60 border border-blue-100 border-t border-white/40 rounded-xl shadow-2xl backdrop-blur-2xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">How can I enroll in a workshop?</h3>
            <p className="text-gray-700">You can enroll through our website by selecting your preferred workshop level from our course offerings.</p>
          </div>
          <div className="bg-gradient-to-br from-white/70 to-blue-100/60 border border-blue-100 border-t border-white/40 rounded-xl shadow-2xl backdrop-blur-2xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">What payment methods do you accept?</h3>
            <p className="text-gray-700">We accept all major credit cards, debit cards, and digital payment methods including UPI and net banking.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your AI Journey?</h2>
          <p className="text-xl mb-6">Join our workshops and transform your career with cutting-edge AI skills</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <a
              href="/titlihub"
              className="inline-block border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition"
            >
              Visit titliHub
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
