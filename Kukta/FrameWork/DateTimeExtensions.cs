using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.FrameWork
{
    public static class DateTimeExtensions
    {
        public static DateTime CutToDay(this DateTime dateTime)
        {
            dateTime = dateTime - dateTime.TimeOfDay;
            return dateTime;
        }
        public static DateTime StartOfWeek(this DateTime dt, DayOfWeek startOfWeek)
        {
            dt = dt.CutToDay();
            int diff = (7 + (dt.DayOfWeek - startOfWeek)) % 7;
            return dt.AddDays(-1 * diff).Date;
        }
        public static int DayIndexInWeek(this DateTime dt, DayOfWeek startOfWeek)
        {
            dt = dt.CutToDay();
            int i = dt.DayOfWeek - startOfWeek;
            if (i < 0)
                i = 7 - Math.Abs(i);
            return i;

        }
    }
}
