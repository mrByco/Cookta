using Cooktapi.Food;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Media.Imaging;

namespace Kukta.Converters
{
    public class FoodToFoodStateImage : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, string language)
        {
            if (!(value is Food food)) return null;
            switch (food.FoodPublicState)
            {
                case EFoodPublicState.Private:
                    return new BitmapImage(new Uri("ms-appx:///Assets/foodstate/Foodstatus_red.png"));
                case EFoodPublicState.Pending:
                    return new BitmapImage(new Uri("ms-appx:///Assets/foodstate/Foodstatus_orange.png"));
                case EFoodPublicState.Public:
                    return new BitmapImage(new Uri("ms-appx:///Assets/foodstate/Foodstatus_green.png"));
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        public object ConvertBack(object value, Type targetType, object parameter, string language)
        {
            throw new NotImplementedException();
        }
    }
}