import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { accountService } from '../services/accountService';
import { Payment } from '../services/databaseService';
import jsPDF from 'jspdf';

interface PurchaseHistoryPageProps {
  onBack: () => void;
}

const PurchaseHistoryPage: React.FC<PurchaseHistoryPageProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadPurchaseHistory();
    }
  }, [user]);

  const loadPurchaseHistory = async () => {
    try {
      setLoading(true);
      const accountData = await accountService.getAccountData(user!.uid);
      setPayments(accountData.payments);
    } catch (err) {
      console.error('Error loading purchase history:', err);
      setError('Failed to load purchase history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const downloadInvoice = async (payment: Payment) => {
    try {
      // Create PDF document
      const doc = new jsPDF();
      
      // Add company header with better styling
      doc.setFillColor(59, 130, 246); // Blue background
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255); // White text
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.text('titliAI', 105, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Empowering Your Future with AI Solutions', 105, 30, { align: 'center' });
      
      // Reset text color for rest of content
      doc.setTextColor(0, 0, 0);
      
      // Add invoice details with better formatting
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(`INVOICE`, 20, 60);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Invoice Number: INV-${payment.id.slice(-8).toUpperCase()}`, 20, 75);
      doc.text(`Date: ${formatDate(payment.createdAt)}`, 20, 85);
      doc.text(`Status: ${payment.status.toUpperCase()}`, 20, 95);
      doc.text(`Payment Method: ${payment.paymentMethod}`, 20, 105);
      
      // Add a line separator
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 115, 190, 115);
      
      // Add item details with table-like structure
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Item Details:', 20, 130);
      
      // Create a simple table
      doc.setFillColor(248, 250, 252); // Light gray background
      doc.rect(20, 135, 170, 25, 'F');
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Description', 25, 145);
      doc.text('Workshop ID', 100, 145);
      doc.text('Amount', 160, 145);
      
      doc.setFont('helvetica', 'normal');
      doc.text('AI Workshop', 25, 155);
      doc.text(payment.workshopId, 100, 155);
      
      // Format currency properly - use "Rs." instead of ₹ symbol
      const currencyPrefix = payment.currency === 'INR' ? 'Rs.' : '$';
      const formattedAmount = `${currencyPrefix} ${payment.amount.toLocaleString('en-IN')}`;
      doc.text(formattedAmount, 160, 155);
      
      // Add total section with better styling
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 170, 190, 170);
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Total Amount:', 120, 185);
      doc.text(formattedAmount, 160, 185);
      
      // Add footer with better positioning
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text('Thank you for choosing titliAI!', 105, 250, { align: 'center' });
      doc.text('For any questions, please contact our support team.', 105, 260, { align: 'center' });
      
      // Save the PDF
      doc.save(`invoice-${payment.id}.pdf`);
      
      console.log('✅ Professional PDF invoice downloaded for payment:', payment.id);
    } catch (error) {
      console.error('❌ Error generating PDF invoice:', error);
      alert('Failed to generate invoice. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading purchase history...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Purchase History</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={loadPurchaseHistory}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-3 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Purchase <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">History</span>
                </h1>
                <p className="text-lg text-gray-600">View and download your payment invoices</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{payments.length}</div>
              <div className="text-sm text-gray-500">Total Purchases</div>
            </div>
          </div>
        </div>

        {/* Purchase List */}
        {payments.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
            <div className="text-gray-400 text-8xl mb-6">📦</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Purchases Yet</h3>
            <p className="text-gray-600 mb-8 text-lg">You haven't made any purchases yet. Enroll in a workshop to see your purchase history here.</p>
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Browse Workshops
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {payments.map((payment) => (
              <div key={payment.id} className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border border-gray-100 p-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <h3 className="text-xl font-bold text-gray-900">
                            Payment #{payment.id.slice(-8).toUpperCase()}
                          </h3>
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(payment.status)}`}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-6 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-700">Amount:</span>
                            <span className="text-lg font-bold text-green-600">{formatCurrency(payment.amount, payment.currency)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-700">Method:</span>
                            <span className="capitalize">{payment.paymentMethod}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-700">Date:</span>
                            <span>{formatDate(payment.createdAt)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-700">Workshop ID:</span>
                            <span className="font-mono bg-gray-100 px-2 py-1 rounded">{payment.workshopId}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-8">
                    <button
                      onClick={() => downloadInvoice(payment)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Download Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {payments.length > 0 && (
          <div className="mt-12 bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Purchase Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">{payments.length}</div>
                <div className="text-sm text-gray-600 font-medium">Total Purchases</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatCurrency(
                    payments.reduce((sum, p) => sum + p.amount, 0),
                    payments[0]?.currency || 'INR'
                  )}
                </div>
                <div className="text-sm text-gray-600 font-medium">Total Spent</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {payments.filter(p => p.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Completed Payments</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistoryPage; 