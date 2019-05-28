using Kukta.Calendar;
using Kukta.FoodFramework;
using Kukta.FrameWork;
using Kukta.Menu;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Core;
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
    public sealed partial class CalendarContentPage : Page
    {
        private Dictionary<EMealType, int> RowByMealType = new Dictionary<EMealType, int>();
        // -1 is alvays the Mealtypes
        private Dictionary<int, List<UIElement>> ElementsByDayindex = new Dictionary<int, List<UIElement>>();

        public CalendarContentPage()
        {
            this.InitializeComponent();
            DrawMeals(Enum.GetValues(typeof(EMealType)).Cast<EMealType>().ToList());
        }

        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            DateTime startDay = ((DateTime)e.Parameter).StartOfWeek(DayOfWeek.Monday);
            DrawMeals(Enum.GetValues(typeof(EMealType)).Cast<EMealType>().ToList());
            for (int i = 0; i < 7; i++)
            {
                DrawDay(Calendar.Calendar.Instance.GetDay(startDay.AddDays(i).CutToDay()));
            }
        }


        private void DrawMeals(List<EMealType> meals)
        {
            try
            {
                ElementsByDayindex[-1].ForEach((element) => ContentGrid.Children.Remove(element));
                ElementsByDayindex.Remove(-1);
            }
            catch
            {
            }
            ElementsByDayindex.Add(-1, new List<UIElement>());
            RowByMealType = new Dictionary<EMealType, int>();
            foreach (EMealType type in meals)
            {
                TextBlock TextBlock = new TextBlock();
                ContentGrid.Children.Add(TextBlock);
                ElementsByDayindex[-1].Add(TextBlock);
                TextBlock.Text = type.ToString();
                TextBlock.VerticalAlignment = VerticalAlignment.Center;
                TextBlock.HorizontalAlignment = HorizontalAlignment.Center;
                //Make grid row if not exist
                if (ContentGrid.RowDefinitions.Count <= meals.Count + 1)
                {
                    RowDefinition row = new RowDefinition
                    {
                        Height = new GridLength(1, GridUnitType.Auto),
                        MinHeight = 40.0
                    };
                    ContentGrid.RowDefinitions.Add(row);
                }
                Grid.SetRow(TextBlock, (int)type + 2);
                RowByMealType.Add(type, (int)type + 2);

            }
        }

        private async void DrawDay(CalendarDay day)
        {
            await Dispatcher.RunAsync(CoreDispatcherPriority.Normal, () =>
            {
                int dayIndex = day.DateTime.DayIndexInWeek(DayOfWeek.Monday) + 1;
                try
                {
                    day.OnDayChanged -= DrawDay;
                    List<UIElement> elements = ElementsByDayindex[dayIndex];
                    if (elements != null)
                        elements.ForEach(e => { ContentGrid.Children.Remove(e); });
                }
                catch
                {
                }
                day.OnDayChanged += DrawDay;
                if (ElementsByDayindex.ContainsKey(dayIndex))
                    ElementsByDayindex[dayIndex] = new List<UIElement>();
                else
                    ElementsByDayindex.Add(dayIndex, new List<UIElement>());

                TextBlock dayText = new TextBlock()
                {
                    Text = day.DateTime.DayOfWeek.ToString()
                };
                ElementsByDayindex[dayIndex].Add(dayText);
                ContentGrid.Children.Add(dayText);
                Grid.SetColumn(dayText, dayIndex);


                StackPanel templateSelector = new StackPanel() { Orientation = Orientation.Horizontal};
                ElementsByDayindex[dayIndex].Add(templateSelector);
                ContentGrid.Children.Add(templateSelector);
                Grid.SetColumn(templateSelector, dayIndex);
                Grid.SetRow(templateSelector, 1);
                WeekTemplateCombobox templateSelectorCombobox = new WeekTemplateCombobox(day);
                templateSelector.VerticalAlignment = VerticalAlignment.Center;
                templateSelector.Children.Add(templateSelectorCombobox);
                Button newSeedButton = new Button()
                {
                    Content = "\xE72C",
                    FontFamily = new FontFamily("Segoe MDL2 Assets"),
                    VerticalAlignment = VerticalAlignment.Stretch

                };
                newSeedButton.Click += (sender, args) => { day.NextSeed(); };
                templateSelector.Children.Add(newSeedButton);



                if (day == null)
                {
                    ProgressRing ring = new ProgressRing();
                    ring.IsActive = true;
                    ElementsByDayindex[day.DateTime.DayIndexInWeek(DayOfWeek.Monday)].Add(ring);
                    ContentGrid.Children.Add(ring);
                    return;
                }

                foreach (EMealType type in RowByMealType.Keys)
                {
                    StackPanel foodList = new StackPanel();

                    foreach (Food food in day.GetFoodsOf(type))
                    {
                        foodList.Children.Add(new FoodButton(food.Guid, null));
                    }
                    Grid.SetColumn(foodList, dayIndex);
                    Grid.SetRow(foodList, RowByMealType[type]);
                    ContentGrid.Children.Add(foodList);
                    ElementsByDayindex[dayIndex].Add(foodList);

                }
            });
        }
    }
}
