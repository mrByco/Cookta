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
            Food food = value as Food;
            switch (food.FoodPublicState)
            {
                case EFoodPublicState.PRIVATE:
                    return new BitmapImage(new Uri("ms-appx:///Assets/foodstate/Foodstatus_red.png"));
                case EFoodPublicState.PENDING:
                    return new BitmapImage(new Uri("ms-appx:///Assets/foodstate/Foodstatus_orange.png"));
                case EFoodPublicState.PUBLIC:
                    return new BitmapImage(new Uri("ms-appx:///Assets/foodstate/Foodstatus_green.png"));
            }
            return null;
        }

        public object ConvertBack(object value, Type targetType, object parameter, string language)
        {
            throw new NotImplementedException();
        }
    }
}