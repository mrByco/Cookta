using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Cooktapi.Calendar
{
    public class IMealingPH : IMealingItem
    {
        public float Dose()
        {
            throw new NotImplementedException();
        }

        public string GetId()
        {
            return null;
        }

        public Food.Food GetMealFood()
        {
            return null;
        }

        public string GetName()
        {
            return null;
        }

        public bool IsFixed()
        {
            throw new NotImplementedException();
        }

        public void NewSeed()
        {
            return;
        }

        public void SetDose(float newDose)
        {
            throw new NotImplementedException();
        }

        public void SetIsFixed(bool isFixed)
        {
            throw new NotImplementedException();
        }
    }
}