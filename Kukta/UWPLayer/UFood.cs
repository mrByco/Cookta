using Cooktapi.Food;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Media.Imaging;

namespace Kukta.UWPLayer
{
    public class UFood : Food
    {
        public new long? imageUploaded { get; private set; }
        public UFood(Food food)
        {
            _id = food._id;
            owner = food.owner;
            makeTime = food.makeTime;
            dose = food.dose;
            subcribed = food.subcribed;
            name = food.name;
            desc = food.desc;
            isPrivate = food.isPrivate;
            imageURL = food.imageURL;
            Tags = food.Tags;
            imageUploaded = food.imageUploaded;
            ingredients = food.ingredients;
        }
        public static List<UFood> FromList(List<Food> oldFoods)
        {
            List<UFood> foods = new List<UFood>();
            foreach (Food food in oldFoods)
            {
                foods.Add(new UFood(food));
            }

            return foods;
        }

        public ImageSource GetBitmapImage
        {
            get
            {
                return new BitmapImage(getImage)
                {
                    CreateOptions = BitmapCreateOptions.IgnoreImageCache,
                };
            }
        }
    }
}
