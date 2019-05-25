using Kukta.FoodFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.Menu
{
    public class TemplateDay
    {
        private List<Meal> Meals = new List<Meal>();
        private DayOfWeek m_DayOfWeek;
        private event VoidDelegate m_OnDayChanged;
        public DayOfWeek DayType
        {
            get { return m_DayOfWeek; }
        }

        public TemplateDay(DayOfWeek dayOfWeek, Action onChanged)
        {
            m_DayOfWeek = dayOfWeek;
            m_OnDayChanged += new VoidDelegate(onChanged);
        }
        public void AddItemToMeal(EMealType mealType, IMealingItem category)
        {
            Meal meal = Meals.Find(m => m.Type == mealType);
            if (meal == null)
            {
                meal = new Meal(mealType);
                Meals.Add(meal);
            }
            meal.Items.Add(category);
            m_OnDayChanged?.Invoke();
        }
        public void RemoveItemFromMeal(EMealType type, IMealingItem category)
        {
            Meal meal = Meals.Find(m => m.Type == type);
            if (meal != null)
            {
                meal.Items.Remove(category);
            }
            if (meal.Items.Count == 0)
            {
                Meals.Remove(meal);
            }
            m_OnDayChanged?.Invoke();
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
