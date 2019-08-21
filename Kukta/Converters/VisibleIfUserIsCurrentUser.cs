using Cooktapi.Networking;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Data;

namespace Kukta.Converters
{
    public class VisibleIfUserIsCurrentUser : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, string language)
        {
            return (value as User != null && (value as User)?.Sub == OwnUser.CurrentUser?.Sub) ? Visibility.Visible : Visibility.Collapsed;
        }

        public object ConvertBack(object value, Type targetType, object parameter, string language)
        {
            throw new NotImplementedException();
        }
    }
}
