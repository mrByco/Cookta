using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CooktaServices.Contracts.V1;
using CooktaServices.Contracts.V1.Requests;
using CooktaServices.Contracts.V1.Responses;
using CooktaServices.Domain;
using CooktaServices.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CooktaServices.Controllers.V1
{
    [ApiController]
    public class FoodController : ControllerBase
    {

        private IFoodService m_FoodService;

        public FoodController(IFoodService foodService)
        {
            m_FoodService = foodService;
        }

        [HttpGet(ApiRoutes.Foods.Get)]
        public IActionResult Get([FromRoute]Guid foodId)
        {
            var food = m_FoodService.GetFoodById(foodId);

            if (food == null)
                return NotFound();

            return Ok(food);
        }


        [HttpPut(ApiRoutes.Foods.Update)]
        public IActionResult UpdateFood([FromRoute]Guid foodId, [FromBody] UpdateFoodRequest request)
        {
            var food = new Food()
            {
                Id = foodId,
                Name = request.Name
            };

            var updated = m_FoodService.UpdateFood(food);

            if (updated)
                return Ok(food);

            return NotFound();
        }
        [HttpGet(ApiRoutes.Foods.GetAll)]
        public IActionResult GetAll()
        {
            return Ok(m_FoodService.GetFoods());
        }

        [HttpPost(ApiRoutes.Foods.Create)]
        public IActionResult Create([FromBody] CreateFoodRequest foodRequest)
        {
            var food = new Food() {Id = foodRequest.Id};

            if (food.Id != Guid.Empty)
                food.Id = Guid.NewGuid();

            m_FoodService.GetFoods().Add(food);

            var baseUrl = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host.ToUriComponent()}";
            var locationUri = baseUrl + "/" + ApiRoutes.Foods.Get.Replace("{foodId}", food.Id.ToString());

            var response = new FoodResponse() {Id = food.Id};
            return Created(locationUri, response);
        }

    }
}