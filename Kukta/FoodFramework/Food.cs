
using Kukta.SaveLoad.File;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.FoodFramework
{
    class Food : IStorageable, IMealingItem
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

        public string GetFileName()
        {
            return Name;
        }

        public object GetDataClass()
        {
            return new FoodData()
            {
                name = Name,
                guid = Guid.ToString(),
                desc = Desc,
                customfood = CustomFood
            };
        }

        public void FromDataClass(object dataClass)
        {
            FoodData data = dataClass as FoodData;
            Guid = Guid.Parse(data.guid);
            Name = data.name;
            CustomFood = data.customfood;
            Desc = data.desc;
        }

        public Type GetDataType()
        {
            return typeof(FoodData);
        }

        public Food GetMealFood(int seed)
        {
            return this;
        }

        public string GetName()
        {
            return Name;
        }

        public Guid GetGuid()
        {
            return Guid;
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
