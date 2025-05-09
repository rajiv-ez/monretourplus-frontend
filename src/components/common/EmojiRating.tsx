import React from 'react';
import { Frown, Meh, Smile, ThumbsUp, Heart } from 'lucide-react';

interface EmojiRatingProps {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}

const EmojiRating: React.FC<EmojiRatingProps> = ({ value, onChange, disabled = false }) => {
  const emojis = [
    { rating: 1, icon: <Frown />, label: 'Très insatisfait', color: 'text-red-500' },
    { rating: 2, icon: <Meh />, label: 'Insatisfait', color: 'text-orange-500' },
    { rating: 3, icon: <Smile />, label: 'Neutre', color: 'text-yellow-500' },
    { rating: 4, icon: <ThumbsUp />, label: 'Satisfait', color: 'text-green-500' },
    { rating: 5, icon: <Heart />, label: 'Très satisfait', color: 'text-pink-500' }
  ];

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex justify-center space-x-4 mb-2">
        {emojis.map((emoji) => (
          <button
            key={emoji.rating}
            type="button"
            onClick={() => !disabled && onChange(emoji.rating)}
            className={`
              p-3 rounded-full transition-all duration-300 
              ${value === emoji.rating ? `${emoji.color} bg-gray-100 scale-110` : 'text-gray-400 hover:text-gray-600'} 
              ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:bg-gray-50'}
            `}
            disabled={disabled}
            title={emoji.label}
          >
            <span className="sr-only">{emoji.label}</span>
            <div className="w-8 h-8">
              {emoji.icon}
            </div>
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-500">
        {value ? emojis.find(emoji => emoji.rating === value)?.label : 'Sélectionnez une note'}
      </p>
    </div>
  );
};

export default EmojiRating;