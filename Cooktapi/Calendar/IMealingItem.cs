using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cooktapi.Calendar
{
    public interface IMealingItem
    {
        Food.Food GetMealFood();
        void NewSeed();
        string GetName();
        string GetId();
        string ToString();
    }
}
