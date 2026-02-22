import React, { useState } from 'react';
import { Calendar, Clock, Video, X, Check } from 'lucide-react';

interface TimeSlot {
  time: string;
  available: boolean;
}

export const ScheduleCall: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const timeSlots: TimeSlot[] = [
    { time: '09:00 AM', available: true },
    { time: '10:00 AM', available: true },
    { time: '11:00 AM', available: false },
    { time: '02:00 PM', available: true },
    { time: '03:00 PM', available: true },
    { time: '04:00 PM', available: true },
  ];

  const nextWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date.toISOString().split('T')[0];
  });

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-40 right-6 z-40 bg-saviman-600 text-white p-4 rounded-full shadow-2xl hover:bg-saviman-700 transition-all transform hover:scale-110 flex items-center gap-2"
      >
        <Calendar size={24} />
        <span className="font-bold pr-2">Book a Call</span>
      </button>
    );
  }

  const handleSubmit = () => {
    // In production, this would create a calendar event
    setStep(3);
  };

  return (
    <div className="fixed bottom-40 right-6 z-50 w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in-up">
      <div className="bg-saviman-600 p-4 flex justify-between items-center">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Calendar size={20} /> Schedule a Call
        </h3>
        <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
          <X size={20} />
        </button>
      </div>

      <div className="p-6">
        {step === 1 && (
          <div className="animate-fade-in">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Select Date</h4>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {nextWeek.map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`p-2 rounded-lg text-center text-sm ${
                    selectedDate === date 
                    ? 'bg-brass-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                </button>
              ))}
            </div>
            <button 
              disabled={!selectedDate}
              onClick={() => setStep(2)}
              className="w-full btn-primary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Select Time (IST)</h4>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  disabled={!slot.available}
                  onClick={() => setSelectedTime(slot.time)}
                  className={`p-2 rounded-lg text-sm flex items-center justify-center gap-2 ${
                    selectedTime === slot.time
                    ? 'bg-brass-500 text-white'
                    : slot.available
                    ? 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>

            <div className="space-y-3 mb-4">
              <input 
                type="text" 
                placeholder="Your Name"
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <input 
                type="email" 
                placeholder="Email Address"
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <button 
              disabled={!selectedTime || !formData.name || !formData.email}
              onClick={handleSubmit}
              className="w-full btn-primary disabled:opacity-50 flex justify-center items-center gap-2"
            >
              <Video size={18} /> Confirm Booking
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-8 animate-fade-in">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-600" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Call Confirmed!</h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We've sent a calendar invite to {formData.email}.
            </p>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-brass-600 font-semibold hover:underline"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
