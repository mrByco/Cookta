using Kukta.Menu;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=234238

namespace Kukta.Screens
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class WeekTemplates : Page
    {
        private WeekTemplate Current;
        private List<UIElement> generatedElements = new List<UIElement>();
        public WeekTemplates()
        {
            this.InitializeComponent();
            OpenTemplate(
                new WeekTemplate()
                {
                    
                }
                );
        }

        internal void OpenTemplate(WeekTemplate week)
        {
            Current = week;
            generatedElements.ForEach(element => WeekGrid.Children.Remove(element));

            //Make meal types by 
            List<EMealType> mealTypes = new List<EMealType>();
            foreach (TemplateDay day in Current.Days)
            {
                day.GetMealTypes().ForEach(mealType =>
                {
                    if (!mealTypes.Contains(mealType)) mealTypes.Add(mealType);
                });
            }
            List<EMealType> sortedMealTypes = new List<EMealType>();
            foreach (EMealType type in Enum.GetValues(typeof(EMealType)))
            {
                if (mealTypes.Contains(type))
                {
                    sortedMealTypes.Add(type);
                }
            }
            DrawMeals(sortedMealTypes);
        }
        private void DrawMeals(List<EMealType> meals)
        {
            foreach (EMealType type in meals)
            {
                TextBlock TextBlock = new TextBlock();
                WeekGrid.Children.Add(TextBlock);
                TextBlock.Text = type.ToString();
                TextBlock.VerticalAlignment = VerticalAlignment.Center;
                TextBlock.HorizontalAlignment = HorizontalAlignment.Center;
                //Make grid row if not exist
                if (WeekGrid.RowDefinitions.Count <= meals.Count)
                {
                    RowDefinition row = new RowDefinition();
                    row.Height = new GridLength(1, GridUnitType.Auto);
                    WeekGrid.RowDefinitions.Add(row);
                }
                Grid.SetRow(TextBlock, (int)type + 1);
            }
        }
        private void OpenDay()
        {

        }


    }
}
