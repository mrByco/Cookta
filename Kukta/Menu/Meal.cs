using Kukta.FoodFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.Menu
{
    class Meal
    {
        internal EMealType Type;
        internal List<IMealingItem> Items = new List<IMealingItem>();
        public Meal(EMealType type)
        {
            Type = type;
        }
    }
}
