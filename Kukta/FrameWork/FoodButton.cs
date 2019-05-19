using Kukta.FoodFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;

namespace Kukta.FrameWork
{
    class FoodButton : Button
    {
        public Guid FoodGuid;
        private Action<Food> OnClick;
        public FoodButton(Guid foodGuid, Action<Food> onClick) : base()
        {
            FoodGuid = foodGuid;
            Food food = FoodDatabase.Instance.GetFood(FoodGuid);
            base.Content = food.Name;
            base.HorizontalAlignment = Windows.UI.Xaml.HorizontalAlignment.Stretch;
            base.HorizontalContentAlignment = Windows.UI.Xaml.HorizontalAlignment.Left;
            OnClick = onClick;
            base.Click += ButtonClick;
            food.OnFoodEdited += new VoidDelegate(refreshFoodButton);
            base.Margin = new Thickness(0, 3, 0, 3);

        }
        private void ButtonClick(object sender, RoutedEventArgs e)
        {
            OnClick(FoodDatabase.Instance.GetFood(FoodGuid));
        }
        private void refreshFoodButton()
        {
            Food food = FoodDatabase.Instance.GetFood(FoodGuid);
            base.Content = food.Name;
        }
    }
}
