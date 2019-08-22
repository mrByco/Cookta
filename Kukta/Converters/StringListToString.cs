using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Xaml.Data;

namespace Kukta.Converters
{
    public class StringListToString : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, string language)
        {
            List<string> list = value as List<string>;
            string str = "";
            string separator = (parameter as string) ?? ", ";
            list?.ForEach(element => { if (str.Length > 0) str = str + separator; str = str + element; });
            return str;
        }

        public object ConvertBack(object value, Type targetType, object parameter, string language)
        {
            string str = value as string;
            string separator = (parameter as string) ?? ", ";
            return str.Split(separator).ToList();
        }
    }
}