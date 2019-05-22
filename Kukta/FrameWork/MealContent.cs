using Kukta.FoodFramework;
using Kukta.Menu;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;

namespace Kukta.FrameWork
{
    class MealContent : StackPanel
    {
        public Meal Meal;

        public MealContent(Meal meal)
        {
            Meal = meal;
            RefreshMealContent();
        }

        private void RefreshMealContent()
        {
            if (Meal != null)
            {
                foreach (FoodCategory cat in Meal.Categories)
                {

                    base.Children.Add(new FoodCategorieButton(cat, null, (category) => { }));
                }
            }

            Button AddMealButton = new Button();
            AddMealButton.Content = "Kategória hozzáadása";
            AddMealButton.HorizontalAlignment = HorizontalAlignment.Stretch;
            AddMealButton.VerticalAlignment = VerticalAlignment.Top;
            AddMealButton.Click += OnAddButtonClick;
            base.Children.Add(AddMealButton);

        }

        private void OnAddButtonClick(object sender, RoutedEventArgs e)
        {
            throw new NotImplementedException();
        }
    }
}
