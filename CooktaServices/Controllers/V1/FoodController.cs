using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CooktaServices.Contracts.V1;
using CooktaServices.Contracts.V1.Requests;
using CooktaServices.Contracts.V1.Responses;
using CooktaServices.Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CooktaServices.Controllers.V1
{
    [ApiController]
    public class FoodController : ControllerBase
    {
        private List<Food> m_Foods;

        public FoodController()
        {
            m_Foods = new List<Food>();

            for (var i = 0; i < 5; i++)
            {
                m_Foods.Add(new Food { Id = Guid.NewGuid().ToString() });
            }
        }

        [HttpGet(ApiRoutes.Foods.GetAll)]
        public IActionResult GetAll()
        {
            return Ok(m_Foods);
        }

        [HttpPost(ApiRoutes.Foods.Create)]
        public IActionResult Create([FromBody] CreateFoodRequest foodRequest)
        {
            var food = new Food() {Id = foodRequest.Id};

            if (string.IsNullOrEmpty(food.Id))
                food.Id = Guid.NewGuid().ToString();
            m_Foods.Add(food);
            var baseUrl = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host.ToUriComponent()}";
            var locationUri = baseUrl + "/" + ApiRoutes.Foods.Get.Replace("{foodId}", food.Id);

            var response = new FoodResponse() {Id = food.Id};
            return Created(locationUri, food);
        }

    }
}