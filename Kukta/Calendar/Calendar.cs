using Kukta.FrameWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.Calendar
{
    public class Calendar : ASingleton<Calendar>
    {
        private List<CalendarDay> Days = new List<CalendarDay>();
        internal CalendarDay GetDay(DateTime dateTime)
        {
            CalendarDay calendarDay = Days.Find(day => day.DateTime == dateTime);
            if (calendarDay == null)
            {
                calendarDay = new CalendarDay(dateTime.CutToDay());
                Days.Add(calendarDay);
            }
            return calendarDay;
        }
    }
}
