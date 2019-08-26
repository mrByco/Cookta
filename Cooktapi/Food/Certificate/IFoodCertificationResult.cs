using System;
using System.Collections.Generic;
using System.Text;

namespace Cooktapi.Food.Certificate
{
    public interface IFoodCertificationResult
    {
        string GetResultText();
        bool? GetResult();
        bool TitleOk { get;}
        bool DescOk { get;}
        bool IngredientsOk { get; }
        bool TagsOk { get;}
        bool DoseOk { get; }
        bool ImageOk { get; }
        string Comment { get; }

    }
}
