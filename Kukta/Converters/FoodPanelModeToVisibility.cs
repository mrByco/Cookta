using Cooktapi.Food;
using Kukta.UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Data;

namespace Kukta.Converters
{
    public class FoodPanelModeToVisibility : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, string language)
        {
            EFoodPanelMode mode = (EFoodPanelMode)value;
            EFoodPanelMode ObjectType = (EFoodPanelMode) int.Parse(parameter.ToString());
            return mode == ObjectType ? Visibility.Visible : Visibility.Collapsed;
        }

        public object ConvertBack(object value, Type targetType, object parameter, string language)
        {
            throw new NotImplementedException();
        }
    }
}
