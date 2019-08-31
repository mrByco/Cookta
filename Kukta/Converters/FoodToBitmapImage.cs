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
    public class FoodToBitmapImage : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, string language)
        {
            Food food = value as Food;
            bool cacheEnabled = Food.GetCacheingEnabled(food.Id, food.ImageUploaded);

            return new BitmapImage(food.GetImage)
            {
                CreateOptions = cacheEnabled ? BitmapCreateOptions.None : BitmapCreateOptions.IgnoreImageCache,
            };
        }

        public object ConvertBack(object value, Type targetType, object parameter, string language)
        {
            throw new NotImplementedException();
        }
    }
}
