using Kukta.FoodFramework;
using Kukta.Menu;
using Kukta.SaveLoad.File;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.Menu
{
    internal class WeekTemplate : IStorageable
    {
        public event WeekTemplateDelegate OnTemplateChanged;
        internal TemplateDay[] Days;
        internal Guid guid = Guid.NewGuid();
        private string m_TemplateName;
        internal string TemplateName
        {
            get => m_TemplateName;
            set
            {
                string oldName = m_TemplateName;
                m_TemplateName = value;
                OnTemplateChanged?.Invoke(this);
                //TemplateManager.Instance.SaveTemplate(this, oldName);
            }
        }
        public WeekTemplate(string Name) : this()
        {
            if (Name == "")
            {
                TemplateName = guid.ToString();
            }
            else
            {
                TemplateName = Name;
            }
        }
        public WeekTemplate()
        {
            Days = new TemplateDay[7];
            for (int i = 0; i < Days.Length; i++)
            {
                Days[i] = new TemplateDay((DayOfWeek)i, () =>
                {
                    OnTemplateChanged?.Invoke(this);
                    Save();
                });
            }
        }

        internal TemplateDay GetDay(DateTime dateTime)
        {
            throw new NotImplementedException();
        }

        internal void Save()
        {
            TemplateManager.Instance.SaveTemplate(this);
        }

        public string GetFileName()
        {
            return TemplateName;
        }

        public Type GetDataType()
        {
            return this.GetType();
        }

        public object GetDataClass()
        {
            List<TemplateDayData> templateDays = new List<TemplateDayData>();

            for (int i = 0; i < this.Days.Length; i++)
            {
                List<TemplateMealData> dayMeals = new List<TemplateMealData>();
                foreach (Meal meal in this.Days[i].GetMeals())
                {
                    List<string> itemGuids = new List<string>();
                    meal.Items.ForEach((item) =>
                    {
                        itemGuids.Add(item.GetGuid().ToString());
                    });
                    dayMeals.Add(new TemplateMealData()
                    {
                        items = itemGuids,
                        mealType = meal.Type
                    });
                }
                templateDays.Add(new TemplateDayData()
                {
                    index = i,
                    meals = dayMeals
                });
            }
            WeekTemplateData data = new WeekTemplateData()
            {
                guid = this.guid.ToString(),
                name = this.TemplateName,
                days = templateDays
            };
            string text = JsonConvert.SerializeObject(data, Formatting.None);
            return data;
        }

        public void FromDataClass(object DataClass)
        {
            WeekTemplateData data = DataClass as WeekTemplateData;

            TemplateName = data.name;
            guid = Guid.Parse(data.guid);

            if (data.days != null)
            {
                foreach (TemplateDayData dayData in data.days)
                {
                    foreach (TemplateMealData mealData in dayData.meals)
                    {
                        if (mealData.items != null)
                        {
                            foreach (string s in mealData.items)
                            {
                                IMealingItem item = FoodDatabase.Instance.Get(Guid.Parse(s));
                                this.Days[dayData.index].AddItemToMeal(mealData.mealType, item);
                            }
                        }
                    }
                }
            }
        }
    }
    public class WeekTemplateData
    {
        public List<TemplateDayData> days = new List<TemplateDayData>();
        internal Dictionary<int, Dictionary<EMealType, List<string>>> ddays;
        public string name;
        public string guid;
    }
    [Serializable]
    public class TemplateDayData
    {
        public int index;
        public List<TemplateMealData> meals = new List<TemplateMealData>();
    }
    [Serializable]
    public class TemplateMealData
    {
        public EMealType mealType;
        public List<string> items = new List<string>();
    }
}
