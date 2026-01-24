import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import React from 'react';
import clsx from 'clsx';

interface StarRatingProps {
    rating: number;
    onChange?: (rating: number) => void;
    editable?: boolean;
    maxStars?: number;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
    rating,
    onChange,
    editable = false,
    maxStars = 5,
    size = 'md',
    className
}) => {
    const stars = Array.from({ length: maxStars }, (_, i) => i + 1);

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    };

    const handleClick = (star: number) => {
        if (editable && onChange) {
            onChange(star);
        }
    };

    return (
        <div className={clsx("flex", className || "space-x-1")}>
            {stars.map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={!editable}
                    onClick={() => handleClick(star)}
                    className={clsx(
                        "focus:outline-none transition-colors duration-150",
                        editable ? "cursor-pointer hover:scale-110" : "cursor-default"
                    )}
                >
                    {star <= rating ? (
                        <StarIcon className={clsx(sizeClasses[size], "text-yellow-400")} />
                    ) : (
                        <StarIconOutline className={clsx(sizeClasses[size], "text-gray-300")} />
                    )}
                </button>
            ))}
        </div>
    );
};

export default StarRating;
