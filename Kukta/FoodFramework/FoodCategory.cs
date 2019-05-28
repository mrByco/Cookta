using Kukta.SaveLoad.File;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.FoodFramework
{
    class FoodCategory : IStorageable, IMealingItem
    {
        internal string CategoryName;
        private List<Food> Foods;
        internal Guid guid = Guid.NewGuid();

        internal void AddFood(Food food)
        {
            Foods.Add(food);
            this.Save();
        }
        internal void RemoveFood(Food food)
        {
            Foods.Remove(food);
            this.Save();
        }
        internal List<Food> GetFoods()
        {
            return Foods;
        }
        internal void SetFoods(List<Food> foods)
        {
            Foods = foods;
            this.Save();
        }
        public void FromDataClass(object DataClass)
        {
            FoodCategoryData data = DataClass as FoodCategoryData;
            CategoryName = data.CategoryName;
            Foods = fromGuidList(data.FoodGuids);
            guid = Guid.Parse(data.guid);
        }
        private static List<Food> fromGuidList(List<string> stringGuids)
        {
            List<Food> foods = new List<Food>();
            foreach (string str in stringGuids)
            {
                try
                {
                    foods.Add(FoodDatabase.Instance.GetFood(Guid.Parse(str)));
                }
                catch
                {
                    //Show a Error message popupp!}
                }
            }
            return foods;
        }
        public void Save()
        {
            FoodDatabase.Instance.SaveCategory(this);
        }
        public void Save(string oldName)
        {
            FoodDatabase.Instance.SaveCategory(this, oldName);
        }

        public string GetFileName()
        {
            return CategoryName;
        }

        public object GetDataClass()
        {
            List<string> strGuids = new List<string>();
            foreach (Food food in Foods)
            {
                strGuids.Add(food.Guid.ToString());
            }
            return new FoodCategoryData()
            {
                CategoryName = this.CategoryName,
                FoodGuids = strGuids,
                guid = this.guid.ToString()
            };
        }


        public Type GetDataType()
        {
            return typeof(FoodCategoryData);
        }

        public Food GetMealFood(int seed)
        {
            Random random = new Random(seed);
            if (Foods.Count == 0)
                return null;
            else
                return Foods[random.Next(0, Foods.Count())];
        }
        public string GetName()
        {
            return CategoryName;
        }

        public Guid GetGuid()
        {
            return guid;
        }
    }
    class FoodCategoryData
    {
        public string CategoryName;
        public List<string> FoodGuids;
        public string guid;
    }
}
