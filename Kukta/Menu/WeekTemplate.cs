using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.Menu
{
    internal class WeekTemplate
    {
        internal TemplateDay[] Days;
        internal Guid guid = Guid.NewGuid();
        public WeekTemplate()
        {
            Days = new TemplateDay[7];
            for (int i = 0; i<Days.Length; i++)
            {
                Days[i] = new TemplateDay((DayOfWeek)i);
            }
        }

    }
}
