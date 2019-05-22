using Kukta.FoodFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.Menu
{
    class TemplateDay
    {
        private List<Meal> Meals = new List<Meal>();
        private DayOfWeek m_DayOfWeek;
        public DayOfWeek DayType
        {
            get { return m_DayOfWeek; }
        }

        public TemplateDay(DayOfWeek dayOfWeek)
        {
            m_DayOfWeek = dayOfWeek;
        }
        public void AddCategoryToMeal(EMealType mealType, FoodCategory category)
        {
            Meal meal = Meals.Find(m => m.Type == mealType);
            if (meal == null)
            {
                meal = new Meal(mealType);
                Meals.Add(meal);
            }
            meal.Categories.Add(category);
        }
        public void RemoveCategoryFromMeal(EMealType type, FoodCategory category)
        {
            Meal meal = Meals.Find(m => m.Type == type);
            if (meal != null)
            {
                meal.Categories.Remove(category);
            }
            if (meal.Categories.Count == 0)
            {
                Meals.Remove(meal);
            }
        }
        internal Meal GetMealOf(EMealType eMealType)
        {
            return Meals.Find((meal) => meal.Type == eMealType); ;
        }
        internal List<Meal> GetMeals()
        {
            return Meals;
        }

        internal List<EMealType> GetMealTypes()
        {
            List<EMealType> mealTypes = new List<EMealType>();
            Meals.ForEach(meal => mealTypes.Add(meal.Type));
            return mealTypes;
        }



    }
}
