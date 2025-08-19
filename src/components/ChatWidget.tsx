import React, { useState, useEffect } from 'react';

const ChatWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [widgetLoaded, setWidgetLoaded] = useState(false);

  useEffect(() => {
    // Check if ElevenLabs widget script is loaded
    const checkWidget = () => {
      const widget = document.querySelector('elevenlabs-convai') as any;
      if (widget && window.elevenlabsConvai) {
        setWidgetLoaded(true);
      } else {
        setTimeout(checkWidget, 100);
      }
    };
    checkWidget();

    // Listen for widget close events
    const handleWidgetClose = () => {
      setIsExpanded(false);
      const widget = document.querySelector('elevenlabs-convai') as any;
      if (widget) {
        widget.style.display = 'none';
      }
    };

    // Add event listeners for widget state changes
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if click is outside the widget and not on our button
      if (!target.closest('elevenlabs-convai') && !target.closest('.chat-widget-button')) {
        handleWidgetClose();
      }
    };

    // Set up mutation observer to watch for terms and conditions popup
    const widget = document.querySelector('elevenlabs-convai') as any;
    let observer: MutationObserver | null = null;
    
    if (widget && widget.shadowRoot) {
      observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            // Check if terms popup appeared
            const termsPopup = widget.shadowRoot.querySelector('[class*="terms"], [class*="modal"], [class*="dialog"]');
            if (termsPopup && isExpanded) {
              setTimeout(() => handleTermsAcceptance(), 100);
            }
          }
        });
      });
      
      observer.observe(widget.shadowRoot, {
        childList: true,
        subtree: true
      });
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [isExpanded]);

  const toggleWidget = () => {
    const widget = document.querySelector('elevenlabs-convai') as any;
    if (widget) {
      if (!isExpanded) {
        // Show and open the widget
        setIsExpanded(true);
        widget.style.display = 'block';
        
        // Wait for widget to be ready and handle terms acceptance
        setTimeout(() => {
          // Try to find and click the accept button for terms
          const acceptButton = widget.shadowRoot?.querySelector('button[class*="accept"], button:contains("Accept"), button:contains("Agree")');
          if (acceptButton) {
            acceptButton.click();
          }
          
          // Then try to open the chat
          setTimeout(() => {
            const widgetButton = widget.shadowRoot?.querySelector('button:not([class*="accept"]):not([class*="cancel"])');
            if (widgetButton) {
              widgetButton.click();
            }
          }, 200);
        }, 100);
      } else {
        // Hide the widget
        setIsExpanded(false);
        widget.style.display = 'none';
      }
    }
  };

  // Function to handle terms acceptance
  const handleTermsAcceptance = () => {
    const widget = document.querySelector('elevenlabs-convai') as any;
    if (widget && widget.shadowRoot) {
      // Look for accept button with various selectors
      const acceptSelectors = [
        'button[class*="accept"]',
        'button:contains("Accept")',
        'button:contains("Agree")',
        'button[class*="primary"]',
        'button[class*="confirm"]'
      ];
      
      for (const selector of acceptSelectors) {
        const button = widget.shadowRoot.querySelector(selector);
        if (button) {
          button.click();
          return true;
        }
      }
    }
    return false;
  };

    return (
    <div className="fixed bottom-20 right-4 z-[9999]">
      {/* Custom Chat Icon Button */}
      <button
        onClick={toggleWidget}
        className="chat-widget-button bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        aria-label="Chat with AI Assistant"
        title="Need help? Chat with our AI assistant"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

             {/* Loading indicator when widget is being opened */}
       {isExpanded && !widgetLoaded && (
         <div className="fixed bottom-32 right-4 bg-white rounded-lg shadow-lg p-4 z-[9999] border border-gray-200">
           <div className="flex items-center space-x-2">
             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
             <span className="text-sm text-gray-600">Initializing chat...</span>
           </div>
         </div>
       )}
    </div>
  );
};

export default ChatWidget;
