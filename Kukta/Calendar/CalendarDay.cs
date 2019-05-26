using Kukta.FoodFramework;
using Kukta.FrameWork;
using Kukta.Menu;
using Kukta.SaveLoad.File;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.Calendar
{
    public class CalendarDay : IStorageable
    {
        public Guid Guid = Guid.NewGuid();
        public DateTime DateTime;

        public event DayDelegate OnDayChanged;

        public List<FixedMealing> fixedMealings = new List<FixedMealing>();

        // Generation details
        private Guid WeekTemplateGuid;
        private int Seed;
        private Random Random = new Random();

        public CalendarDay(DateTime dateTime)
        {
            DateTime = dateTime.CutToDay();
            Seed = Random.Next();
        }
        public CalendarDay()
        {
            Seed = Random.Next();
        }

        public void NextSeed()
        {
            Seed = Random.Next();
            OnDayChanged?.Invoke(this);
            Calendar.Instance.SaveDay(this);
        }
        public void AttachToTemplate(WeekTemplate template)
        {
            WeekTemplateGuid = template.guid;
            OnDayChanged?.Invoke(this);
            Calendar.Instance.SaveDay(this);
        }

        public List<Food> GetFoodsOf(EMealType type)
        {
            List<IMealingItem> mealingItems = GetMealsOf(type);

            //Generate Foods by the seed
            Random random = new Random(Seed);
            List<Food> foods = new List<Food>();

            foreach (IMealingItem item in mealingItems)
            {
                Food f = item.GetMealFood(random.Next(1, 9999));
                if (f != null)
                    foods.Add(f);
            }
            return foods;
        }

        public Guid GetTemplateGuid()
        {
            return WeekTemplateGuid;
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
                tmpDay.GetMealOf(type)?.GetItems()?.ForEach(item =>
                {
                    if (item != null)
                        items.Add(item);
                });
            }

            return items;
        }

        public string GetFileName()
        {
            return DateTime.ToString("yyyy-MM-dd");
        }

        public Type GetDataType()
        {
            return typeof(CalendarDayData);
        }

        public object GetDataClass()
        {
            CalendarDayData data = new CalendarDayData()
            {
                date = this.DateTime,
                attachedTemplateGuid = this.WeekTemplateGuid,
                guid = this.Guid,
                seed = this.Seed,
                fixedMealings = new List<FixedMealingData>()
            };
            foreach (FixedMealing mealing in this.fixedMealings)
            {
                List<Guid> sItems = new List<Guid>();
                foreach (IMealingItem item in mealing.items)
                {
                    item.GetGuid();
                }
                data.fixedMealings.Add(new FixedMealingData() { type = mealing.type, guids = sItems });
            }
            return data;
        }

        public void FromDataClass(object DataClass)
        {
            CalendarDayData data = DataClass as CalendarDayData;

            this.Guid = data.guid;
            this.WeekTemplateGuid = data.attachedTemplateGuid;
            this.DateTime = data.date;
            this.Seed = data.seed;
            this.fixedMealings = new List<FixedMealing>();
            foreach (FixedMealingData fMealData in data.fixedMealings)
            {
                List<IMealingItem> items = new List<IMealingItem>();
                foreach (Guid guid in fMealData.guids)
                {
                    IMealingItem mealingItem = FoodDatabase.Instance.Get(guid);
                    if (mealingItem != null)
                        items.Add(mealingItem);
                }
                this.fixedMealings.Add(new FixedMealing() { type = fMealData.type, items = items });
            }
            this.OnDayChanged?.Invoke(this);
        }
    }
    public class CalendarDayData
    {
        public DateTime date;
        public Guid attachedTemplateGuid;
        public Guid guid;
        public List<FixedMealingData> fixedMealings;
        public int seed;
    }
    [Serializable]
    public class FixedMealingData
    {
        public List<Guid> guids;
        public EMealType type;
    }
}
