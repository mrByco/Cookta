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
        public Action<Meal> OnAddItemClick;
        public Action<IMealingItem> OnItemRemoveClick;
        private bool m_AddButtonEnabled;

        public MealContent(Meal meal, Action<Meal> onAddItemClick, Action<IMealingItem> onItemRemoveClick, bool addButtonEnabled)
        {
            Meal = meal;
            m_AddButtonEnabled = addButtonEnabled;

            base.Margin = new Thickness(5, 5, 5, 10);

            OnAddItemClick = onAddItemClick;
            OnItemRemoveClick = onItemRemoveClick;
            RefreshMealContent();
        }

        private void RefreshMealContent()
        {
            if (Meal != null)
            {
                foreach (FoodCategory cat in Meal.Items)
                {

                    base.Children.Add(new FoodCategorieButton(cat, null, (category) => 
                    {
                        OnItemRemoveClick(category);
                    }, new Thickness()));
                }
            }
            if (m_AddButtonEnabled)
            {
                Button AddMealButton = new Button();
                AddMealButton.Content = "Kategória hozzáadása";
                AddMealButton.HorizontalAlignment = HorizontalAlignment.Stretch;
                AddMealButton.VerticalAlignment = VerticalAlignment.Top;
                AddMealButton.Click += OnAddButtonClick;
                base.Children.Add(AddMealButton);
            }
        }
        private void OnAddButtonClick(object sender, RoutedEventArgs e)
        {
            if (OnAddItemClick != null)
                OnAddItemClick(Meal);
        }
    }
}
