using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.Menu
{
    public enum EMealType
    {
        Breakfast,
        Elevenses,
        Lunch,
        Snack,
        Dinner,
        AfterDinner
    }
    public static class MealType
    {
        public static string TypeToString(EMealType type)
        {
            switch (type)
            {
                case EMealType.AfterDinner:
                    return "Uzsonna";
                case EMealType.Breakfast:
                    return "Reggeli";
                case EMealType.Dinner:
                    return "Vacsora";
                case EMealType.Elevenses:
                    return "Tízórai";
                case EMealType.Lunch:
                    return "Ebéd";
                case EMealType.Snack:
                    return "Nasi";
            }
            return "ismeretlen";
        }
    }

}
