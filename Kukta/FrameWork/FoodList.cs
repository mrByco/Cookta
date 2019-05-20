using Kukta.FoodFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Xaml.Controls;

namespace Kukta.FrameWork
{
    class FoodList : StackPanel
    {
        internal List<Food> Foods;

        public FoodList(List<Food> foods) : base()
        {
            Foods = foods;
        }
    }
}
