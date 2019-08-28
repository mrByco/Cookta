using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Media.Imaging;

namespace Kukta.Converters
{
    public class BoolToHasNotificationIcon : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, string language)
        {
            return (bool)value 
                ? new Uri("ms-appx:///Assets/Navigation/ProfilePageItem/man-notification.png")
                : new Uri("ms-appx:///Assets/Navigation/ProfilePageItem/man-ok.png");

        }

        public object ConvertBack(object value, Type targetType, object parameter, string language)
        {
            throw new NotImplementedException();
        }
    }
}
