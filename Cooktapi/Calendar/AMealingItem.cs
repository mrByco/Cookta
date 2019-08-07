using System;
using System.Collections.Generic;
using System.Text;

namespace Cooktapi.Calendar
{
    public abstract class AMealingItem
    {
        private float m_Dose { get; set; }
        private bool m_IsFixed { get; set; }
        public float Dose()
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


        public void SetIsFixed(bool isFixed)
        {
            m_IsFixed = isFixed;
        }
    }
}
