using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Cooktapi.Food;

namespace Cooktapi.Calendar
{
    public class IMealingPH : IMealingItem
    {
        public List<Ingredient> GetIngsForMealingDose()
        {
            throw new NotImplementedException();
        }

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