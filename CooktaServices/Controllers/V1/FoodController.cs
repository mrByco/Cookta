using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CooktaServices.Contracts.V1;
using CooktaServices.Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CooktaServices.Controllers.V1
{
    [ApiController]
    public class FoodController : ControllerBase
    {
        private List<Food> _foods;

        public FoodController()
        {
            _foods = new List<Food>();

            for (var i = 0; i < 5; i++)
            {
                _foods.Add(new Food { Id = Guid.NewGuid().ToString() });
            }
        }

        [HttpGet(ApiRoutes.Foods.GetAll)]
        public IActionResult GetAll()
        {
            return Ok(_foods);
        }
    }
}