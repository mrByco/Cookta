using Kukta.FoodFrameworkV2;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;

namespace Kukta.FrameWork
{
    class FoodButtonV2 : Button
    {
        public string _id;
        private Food food;

        private Action<Food> OnClick;
        public FoodButtonV2(Food food, Action<Food> onClick) : base()
        {
            this.food = food;
            this._id = food._id;
            base.Content = food.name;
            base.HorizontalAlignment = Windows.UI.Xaml.HorizontalAlignment.Stretch;
            base.HorizontalContentAlignment = Windows.UI.Xaml.HorizontalAlignment.Left;
            OnClick = onClick;
            base.Click += ButtonClick;
            base.Margin = new Thickness(0, 3, 0, 3);
        }
        private void ButtonClick(object sender, RoutedEventArgs e)
        {
            OnClick.Invoke(food);
        }
    }
}
