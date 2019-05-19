using Kukta.FoodFramework.FileTask;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.FoodFramework
{
    class Food
    {
        internal event VoidDelegate OnFoodEdited;

        private string m_Name;
        public string Name
        {
            get { return m_Name; }
            set { string oldName = m_Name; m_Name = value; if (OnFoodEdited != null) OnFoodEdited.Invoke(); Save(oldName); }
        }

        private string m_Desc = "";
        public string Desc
        {
            get { return m_Desc; }
            set { m_Desc = value; if (OnFoodEdited != null) OnFoodEdited.Invoke(); Save(); }
        }

        public bool CustomFood;
        public Guid Guid;

        public Food()
        {
            Guid = Guid.NewGuid();
        }
        public Food(Guid guid)
        {
            this.Guid = guid;
        }
        public bool Save()
        {
            return FoodDatabase.Instance.SaveFood(this);
        }
        public bool Save(string oldName)
        {
            return FoodDatabase.Instance.SaveFood(this, oldName);
        }
        public FoodData ToFoodData()
        {
            return new FoodData()
            {
                name = Name,
                guid = Guid.ToString(),
                desc = Desc,
                customfood = CustomFood
            };
        }
        public static Food FromFoodData(FoodData data)
        {
            return new Food(Guid.Parse(data.guid))
            {
                Name = data.name,
                CustomFood = data.customfood,
                Desc = data.desc
            };
        }
    }
    class FoodData
    {
        public string name;
        public string guid;
        public string desc;
        public bool customfood;
    }
}
