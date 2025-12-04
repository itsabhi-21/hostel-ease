'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, UtensilsCrossed, Coffee, Sun, Cookie, Moon } from 'lucide-react';
import { formatDateReadable } from '@/lib/validators';
import { cn } from '@/lib/utils';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const MEALS = ['BREAKFAST', 'LUNCH', 'SNACKS', 'DINNER'];

const mealConfig = {
  BREAKFAST: {
    icon: Coffee,
    color: 'from-orange-400 to-amber-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-200 dark:border-orange-800',
    textColor: 'text-orange-700 dark:text-orange-300',
    iconColor: 'text-orange-600 dark:text-orange-400'
  },
  LUNCH: {
    icon: Sun,
    color: 'from-yellow-400 to-orange-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    textColor: 'text-yellow-700 dark:text-yellow-300',
    iconColor: 'text-yellow-600 dark:text-yellow-400'
  },
  SNACKS: {
    icon: Cookie,
    color: 'from-pink-400 to-rose-500',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    borderColor: 'border-pink-200 dark:border-pink-800',
    textColor: 'text-pink-700 dark:text-pink-300',
    iconColor: 'text-pink-600 dark:text-pink-400'
  },
  DINNER: {
    icon: Moon,
    color: 'from-indigo-400 to-purple-500',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    textColor: 'text-indigo-700 dark:text-indigo-300',
    iconColor: 'text-indigo-600 dark:text-indigo-400'
  }
};

export function MessMenuDisplay({ weekStart, menu, onWeekChange }) {
  const getWeekEnd = (start) => {
    const date = new Date(start);
    date.setDate(date.getDate() + 6);
    return date;
  };

  const getMealForDay = (day, mealType) => {
    return menu?.find((m) => m.day === day && m.mealType === mealType);
  };

  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => onWeekChange(-7)}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous Week
        </Button>
        <div className="text-center">
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            {formatDateReadable(weekStart)} - {formatDateReadable(getWeekEnd(weekStart))}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => onWeekChange(7)}>
          Next Week
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Menu Grid */}
      {menu && menu.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {DAYS.map((day) => (
            <Card key={day}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{day}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {MEALS.map((meal) => {
                    const mealData = getMealForDay(day, meal);
                    const config = mealConfig[meal];
                    const MealIcon = config.icon;
                    
                    return (
                      <div 
                        key={meal} 
                        className={cn(
                          "p-4 border-2 rounded-xl transition-all hover:shadow-lg",
                          config.bgColor,
                          config.borderColor
                        )}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className={cn("p-2 rounded-lg bg-gradient-to-br", config.color)}>
                            <MealIcon className="h-5 w-5 text-white" />
                          </div>
                          <p className={cn("text-sm font-bold", config.textColor)}>
                            {meal}
                          </p>
                        </div>
                        {mealData && mealData.items ? (
                          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1.5">
                            {mealData.items.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className={cn("mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0", config.iconColor)} />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-gray-400 dark:text-gray-500 italic">Not available</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <UtensilsCrossed className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Menu Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              The menu for this week hasn't been published yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
