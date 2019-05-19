using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.FoodFramework
{
    class FoodCategory
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
        public static FoodCategory FromData(FoodCategoryData data)
        {
            FoodCategory category = new FoodCategory()
            {
                CategoryName = data.CategoryName,
                Foods = fromGuidList(data.FoodGuids),
                guid = Guid.Parse(data.guid)
            };
            return category;
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
        public FoodCategoryData ToData()
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
    }
    class FoodCategoryData
    {
        public string CategoryName;
        public List<string> FoodGuids;
        public string guid;
    }
}
