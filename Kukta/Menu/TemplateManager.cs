using Kukta.FoodFramework;
using Kukta.FrameWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.Menu
{
    class TemplateManager : ASingleton<TemplateManager>
    {
        public VoidDelegate OnTemplatesChanged;
        public WeekTemplateDelegate OnWeekTemplateChanged;

        public List<WeekTemplate> WeekTempltates = new List<WeekTemplate>();

        public TemplateManager()
        {
            //Inint sample templates
            WeekTemplate template = new WeekTemplate();
            template.Days[0].AddCategoryToMeal(EMealType.Dinner, new FoodCategory() { CategoryName = "Sample2", guid = Guid.NewGuid() });
            template.Days[0].AddCategoryToMeal(EMealType.Breakfast, new FoodCategory() { CategoryName = "Sample1", guid = Guid.NewGuid() });
            template.Days[0].AddCategoryToMeal(EMealType.Breakfast, new FoodCategory() { CategoryName = "Sample4", guid = Guid.NewGuid() });
            template.Days[0].AddCategoryToMeal(EMealType.Lunch, new FoodCategory() { CategoryName = "Sample3", guid = Guid.NewGuid() });
            WeekTempltates.Add(template);
        }
    }
}
