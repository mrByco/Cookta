﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cooktapi.Calendar
{
    public class Mealing
    {
        public List<IMealingItem> items = new List<IMealingItem>();
        public readonly CalendarDay day;
        public Mealing(CalendarDay day)
        {
            this.day = day;
        }
    }
}
