using Kukta.FoodFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.Menu
{
    class Meal
    {
        internal EMealType Type;
        private List<Guid> ItemGuids = new List<Guid>();

        public Meal(EMealType type)
        {
            Type = type;
        }

        public void AddItem(IMealingItem item)
        {
            ItemGuids.Add(item.GetGuid());
        }
        public void RemoveItem(IMealingItem item)
        {
            ItemGuids.Remove(item.GetGuid());
        }
        public List<IMealingItem> GetItems()
        {
            List<IMealingItem> items = new List<IMealingItem>();
            foreach (Guid guid in ItemGuids)
            {
                IMealingItem item = FoodDatabase.Instance.Get(guid);
                if (item != null)
                {
                    items.Add(item);
                }
            }
            return items;
        }
    }
}
