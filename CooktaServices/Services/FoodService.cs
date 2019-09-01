using System;
using System.Collections.Generic;
using System.Linq;
using CooktaServices.Domain;

namespace CooktaServices.Services
{
    public class FoodService : IFoodService
    {
        private readonly List<Food> m_Foods;

        public FoodService()
        {
            m_Foods = new List<Food>();

            for (var i = 0; i < 5; i++)
            {
                m_Foods.Add(new Food
                {
                    Id = Guid.NewGuid(),
                    Name = $"Food name {i}",
                });
            }
        }

        public List<Food> GetFoods()
        {
            return m_Foods;
        }

        public Food GetFoodById(Guid foodId)
        {
            return m_Foods.SingleOrDefault(x => x.Id == foodId);
        }

        public bool UpdateFood(Food foodToUpdate)
        {
            var exists = GetFoodById(foodToUpdate.Id) != null;

            if (!exists)
                return false;

            var index = m_Foods.FindIndex(x => x.Id == foodToUpdate.Id);

            m_Foods[index] = foodToUpdate;
            return true;
        }
    }
}