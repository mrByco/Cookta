
using Kukta.SaveLoad.File;
using Kukta.SaveLoad.File.Tasks;
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
        //Events
        internal event VoidDelegate OnFoodsChanged;
        internal event VoidDelegate OnCategoriesChanged;
        internal event VoidDelegate OnDatabaseChanged;
        internal event VoidDelegate OnDatabaseLoaded;

        /*private bool m_FoodsLoaded;
        private bool FoodsLoaded
        { get => m_FoodsLoaded;
            set
            {
                m_FoodsLoaded = value;
                if (m_FoodsLoaded && m_CategoriesLoaded)
                    OnDatabaseLoaded?.Invoke();
            }
        }
        private bool m_CategoriesLoaded;
        private bool CategoriesLoaded
        {
            get => m_CategoriesLoaded;
            set
            {
                m_CategoriesLoaded = value;
                if (m_FoodsLoaded && m_CategoriesLoaded)
                    OnDatabaseLoaded?.Invoke();
            }
        }*/


        public FoodDatabase() : base()
        {
            m_Categories = new List<FoodCategory>();
            m_CustomFoods = new List<Food>();
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
            FileManager.AddTask(new SaveSerializable(App.CustomCategoryRoot, category));
        }
        public void SaveCategory(FoodCategory category, string OldCategoryName)
        {
            FileManager.AddTask(new SaveSerializable(App.CustomCategoryRoot, category, OldCategoryName));
        }
        public void DeleteCategory(FoodCategory category)
        {
            m_Categories.Remove(category);
            FileManager.AddTask(new DeleteSerializableFile(App.CustomCategoryRoot, category.CategoryName));
            if (OnCategoriesChanged != null)
                OnCategoriesChanged.Invoke();
            if (OnDatabaseChanged != null)
                OnDatabaseChanged.Invoke();
        }
        internal void LoadCategories()
        {
            FileManager.AddTask(new LoadAllSerializableFromFolder<FoodCategory, FoodCategoryData>(App.CustomCategoryRoot, (categories) =>
            {
                m_Categories = categories;
                if (OnCategoriesChanged != null)
                    OnCategoriesChanged.Invoke();
                if (OnDatabaseChanged != null)
                    OnDatabaseChanged.Invoke();
            }));
        }

        //FOODS
        private List<Food> m_DefaultFoods;

        internal void LoadBaseFoods()
        {
            m_DefaultFoods = new List<Food>();
            FileManager.AddTask(new LoadAllSerializableFromAssetsFolder<Food, FoodData>("Assets/Foods", foods =>
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

        internal void LoadCustomFoods()
        {
            FileManager.AddTask(new LoadAllSerializableFromFolder<Food, FoodData>(App.CustomFoodRoot, (foods) =>
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

            FileManager.AddTask(new DeleteSerializableFile(App.CustomFoodRoot, food.Name));
            m_CustomFoods.Remove(food);
            if (OnFoodsChanged != null)
                OnFoodsChanged.Invoke();
        }

        internal List<Food> Foods
        {
            get
            {
                List<Food> allFoods = new List<Food>();
                m_CustomFoods?.ForEach((food) => allFoods.Add(food));
                m_DefaultFoods?.ForEach((food) => allFoods.Add(food));
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
        internal IMealingItem Get(Guid guid)
        {
            foreach (Food food in Foods)
            {
                if (food.Guid == guid)
                    return food;
            }
            foreach (FoodCategory category in Categories)
            {
                if (category.guid == guid)
                    return category;
            }
            return null;
        }
        internal List<Food> GetFoods(FoodCategory category)
        {
            return category.GetFoods();
        }

        public bool SaveFood(Food food)
        {
            if (FoodDatabase.Instance.Foods.Contains(food))
            {
                FileManager.AddTask(new SaveSerializable(App.CustomFoodRoot, food));
                return true;
            }
            return false;
        }
        public bool SaveFood(Food food, string oldName)
        {
            if (FoodDatabase.Instance.Foods.Contains(food))
            {
                FileManager.AddTask(new SaveSerializable(App.CustomFoodRoot, food, oldName));
                return true;
            }
            return false;
        }
    }
}
