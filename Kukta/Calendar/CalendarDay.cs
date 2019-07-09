using Kukta.FrameWork;
using Kukta.Menu;
using Kukta.SaveLoad.File;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.Calendar
{
    public class CalendarDay
    {
        public string _id;
        public DateTime DateTime;
        public Mealing[] mealings = new Mealing[6];
        public CalendarDay(DateTime dateTime)
        {
            DateTime = dateTime.CutToDay();
        }
        public CalendarDay()
        {

        }
        public List<IMealingItem> GetItemsOf(EMealType type)
        {
            int index = (int)type;
            var mealing = mealings[index];
            return mealing.items;
        }
        public string GetDayString()
        {
            return DateTime.ToString("yyyy-MM-dd");
        }
    }
}
