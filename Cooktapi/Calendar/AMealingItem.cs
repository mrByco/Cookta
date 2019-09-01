using System;
using System.Collections.Generic;
using System.Text;
using Cooktapi.Food;

namespace Cooktapi.Calendar
{
    public abstract class AMealingItem : IMealingItem
    {
        private float m_Dose { get; set; }
        private bool m_IsFixed { get; set; }
        public virtual float Dose()
        {
            return m_Dose;
        }
        public void SetDose(float newDose)
        {
            m_Dose = newDose;
        }

        public bool IsFixed()
        {
            return m_IsFixed;
        }

        public abstract Food.Food GetMealFood();
        public abstract void NewSeed();
        public abstract string GetName();
        public abstract string GetId();

        public List<Ingredient> GetIngsForMealingDose()
        {
            return GetMealFood().GetIngredientsForDose(Dose());
        }


        public void SetIsFixed(bool isFixed)
        {
            m_IsFixed = isFixed;
        }
    }
}
