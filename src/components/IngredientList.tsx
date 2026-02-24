'use client';

import { useState } from 'react';
import type { MeasurementUnit } from '@/lib/unit-conversion';
import { convertMeasure } from '@/lib/unit-conversion';
import type { Ingredient } from '@/lib/types';

interface Props {
    ingredients: Ingredient[];
}

export default function IngredientList({ ingredients }: Props) {
    const [unit, setUnit] = useState<MeasurementUnit>('imperial');

    return (
        <div>
            {/* Unit Toggle */}
            <div className="unit-toggle-container">
                <button
                    className={`unit-toggle-btn${unit === 'imperial' ? ' active' : ''}`}
                    onClick={() => setUnit('imperial')}
                >
                    oz
                </button>
                <button
                    className={`unit-toggle-btn${unit === 'metric' ? ' active' : ''}`}
                    onClick={() => setUnit('metric')}
                >
                    ml
                </button>
            </div>

            {/* Ingredients */}
            <ul className="ingredient-list">
                {ingredients.map((ing, i) => (
                    <li key={i} className="ingredient-item">
                        <span className="ingredient-name">{ing.name}</span>
                        <span className="ingredient-measure">
                            {ing.measure ? convertMeasure(ing.measure, unit) : '—'}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
