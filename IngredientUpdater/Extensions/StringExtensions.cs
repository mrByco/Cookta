using System;
using System.ComponentModel;

namespace IngredientUpdater.Extensions
{
    public static class StringExtensions
    {
        public static T ParseParameter<T>(this string paramText)
        {
            try
            {
                var converter = TypeDescriptor.GetConverter(typeof(T));
                return (T)converter.ConvertFromString(paramText);
            }
            catch (NotSupportedException)
            {
                return default(T);
            }
        }
    }
}