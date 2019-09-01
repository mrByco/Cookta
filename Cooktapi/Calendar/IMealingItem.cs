using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Cooktapi.Food;

namespace Cooktapi.Calendar
{
    public interface IMealingItem
    {
        Food.Food GetMealFood();
        void NewSeed();
        string GetName();
        string GetId();
        string ToString();
        List<Ingredient> GetIngsForMealingDose();
        float Dose();
        void SetDose(float newDose);
        bool IsFixed();
        void SetIsFixed(bool isFixed);
    }
}
