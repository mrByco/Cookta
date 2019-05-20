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
        private Dictionary<EMealType, List<Meal>> Meals = new Dictionary<EMealType, List<Meal>>();
        private DayOfWeek m_DayOfWeek;
        public DayOfWeek DayType
        {
            get { return m_DayOfWeek; }
        }

        public TemplateDay(DayOfWeek dayOfWeek)
        {
            m_DayOfWeek = dayOfWeek;
            foreach (EMealType mealType in Enum.GetValues(typeof(EMealType)))
            {
                Meals.Add(mealType, new List<Meal>());
            }
        }
        internal List<Meal> GetMealsOf(EMealType eMealType)
        {
            return Meals[eMealType];
        }
        internal List<EMealType> GetMealTypes()
        {
            return new List<EMealType>(Meals.Keys);
        }



    }
}
