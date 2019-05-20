using Kukta.FrameWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.Calendar
{
    class Calendar : ASingleton<Calendar>
    {
        private List<CalendarDay> Days = new List<CalendarDay>();

    }
}
