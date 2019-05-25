using Kukta.FoodFramework;
using Kukta.FrameWork;
using Kukta.Menu;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.Calendar
{
    class CalendarDay
    {
        internal Guid Guid = Guid.NewGuid();
        internal DateTime DateTime;

        internal event DayDelegate OnDayChanged;

        internal List<FixedMealing> fixedMealings = new List<FixedMealing>();

        // Generation details
        private Guid WeekTemplateGuid;
        private int Seed;
        private Random Random = new Random();

        public CalendarDay(DateTime dateTime)
        {
            DateTime = dateTime.CutToDay();
            Seed = Random.Next();
        }

        public void NextSeed()
        {
            Seed = Random.Next();
            OnDayChanged?.Invoke(this);
        }
        public void AttachToTemplate(WeekTemplate template)
        {
            WeekTemplateGuid = template.guid;
            OnDayChanged?.Invoke(this);
        }

        public List<Food> GetFoodsOf(EMealType type)
        {
            List<IMealingItem> mealingItems = GetMealsOf(type);

            //Generate Foods by the seed
            Random random = new Random(Seed);
            List<Food> foods = new List<Food>();

            foreach (IMealingItem item in mealingItems)
            {
                foods.Add(item.GetMealFood(random.Next(1, 9999)));
            }
            return foods;
        }

        private List<IMealingItem> GetMealsOf(EMealType type)
        {
            List<IMealingItem> items = new List<IMealingItem>();

            //Get fixed items
            fixedMealings.ForEach(fMeal =>
            {
                if (fMeal.type == type)
                {
                    fMeal.items.ForEach(item => { items.Add(item); });
                }
            });

            //Get generated items
            WeekTemplate week = TemplateManager.Instance.GetTemplate(WeekTemplateGuid);
            if (week != null)
            {
                TemplateDay tmpDay = week.GetDay(DateTime);
                tmpDay.GetMealOf(type).Items.ForEach(item =>
                {
                    items.Add(item);
                });
            }

            return items;
        }
    }
}
