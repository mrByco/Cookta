using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Kukta.FoodFrameworkV2;

namespace Kukta.Calendar
{
    public class AMealingItem : IMealingItem
    {
        public Food GetMealFood()
        {
            return getMealFood;
        }
        public virtual Food getMealFood
        {
            get
            {
                throw new NotImplementedException();
            }
        }

        public string GetName()
        {
            return getName;
        }
        public virtual string getName
        {
            get
            {
                throw new NotImplementedException();
            }
        }

        public void NewSeed()
        {
            throw new NotImplementedException();
        }
    }
}
