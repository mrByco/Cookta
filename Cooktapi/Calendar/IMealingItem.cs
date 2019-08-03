using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.Food
{
    public interface IMealingItem
    {
        Food GetMealFood();
        void NewSeed();
        string GetName();
        string GetId();
        string ToString();
    }
}
