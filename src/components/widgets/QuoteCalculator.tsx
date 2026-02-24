import React, { useState } from 'react';
import { Calculator, X, Check, Send, ChevronRight } from 'lucide-react';

interface QuoteResult {
  estimatedCost: number;
  leadTime: string;
  moq: number;
}

export const QuoteCalculator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1000);
  const [material, setMaterial] = useState('brass');
  const [process, setProcess] = useState('cnc');
  const [result, setResult] = useState<QuoteResult | null>(null);

  const calculateQuote = () => {
    // Simplified calculation logic for demo
    let baseRate = material === 'brass' ? 0.5 : material === 'steel' ? 0.8 : 1.2;
    let processMultiplier = process === 'cnc' ? 1.5 : process === 'casting' ? 1.2 : 1.0;
    
    // Volume discount
    let discount = 1;
    if (quantity > 10000) discount = 0.7;
    else if (quantity > 5000) discount = 0.8;
    else if (quantity > 1000) discount = 0.9;

    const unitCost = baseRate * processMultiplier * discount;
    const total = unitCost * quantity;
    const leadTime = quantity > 5000 ? '4-6 weeks' : '2-3 weeks';

    setResult({
      estimatedCost: total,
      leadTime,
      moq: 100
    });
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 bg-brass-500 text-white p-4 rounded-full shadow-2xl hover:bg-brass-600 transition-all transform hover:scale-110 flex items-center gap-2"
      >
        <Calculator size={24} />
        <span className="font-bold pr-2">Instant Quote</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 right-6 z-50 w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in-up">
      <div className="bg-brass-500 p-4 flex justify-between items-center">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Calculator size={20} /> Instant Quote Calculator
        </h3>
        <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
          <X size={20} />
        </button>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Material</label>
          <select 
            id="material"
            name="material"
            value={material} 
            onChange={(e) => setMaterial(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="brass">Brass (Cw624)</option>
            <option value="steel">Stainless Steel (SS 304/316)</option>
            <option value="aluminum">Aluminum</option>
            <option value="custom">Custom Alloy</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Manufacturing Process</label>
          <select 
            id="process"
            name="process"
            value={process} 
            onChange={(e) => setProcess(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="cnc">CNC Machining</option>
            <option value="forging">Hot/Cold Forging</option>
            <option value="casting">Investment Casting</option>
            <option value="turning">Automatic Lathe</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
          <input 
            id="quantity"
            name="quantity"
            type="number" 
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        <button 
          onClick={calculateQuote}
          className="w-full btn-primary flex justify-center items-center gap-2"
        >
          Calculate <ChevronRight size={18} />
        </button>

        {result && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 animate-fade-in">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-200 font-bold mb-2">
              <Check size={18} /> Estimated Quote
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ${result.estimatedCost.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Lead Time: {result.leadTime}
            </div>
            <button className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium flex justify-center items-center gap-2">
              <Send size={16} /> Proceed to Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
