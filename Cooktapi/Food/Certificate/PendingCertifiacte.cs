using System;
using System.Collections.Generic;
using System.Text;

namespace Cooktapi.Food.Certificate
{
    public class PendingCertifiacte : IFoodCertificationResult
    {
        public bool TitleOk => false;
        public bool DescOk => false;
        public bool IngredientsOk => false;
        public bool TagsOk => false;
        public bool DoseOk => false;
        public bool ImageOk => false;
        public string Comment => "";

        public bool? GetResult()
        {
            return null;
        }

        public string GetResultText()
        {
            return "Hitelesítés alatt";
        }
    }
}
