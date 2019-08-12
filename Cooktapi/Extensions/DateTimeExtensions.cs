using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cooktapi.Extensions
{
    public static class DateTimeExtensions
    {
        /// <summary>
        /// Gets the first milisec of  day from the original date,
        /// </summary>
        /// <param name="dateTime">The date to cut.</param>
        /// <returns>A Date time, thats the first moment of the day</returns>
        public static DateTime CutToDay(this DateTime dateTime)
        {
            dateTime = dateTime - dateTime.TimeOfDay;
            return dateTime;
        }
        /// <summary>
        /// Returns the start date of the current week
        /// </summary>
        /// <param name="dt">Original DateTime</param>
        /// <param name="startOfWeek">The start day of the week. Needs for the calculation</param>
        public static DateTime StartOfWeek(this DateTime dt, DayOfWeek startOfWeek)
        {
            dt = dt.CutToDay();
            int diff = (7 + (dt.DayOfWeek - startOfWeek)) % 7;
            return dt.AddDays(-1 * diff).Date;
        }
        /// <summary>
        /// Returns the day index of the week
        /// </summary>
        /// <param name="dt"></param>
        /// <param name="startOfWeek"></param>
        /// <returns></returns>
        public static int DayIndexInWeek(this DateTime dt, DayOfWeek startOfWeek)
        {
            dt = dt.CutToDay();
            int i = dt.DayOfWeek - startOfWeek;
            if (i < 0)
                i = 7 - Math.Abs(i);
            return i;

        }
        public static DateTime FromTotalMilis(Int64 milis)
        {
            TimeSpan timeSpan = TimeSpan.FromMilliseconds(milis);
            return (new DateTime(1970, 01, 01) + (DateTime.Now - DateTime.UtcNow) + timeSpan);
        }
    }
}
