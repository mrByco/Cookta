using Kukta.FrameWork;
using Kukta.SaveLoad.File;
using Kukta.SaveLoad.File.Tasks;
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

        public void SaveDay(CalendarDay day)
        {
            FileManager.AddTask(new SaveSerializable(App.CalendarRoot, day));
        }
        public void LoadAll()
        {
            FileManager.AddTask(new LoadAllSerializableFromFolder<CalendarDay, CalendarDayData>(App.CalendarRoot, days => 
            {
                foreach (CalendarDay day in days)
                {
                    OverwriteDayValues(day);
                }
            }));
        }
        private void OverwriteDayValues(CalendarDay day)
        {
            CalendarDay original = this.Days.Find((d) => d.Guid == day.Guid);
            if (original == null)
            {
                original = new CalendarDay();
                Days.Add(original);
            }
            original.FromDataClass(day.GetDataClass());
        }
    }
}
