import React, { useState } from 'react';
import { ModalForm, FormField, useToast } from '../admin/components';
import { LogisticsQuotesService, LogisticsPartnersService } from '../services/leads';
import { Truck, Check } from 'lucide-react';

interface LogisticsQuoteFormProps {
  productId?: string;
  productName?: string;
  productWeight?: number;
  onSuccess?: () => void;
}

const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'JP', label: 'Japan' },
  { value: 'AU', label: 'Australia' },
  { value: 'IN', label: 'India' },
  { value: 'CN', label: 'China' },
  { value: 'BR', label: 'Brazil' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'SG', label: 'Singapore' },
  { value: 'IT', label: 'Italy' },
  { value: 'ES', label: 'Spain' },
  { value: 'NL', label: 'Netherlands' },
];

export const LogisticsQuoteForm: React.FC<LogisticsQuoteFormProps> = ({
  productId,
  productName,
  productWeight = 1,
  onSuccess
}) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [estimating, setEstimating] = useState(false);
  const [estimate, setEstimate] = useState<{ cost: number; partner: string; currency: string } | null>(null);
  const [partners, setPartners] = useState<any[]>([]);
  const [selectedPartner, setSelectedPartner] = useState('DHL Express');

  React.useEffect(() => {
    LogisticsPartnersService.getInternational().then(setPartners);
  }, []);

  const handleEstimate = async (values: Record<string, any>) => {
    setEstimating(true);
    try {
      const result = await LogisticsQuotesService.calculateEstimate(
        values.weight || productWeight,
        values.country,
        productName
      );
      setEstimate(result);
      setSelectedPartner(result.partner);
    } catch (error: any) {
      toast.error(error.message || 'Failed to calculate estimate');
    } finally {
      setEstimating(false);
    }
  };

  const handleSubmit = async (values: Record<string, any>) => {
    setLoading(true);
    try {
      await LogisticsQuotesService.create({
        product_id: productId,
        product_name: productName,
        user_name: values.user_name,
        email: values.email,
        country: values.country,
        country_code: values.country,
        delivery_address: values.delivery_address,
        weight: values.weight || productWeight,
        dimensions: values.dimensions,
        estimated_cost: estimate?.cost || 0,
        currency: 'USD',
        logistic_partner: selectedPartner,
        status: 'pending'
      });
      
      toast.success('Quote request submitted successfully! We will contact you soon.');
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit quote request');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fields: FormField[] = [
    { name: 'user_name', label: 'Your Name', type: 'text', required: true, placeholder: 'Enter your full name' },
    { name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'Enter your email' },
    { name: 'country', label: 'Destination Country', type: 'select', required: true, options: COUNTRIES, placeholder: 'Select country' },
    { name: 'delivery_address', label: 'Delivery Address', type: 'textarea', required: true, rows: 3, placeholder: 'Enter complete delivery address' },
    { name: 'weight', label: 'Package Weight (kg)', type: 'number', required: true, min: 0.1, max: 1000, placeholder: 'Enter weight in kg' },
    { name: 'dimensions', label: 'Dimensions (Optional)', type: 'text', placeholder: 'L x W x H in cm' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <Truck className="text-white" size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Get Shipping Quote</h3>
          <p className="text-sm text-gray-500">International delivery via DHL/FedEx</p>
        </div>
      </div>

      <ModalForm
        isOpen={true}
        title="Request Shipping Quote"
        fields={fields}
        onSubmit={handleSubmit}
        onClose={() => {}}
        submitText="Get Quote & Submit"
        loading={loading}
        size="lg"
      />

      {estimate && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-2">
            <Check size={18} />
            <span className="font-semibold">Estimated Cost</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {estimate.currency} {estimate.cost.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Via {estimate.partner}
          </p>
        </div>
      )}
    </div>
  );
};

export default LogisticsQuoteForm;
