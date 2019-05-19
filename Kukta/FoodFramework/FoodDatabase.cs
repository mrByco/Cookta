using Kukta.FoodFramework.FileTask;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.FoodFramework
{
    class FoodDatabase : FrameWork.ASingleton<FoodDatabase>
    {
        private const string BaseFoodRoot = "Assets/Foods";
        private const string CustomFoodRoot = "CustomFoods";
        private const string CustomCategoryRoot = "CustomCategories";

        //Events
        internal event VoidDelegate OnFoodsChanged;
        internal event VoidDelegate OnCategoriesChanged;
        internal event VoidDelegate OnDatabaseChanged;

        public FoodDatabase() : base()
        {
            m_Categories = new List<FoodCategory>();
            m_CustomFoods = new List<Food>();
            LoadCustomFoodsAsync();
            LoadCategories();
        }

        //CATEGORIES
        private List<FoodCategory> m_Categories;
        public List<FoodCategory> Categories
        {
            get { return m_Categories; }
        }
        public void AddCategory(string name, List<Food> foods)
        {
            FoodCategory category = new FoodCategory() { CategoryName = name };
            category.SetFoods(foods);
            m_Categories.Add(category);
            if (OnCategoriesChanged != null)
                OnCategoriesChanged.Invoke();
            if (OnDatabaseChanged != null)
                OnDatabaseChanged.Invoke();
            category.Save();
        }

        public void SaveCategory(FoodCategory category)
        {
            FoodParser.AddTask(new SaveCategoryTask(CustomCategoryRoot, category));
        }
        public void SaveCategory(FoodCategory category, string OldCategoryName)
        {
            FoodParser.AddTask(new SaveCategoryTask(CustomCategoryRoot, category, OldCategoryName));
        }
        public void DeleteCategory(FoodCategory category)
        {
            m_Categories.Remove(category);
            FoodParser.AddTask(new DeleteFoodFileAsync(CustomCategoryRoot, category.CategoryName));
            if (OnCategoriesChanged != null)
                OnCategoriesChanged.Invoke();
            if (OnDatabaseChanged != null)
                OnDatabaseChanged.Invoke();
        }
        private void LoadCategories()
        {
            FoodParser.AddTask(new LoadCategories(CustomCategoryRoot, (categories) =>
            {
                m_Categories = categories;
                try
                {
                    if (OnCategoriesChanged != null)
                        OnCategoriesChanged.Invoke();
                    if (OnDatabaseChanged != null)
                        OnDatabaseChanged.Invoke();
                }
                catch { }
            }));
        }

        //FOODS
        private List<Food> m_DefaultFoods;
        private List<Food> GetBaseFoods()
        {
            if (m_DefaultFoods == null)
            {
                m_DefaultFoods = new List<Food>();
                FoodParser.AddTask(new GetBaseFoods((foods) =>
                {
                    m_DefaultFoods = foods;
                    try
                    {
                        if (OnFoodsChanged != null)
                            OnFoodsChanged.Invoke();
                        if (OnDatabaseChanged != null)
                            OnDatabaseChanged.Invoke();
                    }
                    catch { }
                }
                ));
            }

            return m_DefaultFoods;
        }

        private void LoadCustomFoodsAsync()
        {
            FoodParser.AddTask(new ReadCustomFoodsFromFileAsync(CustomFoodRoot, (foods) =>
            {
                m_CustomFoods = foods;
                if (OnFoodsChanged != null)
                    OnFoodsChanged.Invoke();
                if (OnDatabaseChanged != null)
                    OnDatabaseChanged.Invoke();
            }));
        }

        private List<Food> m_CustomFoods;

        internal void RemoveFood(Food food)
        {
            foreach (FoodCategory foodCategory in Categories)
            {
                if (foodCategory.GetFoods().Contains(food))
                {
                    foodCategory.RemoveFood(food);
                }
            }

            FoodParser.AddTask(new DeleteFoodFileAsync(CustomFoodRoot, food.Name));
            m_CustomFoods.Remove(food);
            if (OnFoodsChanged != null)
                OnFoodsChanged.Invoke();
        }

        internal List<Food> Foods
        {
            get
            {
                List<Food> allFoods = new List<Food>();
                m_CustomFoods.ForEach((food) => allFoods.Add(food));
                GetBaseFoods().ForEach((food) => allFoods.Add(food));
                return allFoods;
            }
        }

        internal void AddFood(string Name)
        {
            Food food = new Food() { Name = Name, CustomFood = true };
            m_CustomFoods.Add(food);
            if (OnFoodsChanged != null)
                OnFoodsChanged.Invoke();
            if (OnDatabaseChanged != null)
                OnDatabaseChanged.Invoke();
            SaveFood(food);
        }
        

        internal Food GetFood(Guid guid)
        {
            return Foods.Find((food) => food.Guid == guid);
        }
        internal List<Food> GetFoods(FoodCategory category)
        {
            return category.GetFoods();
        }

        public bool SaveFood(Food food)
        {
            if (FoodDatabase.Instance.Foods.Contains(food))
            {
                FoodParser.AddTask(new SaveFoodToFile(food, CustomFoodRoot));
                return true;
            }
            return false;
        }
        public bool SaveFood(Food food, string oldName)
        {
            if (FoodDatabase.Instance.Foods.Contains(food))
            {
                FoodParser.AddTask(new SaveFoodToFile(food, CustomFoodRoot, oldName));
                return true;
            }
            return false;
        }
        //Unused method
        private void SaveAll()
        {
            FoodParser.AddTask(new SaveFoodsToFile(m_CustomFoods, CustomFoodRoot));
        }
    }
}
